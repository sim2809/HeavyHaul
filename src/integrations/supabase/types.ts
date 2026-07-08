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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_settings: {
        Row: {
          call_tracking_script: string | null
          custom_footer_scripts: string | null
          custom_header_scripts: string | null
          ga_id: string | null
          google_ads_conversion_ids: Json
          google_ads_remarketing_tag: string | null
          gtm_id: string | null
          id: number
          meta_pixel_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          call_tracking_script?: string | null
          custom_footer_scripts?: string | null
          custom_header_scripts?: string | null
          ga_id?: string | null
          google_ads_conversion_ids?: Json
          google_ads_remarketing_tag?: string | null
          gtm_id?: string | null
          id?: number
          meta_pixel_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          call_tracking_script?: string | null
          custom_footer_scripts?: string | null
          custom_header_scripts?: string | null
          ga_id?: string | null
          google_ads_conversion_ids?: Json
          google_ads_remarketing_tag?: string | null
          gtm_id?: string | null
          id?: number
          meta_pixel_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          canonical_url: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          no_index: boolean
          og_description: string | null
          og_image: string | null
          og_title: string | null
          published_at: string | null
          schema_jsonld: Json | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          canonical_url?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          no_index?: boolean
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_at?: string | null
          schema_jsonld?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          canonical_url?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          no_index?: boolean
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_at?: string | null
          schema_jsonld?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          created_at: string
          destination: string | null
          email: string | null
          equipment: string | null
          extra: Json | null
          hubspot_contact_id: string | null
          hubspot_error: string | null
          hubspot_status: string
          id: string
          message: string | null
          name: string | null
          origin: string | null
          page_url: string | null
          phone: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          destination?: string | null
          email?: string | null
          equipment?: string | null
          extra?: Json | null
          hubspot_contact_id?: string | null
          hubspot_error?: string | null
          hubspot_status?: string
          id?: string
          message?: string | null
          name?: string | null
          origin?: string | null
          page_url?: string | null
          phone?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          destination?: string | null
          email?: string | null
          equipment?: string | null
          extra?: Json | null
          hubspot_contact_id?: string | null
          hubspot_error?: string | null
          hubspot_status?: string
          id?: string
          message?: string | null
          name?: string | null
          origin?: string | null
          page_url?: string | null
          phone?: string | null
          source?: string | null
        }
        Relationships: []
      }
      global_settings: {
        Row: {
          address: string | null
          business_hours: Json
          company_name: string | null
          copyright_text: string | null
          default_meta_description: string | null
          default_meta_title: string | null
          default_og_image: string | null
          email: string | null
          footer_content: string | null
          id: number
          logo_url: string | null
          phone_primary: string | null
          phone_secondary: string | null
          robots_txt: string | null
          site_url: string | null
          social_links: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          business_hours?: Json
          company_name?: string | null
          copyright_text?: string | null
          default_meta_description?: string | null
          default_meta_title?: string | null
          default_og_image?: string | null
          email?: string | null
          footer_content?: string | null
          id?: number
          logo_url?: string | null
          phone_primary?: string | null
          phone_secondary?: string | null
          robots_txt?: string | null
          site_url?: string | null
          social_links?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          business_hours?: Json
          company_name?: string | null
          copyright_text?: string | null
          default_meta_description?: string | null
          default_meta_title?: string | null
          default_og_image?: string | null
          email?: string | null
          footer_content?: string | null
          id?: number
          logo_url?: string | null
          phone_primary?: string | null
          phone_secondary?: string | null
          robots_txt?: string | null
          site_url?: string | null
          social_links?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      hubspot_settings: {
        Row: {
          created_at: string
          enabled: boolean
          form_id: string | null
          id: number
          notes: string | null
          portal_id: string | null
          private_app_token: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          form_id?: string | null
          id?: number
          notes?: string | null
          portal_id?: string | null
          private_app_token?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          form_id?: string | null
          id?: number
          notes?: string | null
          portal_id?: string | null
          private_app_token?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          folder: string | null
          height: number | null
          id: string
          mime_type: string | null
          public_url: string
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url: string
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url?: string
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          created_at: string
          enabled: boolean
          icon: string | null
          id: string
          label: string
          menu_id: string
          open_in_new_tab: boolean
          parent_id: string | null
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          icon?: string | null
          id?: string
          label: string
          menu_id: string
          open_in_new_tab?: boolean
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          icon?: string | null
          id?: string
          label?: string
          menu_id?: string
          open_in_new_tab?: boolean
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "nav_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "nav_menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nav_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "nav_items"
            referencedColumns: ["id"]
          },
        ]
      }
      nav_menus: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          created_at: string
          data: Json
          enabled: boolean
          id: string
          name: string | null
          page_id: string
          sort_order: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          enabled?: boolean
          id?: string
          name?: string | null
          page_id: string
          sort_order?: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          enabled?: boolean
          id?: string
          name?: string | null
          page_id?: string
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          seo: Json | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          seo?: Json | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          seo?: Json | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      redirects: {
        Row: {
          created_at: string
          enabled: boolean
          from_path: string
          id: string
          status_code: number
          to_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          from_path: string
          id?: string
          status_code?: number
          to_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          from_path?: string
          id?: string
          status_code?: number
          to_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_overrides: {
        Row: {
          canonical: string | null
          created_at: string
          description: string | null
          id: string
          json_ld: Json | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          og_type: string | null
          path: string
          robots: string | null
          title: string | null
          twitter_card: string | null
          updated_at: string
        }
        Insert: {
          canonical?: string | null
          created_at?: string
          description?: string | null
          id?: string
          json_ld?: Json | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_type?: string | null
          path: string
          robots?: string | null
          title?: string | null
          twitter_card?: string | null
          updated_at?: string
        }
        Update: {
          canonical?: string | null
          created_at?: string
          description?: string | null
          id?: string
          json_ld?: Json | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_type?: string | null
          path?: string
          robots?: string | null
          title?: string | null
          twitter_card?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          block_key: string
          content: string
          created_at: string
          enabled: boolean
          id: string
          kind: string
          label: string
          page_key: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          block_key: string
          content?: string
          created_at?: string
          enabled?: boolean
          id?: string
          kind?: string
          label: string
          page_key: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          block_key?: string
          content?: string
          created_at?: string
          enabled?: boolean
          id?: string
          kind?: string
          label?: string
          page_key?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "owner"
        | "admin"
        | "marketing_manager"
        | "seo_specialist"
        | "content_editor"
      post_status: "draft" | "published" | "scheduled"
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
    Enums: {
      app_role: [
        "owner",
        "admin",
        "marketing_manager",
        "seo_specialist",
        "content_editor",
      ],
      post_status: ["draft", "published", "scheduled"],
    },
  },
} as const
