import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useStoreSettings = () => {
  return useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("store_settings").select("*");
      const map: Record<string, any> = {};
      (data || []).forEach((row: any) => {
        map[row.key] = row.value;
      });
      return map;
    },
  });
};

export const useStoreSetting = (key: string) => {
  const { data: all, ...rest } = useStoreSettings();
  return { data: all?.[key], ...rest };
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      // Upsert: try update first, if no rows affected then insert
      const { data, error } = await supabase
        .from("store_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from("store_settings")
          .insert({ key, value, updated_at: new Date().toISOString() });
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-settings"] });
      toast({ title: "Settings saved ✅" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
};
