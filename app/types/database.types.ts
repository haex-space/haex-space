export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      extension_downloads: {
        Row: {
          app_version: string | null
          created_at: string
          extension_id: string
          id: string
          ip_hash: string | null
          platform: string | null
          user_agent: string | null
          user_id: string | null
          version_id: string
        }
        Insert: {
          app_version?: string | null
          created_at?: string
          extension_id: string
          id?: string
          ip_hash?: string | null
          platform?: string | null
          user_agent?: string | null
          user_id?: string | null
          version_id: string
        }
        Update: {
          app_version?: string | null
          created_at?: string
          extension_id?: string
          id?: string
          ip_hash?: string | null
          platform?: string | null
          user_agent?: string | null
          user_id?: string | null
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "extension_downloads_extension_id_extensions_id_fk"
            columns: ["extension_id"]
            isOneToOne: false
            referencedRelation: "extensions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extension_downloads_version_id_extension_versions_id_fk"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "extension_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      extension_reviews: {
        Row: {
          content: string | null
          created_at: string
          extension_id: string
          id: string
          rating: number
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          extension_id: string
          id?: string
          rating: number
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          extension_id?: string
          id?: string
          rating?: number
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "extension_reviews_extension_id_extensions_id_fk"
            columns: ["extension_id"]
            isOneToOne: false
            referencedRelation: "extensions"
            referencedColumns: ["id"]
          },
        ]
      }
      extension_screenshots: {
        Row: {
          caption: string | null
          created_at: string
          extension_id: string
          id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          caption?: string | null
          created_at?: string
          extension_id: string
          id?: string
          image_url: string
          sort_order?: number
        }
        Update: {
          caption?: string | null
          created_at?: string
          extension_id?: string
          id?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "extension_screenshots_extension_id_extensions_id_fk"
            columns: ["extension_id"]
            isOneToOne: false
            referencedRelation: "extensions"
            referencedColumns: ["id"]
          },
        ]
      }
      extension_versions: {
        Row: {
          bundle_hash: string
          bundle_path: string
          bundle_size: number
          changelog: string | null
          created_at: string
          downloads: number
          extension_id: string
          id: string
          manifest: Json
          max_app_version: string | null
          min_app_version: string | null
          permissions: string[] | null
          published_at: string | null
          version: string
        }
        Insert: {
          bundle_hash: string
          bundle_path: string
          bundle_size: number
          changelog?: string | null
          created_at?: string
          downloads?: number
          extension_id: string
          id?: string
          manifest: Json
          max_app_version?: string | null
          min_app_version?: string | null
          permissions?: string[] | null
          published_at?: string | null
          version: string
        }
        Update: {
          bundle_hash?: string
          bundle_path?: string
          bundle_size?: number
          changelog?: string | null
          created_at?: string
          downloads?: number
          extension_id?: string
          id?: string
          manifest?: Json
          max_app_version?: string | null
          min_app_version?: string | null
          permissions?: string[] | null
          published_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "extension_versions_extension_id_extensions_id_fk"
            columns: ["extension_id"]
            isOneToOne: false
            referencedRelation: "extensions"
            referencedColumns: ["id"]
          },
        ]
      }
      extensions: {
        Row: {
          author: string | null
          average_rating: number | null
          category_id: string | null
          created_at: string
          description: string
          extension_id: string
          icon_url: string | null
          id: string
          name: string
          public_key: string
          published_at: string | null
          publisher_id: string
          review_count: number
          short_description: string
          slug: string
          tags: string[] | null
          total_downloads: number
          updated_at: string
          verified: boolean
        }
        Insert: {
          author?: string | null
          average_rating?: number | null
          category_id?: string | null
          created_at?: string
          description: string
          extension_id: string
          icon_url?: string | null
          id?: string
          name: string
          public_key: string
          published_at?: string | null
          publisher_id: string
          review_count?: number
          short_description: string
          slug: string
          tags?: string[] | null
          total_downloads?: number
          updated_at?: string
          verified?: boolean
        }
        Update: {
          author?: string | null
          average_rating?: number | null
          category_id?: string | null
          created_at?: string
          description?: string
          extension_id?: string
          icon_url?: string | null
          id?: string
          name?: string
          public_key?: string
          published_at?: string | null
          publisher_id?: string
          review_count?: number
          short_description?: string
          slug?: string
          tags?: string[] | null
          total_downloads?: number
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "extensions_category_id_categories_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extensions_publisher_id_publishers_id_fk"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
        ]
      }
      publisher_api_keys: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          publisher_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          publisher_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          publisher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publisher_api_keys_publisher_id_publishers_id_fk"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
        ]
      }
      publishers: {
        Row: {
          avatar_url: string | null
          created_at: string
          description: string | null
          display_name: string
          email: string | null
          id: string
          slug: string
          updated_at: string
          user_id: string
          verified: boolean
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          display_name: string
          email?: string | null
          id?: string
          slug: string
          updated_at?: string
          user_id: string
          verified?: boolean
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          display_name?: string
          email?: string | null
          id?: string
          slug?: string
          updated_at?: string
          user_id?: string
          verified?: boolean
          website?: string | null
        }
        Relationships: []
      }
      storage_tiers: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          price_monthly_euro_cents: number | null
          quota_bytes: number
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          price_monthly_euro_cents?: number | null
          quota_bytes: number
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          price_monthly_euro_cents?: number | null
          quota_bytes?: number
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      sync_changes: {
        Row: {
          column_name: string | null
          created_at: string
          device_id: string | null
          encrypted_value: string | null
          hlc_timestamp: string
          id: string
          nonce: string | null
          row_pks: string
          table_name: string
          updated_at: string
          user_id: string
          vault_id: string
        }
        Insert: {
          column_name?: string | null
          created_at?: string
          device_id?: string | null
          encrypted_value?: string | null
          hlc_timestamp: string
          id?: string
          nonce?: string | null
          row_pks: string
          table_name: string
          updated_at?: string
          user_id: string
          vault_id: string
        }
        Update: {
          column_name?: string | null
          created_at?: string
          device_id?: string | null
          encrypted_value?: string | null
          hlc_timestamp?: string
          id?: string
          nonce?: string | null
          row_pks?: string
          table_name?: string
          updated_at?: string
          user_id?: string
          vault_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_changes_vault_fk"
            columns: ["user_id", "vault_id"]
            isOneToOne: false
            referencedRelation: "vault_keys"
            referencedColumns: ["user_id", "vault_id"]
          },
        ]
      }
      sync_changes_2ec0c40e_2bad_415b_9c47_c18c5977fdc8: {
        Row: {
          column_name: string | null
          created_at: string
          device_id: string | null
          encrypted_value: string | null
          hlc_timestamp: string
          id: string
          nonce: string | null
          row_pks: string
          table_name: string
          updated_at: string
          user_id: string
          vault_id: string
        }
        Insert: {
          column_name?: string | null
          created_at?: string
          device_id?: string | null
          encrypted_value?: string | null
          hlc_timestamp: string
          id?: string
          nonce?: string | null
          row_pks: string
          table_name: string
          updated_at?: string
          user_id: string
          vault_id: string
        }
        Update: {
          column_name?: string | null
          created_at?: string
          device_id?: string | null
          encrypted_value?: string | null
          hlc_timestamp?: string
          id?: string
          nonce?: string | null
          row_pks?: string
          table_name?: string
          updated_at?: string
          user_id?: string
          vault_id?: string
        }
        Relationships: []
      }
      sync_changes_7dc7ccca_baa2_410d_9732_f6ccd54396e4: {
        Row: {
          column_name: string | null
          created_at: string
          device_id: string | null
          encrypted_value: string | null
          hlc_timestamp: string
          id: string
          nonce: string | null
          row_pks: string
          table_name: string
          updated_at: string
          user_id: string
          vault_id: string
        }
        Insert: {
          column_name?: string | null
          created_at?: string
          device_id?: string | null
          encrypted_value?: string | null
          hlc_timestamp: string
          id?: string
          nonce?: string | null
          row_pks: string
          table_name: string
          updated_at?: string
          user_id: string
          vault_id: string
        }
        Update: {
          column_name?: string | null
          created_at?: string
          device_id?: string | null
          encrypted_value?: string | null
          hlc_timestamp?: string
          id?: string
          nonce?: string | null
          row_pks?: string
          table_name?: string
          updated_at?: string
          user_id?: string
          vault_id?: string
        }
        Relationships: []
      }
      sync_changes_a046ec9b_f6d2_4871_9586_165462428d85: {
        Row: {
          column_name: string | null
          created_at: string
          device_id: string | null
          encrypted_value: string | null
          hlc_timestamp: string
          id: string
          nonce: string | null
          row_pks: string
          table_name: string
          updated_at: string
          user_id: string
          vault_id: string
        }
        Insert: {
          column_name?: string | null
          created_at?: string
          device_id?: string | null
          encrypted_value?: string | null
          hlc_timestamp: string
          id?: string
          nonce?: string | null
          row_pks: string
          table_name: string
          updated_at?: string
          user_id: string
          vault_id: string
        }
        Update: {
          column_name?: string | null
          created_at?: string
          device_id?: string | null
          encrypted_value?: string | null
          hlc_timestamp?: string
          id?: string
          nonce?: string | null
          row_pks?: string
          table_name?: string
          updated_at?: string
          user_id?: string
          vault_id?: string
        }
        Relationships: []
      }
      sync_changes_default: {
        Row: {
          column_name: string | null
          created_at: string
          device_id: string | null
          encrypted_value: string | null
          hlc_timestamp: string
          id: string
          nonce: string | null
          row_pks: string
          table_name: string
          updated_at: string
          user_id: string
          vault_id: string
        }
        Insert: {
          column_name?: string | null
          created_at?: string
          device_id?: string | null
          encrypted_value?: string | null
          hlc_timestamp: string
          id?: string
          nonce?: string | null
          row_pks: string
          table_name: string
          updated_at?: string
          user_id: string
          vault_id: string
        }
        Update: {
          column_name?: string | null
          created_at?: string
          device_id?: string | null
          encrypted_value?: string | null
          hlc_timestamp?: string
          id?: string
          nonce?: string | null
          row_pks?: string
          table_name?: string
          updated_at?: string
          user_id?: string
          vault_id?: string
        }
        Relationships: []
      }
      user_storage_quotas: {
        Row: {
          admin_override_bytes: number | null
          created_at: string
          tier_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_override_bytes?: number | null
          created_at?: string
          tier_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_override_bytes?: number | null
          created_at?: string
          tier_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_storage_quotas_tier_id_storage_tiers_id_fk"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "storage_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      vault_keys: {
        Row: {
          created_at: string
          encrypted_vault_key: string
          encrypted_vault_name: string
          id: string
          updated_at: string
          user_id: string
          vault_id: string
          vault_key_nonce: string
          vault_key_salt: string
          vault_name_nonce: string
          vault_name_salt: string
        }
        Insert: {
          created_at?: string
          encrypted_vault_key: string
          encrypted_vault_name: string
          id?: string
          updated_at?: string
          user_id: string
          vault_id: string
          vault_key_nonce: string
          vault_key_salt: string
          vault_name_nonce: string
          vault_name_salt: string
        }
        Update: {
          created_at?: string
          encrypted_vault_key?: string
          encrypted_vault_name?: string
          id?: string
          updated_at?: string
          user_id?: string
          vault_id?: string
          vault_key_nonce?: string
          vault_key_salt?: string
          vault_name_nonce?: string
          vault_name_salt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_user_storage_usage: {
        Args: { p_user_id: string }
        Returns: number
      }
      check_storage_quota: {
        Args: { p_file_size: number; p_user_id: string }
        Returns: boolean
      }
      get_user_storage_quota: {
        Args: { p_user_id: string }
        Returns: {
          quota_bytes: number
          tier_name: string
          tier_slug: string
          used_bytes: number
        }[]
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

