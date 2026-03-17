import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const isAdmin = roles?.some((r: any) => r.role === "admin");
      if (!isAdmin) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        toast({ title: "Access Denied", description: "Admin privileges required.", variant: "destructive" });
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/admin/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border/50 bg-card px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground hidden sm:block">
                🧶 HookOnLoop Admin
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-xl text-muted-foreground hover:text-destructive">
                <LogOut size={16} />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
