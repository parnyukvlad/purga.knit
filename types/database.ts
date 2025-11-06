export interface Database {
  public: {
    Tables: {
      purgaknit_users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          updated_at?: string
        }
      }
      purgaknit_categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
        }
      }
      purgaknit_sizes: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
        }
      }
      purgaknit_items: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          size_id: number
          category_id: number
          image_url: string
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price: number
          size_id: number
          category_id: number
          image_url: string
          stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number
          size_id?: number
          category_id?: number
          image_url?: string
          stock?: number
          updated_at?: string
        }
      }
      purgaknit_orders: {
        Row: {
          id: number
          user_id: string
          stripe_payment_intent_id: string | null
          total_amount: number
          shipping_cost: number
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          stripe_payment_intent_id?: string | null
          total_amount: number
          shipping_cost: number
          status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          stripe_payment_intent_id?: string | null
          total_amount?: number
          shipping_cost?: number
          status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address_id?: number
          updated_at?: string
        }
      }
      purgaknit_order_items: {
        Row: {
          id: number
          order_id: number
          item_id: number
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: number
          order_id: number
          item_id: number
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: number
          item_id?: number
          quantity?: number
          price?: number
        }
      }
      purgaknit_shipping_addresses: {
        Row: {
          id: number
          user_id: string
          full_name: string
          street_address: string
          city: string
          postal_code: string
          country: string
          phone: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          full_name: string
          street_address: string
          city: string
          postal_code: string
          country: string
          phone?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          full_name?: string
          street_address?: string
          city?: string
          postal_code?: string
          country?: string
          phone?: string | null
          is_default?: boolean
          updated_at?: string
        }
      }
    }
  }
}

