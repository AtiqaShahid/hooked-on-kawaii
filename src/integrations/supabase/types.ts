export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          emoji: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      collection_products: {
        Row: {
          collection_id: string
          id: string
          product_id: string
        }
        Insert: {
          collection_id: string
          id?: string
          product_id: string
        }
        Update: {
          collection_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          available_count: number | null
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_limited: boolean | null
          name: string
          slug: string
          starts_at: string | null
          total_count: number | null
        }
        Insert: {
          available_count?: number | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_limited?: boolean | null
          name: string
          slug: string
          starts_at?: string | null
          total_count?: number | null
        }
        Update: {
          available_count?: number | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_limited?: boolean | null
          name?: string
          slug?: string
          starts_at?: string | null
          total_count?: number | null
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          is_approved: boolean | null
          likes_count: number | null
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          likes_count?: number | null
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          likes_count?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      craft_stories: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_published: boolean | null
          product_id: string | null
          slug: string
          time_to_make: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          product_id?: string | null
          slug: string
          time_to_make?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          product_id?: string | null
          slug?: string
          time_to_make?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "craft_stories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_crochet_orders: {
        Row: {
          attachment: string | null
          colors: string[] | null
          created_at: string
          id: string
          preview_url: string | null
          price: number | null
          size: string | null
          status: string | null
          user_id: string | null
          yarn_type: string | null
        }
        Insert: {
          attachment?: string | null
          colors?: string[] | null
          created_at?: string
          id?: string
          preview_url?: string | null
          price?: number | null
          size?: string | null
          status?: string | null
          user_id?: string | null
          yarn_type?: string | null
        }
        Update: {
          attachment?: string | null
          colors?: string[] | null
          created_at?: string
          id?: string
          preview_url?: string | null
          price?: number | null
          size?: string | null
          status?: string | null
          user_id?: string | null
          yarn_type?: string | null
        }
        Relationships: []
      }
      design_requests: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          status: string | null
          title: string
          user_id: string
          votes_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          status?: string | null
          title: string
          user_id: string
          votes_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          status?: string | null
          title?: string
          user_id?: string
          votes_count?: number | null
        }
        Relationships: []
      }
      design_votes: {
        Row: {
          created_at: string
          id: string
          request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          request_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_votes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "design_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          is_approved: boolean | null
          user_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_approved?: boolean | null
          user_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_approved?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      gift_builder_orders: {
        Row: {
          color_theme: string | null
          created_at: string
          id: string
          item: string | null
          message: string | null
          packaging: string | null
          price: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          color_theme?: string | null
          created_at?: string
          id?: string
          item?: string | null
          message?: string | null
          packaging?: string | null
          price?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          color_theme?: string | null
          created_at?: string
          id?: string
          item?: string | null
          message?: string | null
          packaging?: string | null
          price?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      learning_resources: {
        Row: {
          category: string
          content: string
          created_at: string
          difficulty: string | null
          download_url: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          slug: string
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          difficulty?: string | null
          download_url?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          slug: string
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          difficulty?: string | null
          download_url?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          points: number
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          points?: number
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          points?: number
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          color: string | null
          created_at: string
          customizations: Json | null
          id: string
          order_id: string
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          customizations?: Json | null
          id?: string
          order_id: string
          price: number
          product_id?: string | null
          quantity?: number
        }
        Update: {
          color?: string | null
          created_at?: string
          customizations?: Json | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          shipping_address: Json | null
          status: string
          total: number
          tracking_stage: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          shipping_address?: Json | null
          status?: string
          total: number
          tracking_stage?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          shipping_address?: Json | null
          status?: string
          total?: number
          tracking_stage?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_analytics: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badges: string[] | null
          category_id: string | null
          colors: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          original_price: number | null
          popularity_score: number | null
          price: number
          rating: number | null
          review_count: number | null
          slug: string
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          badges?: string[] | null
          category_id?: string | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          original_price?: number | null
          popularity_score?: number | null
          price: number
          rating?: number | null
          review_count?: number | null
          slug: string
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          badges?: string[] | null
          category_id?: string | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          original_price?: number | null
          popularity_score?: number | null
          price?: number
          rating?: number | null
          review_count?: number | null
          slug?: string
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          loyalty_points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          loyalty_points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          loyalty_points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_approved: boolean | null
          is_featured: boolean | null
          product_id: string
          rating: number
          review_text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          product_id: string
          rating: number
          review_text?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          product_id?: string
          rating?: number
          review_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      social_proof_log: {
        Row: {
          city: string | null
          created_at: string
          id: string
          product_id: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_proof_log_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          next_delivery_date: string | null
          plan: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          next_delivery_date?: string | null
          plan?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          next_delivery_date?: string | null
          plan?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      surprise_boxes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
