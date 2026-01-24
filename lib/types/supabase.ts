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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          mdx_file_path: string
          published: boolean | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          mdx_file_path: string
          published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          mdx_file_path?: string
          published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_id: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string | null
          user_id: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          consent_type: string
          granted: boolean
          granted_at: string
          id: string
          metadata: Json | null
          revoked_at: string | null
          user_id: string | null
        }
        Insert: {
          consent_type: string
          granted: boolean
          granted_at?: string
          id?: string
          metadata?: Json | null
          revoked_at?: string | null
          user_id?: string | null
        }
        Update: {
          consent_type?: string
          granted?: boolean
          granted_at?: string
          id?: string
          metadata?: Json | null
          revoked_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cookie_consents: {
        Row: {
          analytics: boolean
          consent_date: string
          essential: boolean
          id: string
          marketing: boolean
          updated_at: string
          user_id: string | null
        }
        Insert: {
          analytics?: boolean
          consent_date?: string
          essential?: boolean
          id?: string
          marketing?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          analytics?: boolean
          consent_date?: string
          essential?: boolean
          id?: string
          marketing?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean | null
          applies_to: Json | null
          code: string
          created_at: string | null
          id: string
          maximum_discount: number | null
          minimum_purchase: number | null
          type: string
          usage_count: number | null
          usage_limit: number | null
          valid_from: string | null
          valid_until: string | null
          value: number
        }
        Insert: {
          active?: boolean | null
          applies_to?: Json | null
          code: string
          created_at?: string | null
          id?: string
          maximum_discount?: number | null
          minimum_purchase?: number | null
          type: string
          usage_count?: number | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
          value: number
        }
        Update: {
          active?: boolean | null
          applies_to?: Json | null
          code?: string
          created_at?: string | null
          id?: string
          maximum_discount?: number | null
          minimum_purchase?: number | null
          type?: string
          usage_count?: number | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
          value?: number
        }
        Relationships: []
      }
      download_logs: {
        Row: {
          downloaded_at: string | null
          id: string
          ip_address: unknown
          order_item_id: string
          user_agent: string | null
        }
        Insert: {
          downloaded_at?: string | null
          id?: string
          ip_address?: unknown
          order_item_id: string
          user_agent?: string | null
        }
        Update: {
          downloaded_at?: string | null
          id?: string
          ip_address?: unknown
          order_item_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_logs_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          access_granted_at: string | null
          activated_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          license_key: string
          lifetime_access: boolean | null
          order_id: string
          product_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_granted_at?: string | null
          activated_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          license_key: string
          lifetime_access?: boolean | null
          order_id: string
          product_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_granted_at?: string | null
          activated_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          license_key?: string
          lifetime_access?: boolean | null
          order_id?: string
          product_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "licenses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_newsletter: boolean | null
          email_order_confirmation: boolean | null
          email_order_shipped: boolean | null
          email_product_updates: boolean | null
          email_promotional: boolean | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_newsletter?: boolean | null
          email_order_confirmation?: boolean | null
          email_order_shipped?: boolean | null
          email_product_updates?: boolean | null
          email_promotional?: boolean | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_newsletter?: boolean | null
          email_order_confirmation?: boolean | null
          email_order_shipped?: boolean | null
          email_product_updates?: boolean | null
          email_promotional?: boolean | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          download_key: string | null
          downloads_count: number | null
          expires_at: string | null
          id: string
          order_id: string
          price: number
          product_id: string
          product_name: string | null
          product_sku: string | null
          quantity: number
          total_price: number | null
          unit_price: number | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          download_key?: string | null
          downloads_count?: number | null
          expires_at?: string | null
          id?: string
          order_id: string
          price: number
          product_id: string
          product_name?: string | null
          product_sku?: string | null
          quantity?: number
          total_price?: number | null
          unit_price?: number | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          download_key?: string | null
          downloads_count?: number | null
          expires_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          product_name?: string | null
          product_sku?: string | null
          quantity?: number
          total_price?: number | null
          unit_price?: number | null
          variant_id?: string | null
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
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string | null
          currency: string | null
          customer_email: string | null
          customer_name: string | null
          discount_amount: number | null
          id: string
          metadata: Json | null
          order_number: string | null
          shipping_address: Json | null
          status: string | null
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          id?: string
          metadata?: Json | null
          order_number?: string | null
          shipping_address?: Json | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          id?: string
          metadata?: Json | null
          order_number?: string | null
          shipping_address?: Json | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      product_recommendations: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          priority: number | null
          product_id: string
          recommendation_type: string
          recommended_product_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          priority?: number | null
          product_id: string
          recommendation_type: string
          recommended_product_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          priority?: number | null
          product_id?: string
          recommendation_type?: string
          recommended_product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_recommendations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_recommendations_recommended_product_id_fkey"
            columns: ["recommended_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          original_price: number | null
          price: number
          product_id: string
          sku: string | null
          stock_quantity: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          original_price?: number | null
          price: number
          product_id: string
          sku?: string | null
          stock_quantity?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          original_price?: number | null
          price?: number
          product_id?: string
          sku?: string | null
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category: string | null
          content_hours: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          featured: boolean | null
          file_path: string | null
          file_size: number | null
          id: string
          image_url: string | null
          images: Json | null
          name: string
          original_price: number | null
          package_image: string | null
          price: number
          pricing_justification: string | null
          published: boolean | null
          rating: number | null
          review_count: number | null
          slug: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          tagline: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          content_hours?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          featured?: boolean | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          image_url?: string | null
          images?: Json | null
          name: string
          original_price?: number | null
          package_image?: string | null
          price: number
          pricing_justification?: string | null
          published?: boolean | null
          rating?: number | null
          review_count?: number | null
          slug: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          tagline?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          content_hours?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          featured?: boolean | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          image_url?: string | null
          images?: Json | null
          name?: string
          original_price?: number | null
          package_image?: string | null
          price?: number
          pricing_justification?: string | null
          published?: boolean | null
          rating?: number | null
          review_count?: number | null
          slug?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          tagline?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string
          stripe_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recently_viewed_products: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          session_id: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          session_id?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          session_id?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendation_analytics: {
        Row: {
          created_at: string | null
          event: string
          id: string
          metadata: Json | null
          product_id: string
          recommendation_id: string | null
          recommended_product_id: string
          session_id: string | null
          timestamp: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event: string
          id?: string
          metadata?: Json | null
          product_id: string
          recommendation_id?: string | null
          recommended_product_id: string
          session_id?: string | null
          timestamp?: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event?: string
          id?: string
          metadata?: Json | null
          product_id?: string
          recommendation_id?: string | null
          recommended_product_id?: string
          session_id?: string | null
          timestamp?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendation_analytics_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "product_recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendation_analytics_recommended_product_id_fkey"
            columns: ["recommended_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          order_id: string | null
          product_id: string
          rating: number
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string
          verified_purchase: boolean | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          order_id?: string | null
          product_id: string
          rating: number
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          verified_purchase?: boolean | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          order_id?: string | null
          product_id?: string
          rating?: number
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_addresses: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_default_billing: boolean | null
          is_default_shipping: boolean | null
          label: string | null
          phone: string | null
          state: string | null
          street: string | null
          type: string
          updated_at: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_default_billing?: boolean | null
          is_default_shipping?: boolean | null
          label?: string | null
          phone?: string | null
          state?: string | null
          street?: string | null
          type: string
          updated_at?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_default_billing?: boolean | null
          is_default_shipping?: boolean | null
          label?: string | null
          phone?: string | null
          state?: string | null
          street?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
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
      generate_license_key: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
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
