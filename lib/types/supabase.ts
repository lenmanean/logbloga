/**
 * Types generated from Supabase database schema
 * 
 * To regenerate these types after running migrations:
 * 1. Run: npx supabase gen types typescript --project-id <project-ref> > lib/types/supabase.ts
 *    OR for local: npx supabase gen types typescript --local > lib/types/supabase.ts
 * 
 * This file is a placeholder until migrations are run and types are generated.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          category: string
          price: number
          original_price: number | null
          difficulty: 'beginner' | 'intermediate' | 'advanced' | null
          duration: string | null
          content_hours: string | null
          package_image: string | null
          images: Json
          tagline: string | null
          modules: Json
          resources: Json
          bonus_assets: Json
          pricing_justification: string | null
          rating: number | null
          review_count: number
          featured: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          category: string
          price: number
          original_price?: number | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          duration?: string | null
          content_hours?: string | null
          package_image?: string | null
          images?: Json
          tagline?: string | null
          modules?: Json
          resources?: Json
          bonus_assets?: Json
          pricing_justification?: string | null
          rating?: number | null
          review_count?: number
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          category?: string
          price?: number
          original_price?: number | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          duration?: string | null
          content_hours?: string | null
          package_image?: string | null
          images?: Json
          tagline?: string | null
          modules?: Json
          resources?: Json
          bonus_assets?: Json
          pricing_justification?: string | null
          rating?: number | null
          review_count?: number
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          variant_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          variant_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          order_number: string
          status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
          total_amount: number
          subtotal: number
          tax_amount: number
          discount_amount: number
          currency: string
          stripe_payment_intent_id: string | null
          stripe_checkout_session_id: string | null
          customer_email: string
          customer_name: string | null
          billing_address: Json | null
          shipping_address: Json | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          order_number: string
          status?: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
          total_amount: number
          subtotal: number
          tax_amount?: number
          discount_amount?: number
          currency?: string
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
          customer_email: string
          customer_name?: string | null
          billing_address?: Json | null
          shipping_address?: Json | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          order_number?: string
          status?: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
          total_amount?: number
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          currency?: string
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
          customer_email?: string
          customer_name?: string | null
          billing_address?: Json | null
          shipping_address?: Json | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      licenses: {
        Row: {
          id: string
          user_id: string
          order_id: string
          product_id: string
          license_key: string
          status: 'active' | 'inactive' | 'revoked'
          activated_at: string | null
          expires_at: string | null
          lifetime_access: boolean
          access_granted_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_id: string
          product_id: string
          license_key: string
          status?: 'active' | 'inactive' | 'revoked'
          activated_at?: string | null
          expires_at?: string | null
          lifetime_access?: boolean
          access_granted_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string
          product_id?: string
          license_key?: string
          status?: 'active' | 'inactive' | 'revoked'
          activated_at?: string | null
          expires_at?: string | null
          lifetime_access?: boolean
          access_granted_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
  }
}

// Helper type exports for common use cases
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table type exports
export type Profile = Tables<'profiles'>
export type Product = Tables<'products'>
export type CartItem = Tables<'cart_items'>
export type Order = Tables<'orders'>
export type License = Tables<'licenses'>

