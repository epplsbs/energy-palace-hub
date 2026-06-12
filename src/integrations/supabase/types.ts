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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      about_us: {
        Row: {
          company_story: string | null
          created_at: string
          display_order: number | null
          hero_image_url: string | null
          id: string
          is_active: boolean | null
          mission_statement: string | null
          team_description: string | null
          title: string
          updated_at: string
          values: Json | null
          vision_statement: string | null
        }
        Insert: {
          company_story?: string | null
          created_at?: string
          display_order?: number | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean | null
          mission_statement?: string | null
          team_description?: string | null
          title?: string
          updated_at?: string
          values?: Json | null
          vision_statement?: string | null
        }
        Update: {
          company_story?: string | null
          created_at?: string
          display_order?: number | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean | null
          mission_statement?: string | null
          team_description?: string | null
          title?: string
          updated_at?: string
          values?: Json | null
          vision_statement?: string | null
        }
        Relationships: []
      }
      driver_commissions: {
        Row: {
          amount: number
          created_at: string | null
          driver_id: string | null
          id: string
          notes: string | null
          order_id: string | null
          status: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          driver_id?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          status?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          driver_id?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_commissions_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string | null
          driver_photo_url: string | null
          full_name: string
          id: string
          is_public: boolean | null
          phone: string
          referral_code: string | null
          referred_by_id: string | null
          status: string | null
          tier: Database["public"]["Enums"]["driver_loyalty_tier"] | null
          total_sales_amount: number | null
          updated_at: string | null
          vehicle_number: string
          vehicle_photo_url: string | null
          visit_count: number | null
        }
        Insert: {
          created_at?: string | null
          driver_photo_url?: string | null
          full_name: string
          id?: string
          is_public?: boolean | null
          phone: string
          referral_code?: string | null
          referred_by_id?: string | null
          status?: string | null
          tier?: Database["public"]["Enums"]["driver_loyalty_tier"] | null
          total_sales_amount?: number | null
          updated_at?: string | null
          vehicle_number: string
          vehicle_photo_url?: string | null
          visit_count?: number | null
        }
        Update: {
          created_at?: string | null
          driver_photo_url?: string | null
          full_name?: string
          id?: string
          is_public?: boolean | null
          phone?: string
          referral_code?: string | null
          referred_by_id?: string | null
          status?: string | null
          tier?: Database["public"]["Enums"]["driver_loyalty_tier"] | null
          total_sales_amount?: number | null
          updated_at?: string | null
          vehicle_number?: string
          vehicle_photo_url?: string | null
          visit_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_referred_by_id_fkey"
            columns: ["referred_by_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_content_suggestions: {
        Row: {
          content: string
          content_type: string
          created_at: string | null
          id: string
          keywords: string[] | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          target_audience: string | null
          title: string
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          target_audience?: string | null
          title: string
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          target_audience?: string | null
          title?: string
        }
        Relationships: []
      }
      bill_templates: {
        Row: {
          aspect_ratio: number
          created_at: string | null
          id: string
          image_data: string
          mapping: Json
          name: string
          user_id: string
        }
        Insert: {
          aspect_ratio: number
          created_at?: string | null
          id?: string
          image_data: string
          mapping?: Json
          name: string
          user_id: string
        }
        Update: {
          aspect_ratio?: number
          created_at?: string | null
          id?: string
          image_data?: string
          mapping?: Json
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          content: string | null
          cover_image: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      charger_reservations: {
        Row: {
          charging_station_id: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          end_time: string
          id: string
          reservation_date: string
          special_requests: string | null
          start_time: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          charging_station_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          end_time: string
          id?: string
          reservation_date: string
          special_requests?: string | null
          start_time: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          charging_station_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          end_time?: string
          id?: string
          reservation_date?: string
          special_requests?: string | null
          start_time?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "charger_reservations_charging_station_id_fkey"
            columns: ["charging_station_id"]
            isOneToOne: false
            referencedRelation: "charging_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      charger_status: {
        Row: {
          charger_id: string | null
          connector_id: number | null
          error_code: string | null
          id: number
          is_available: boolean
          last_heartbeat: string | null
          updated_at: string
        }
        Insert: {
          charger_id?: string | null
          connector_id?: number | null
          error_code?: string | null
          id?: number
          is_available?: boolean
          last_heartbeat?: string | null
          updated_at?: string
        }
        Update: {
          charger_id?: string | null
          connector_id?: number | null
          error_code?: string | null
          id?: number
          is_available?: boolean
          last_heartbeat?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      charging_stations: {
        Row: {
          connector: string
          created_at: string
          estimated_time: string | null
          id: string
          power: string
          station_id: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          connector: string
          created_at?: string
          estimated_time?: string | null
          id?: string
          power: string
          station_id: string
          status: string
          type: string
          updated_at?: string
        }
        Update: {
          connector?: string
          created_at?: string
          estimated_time?: string | null
          id?: string
          power?: string
          station_id?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string | null
          department: string | null
          display_order: number | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          photo_url: string | null
          position: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          alt_text: string | null
          bio: string | null
          created_at: string
          designation: string
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          specialties: string[] | null
        }
        Insert: {
          alt_text?: string | null
          bio?: string | null
          created_at?: string
          designation: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          specialties?: string[] | null
        }
        Update: {
          alt_text?: string | null
          bio?: string | null
          created_at?: string
          designation?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          specialties?: string[] | null
        }
        Relationships: []
      }
      extracted_bills: {
        Row: {
          batch_id: string
          bill_data: Json
          created_at: string | null
          file_name: string
          id: string
          user_id: string
        }
        Insert: {
          batch_id: string
          bill_data: Json
          created_at?: string | null
          file_name: string
          id?: string
          user_id: string
        }
        Update: {
          batch_id?: string
          bill_data?: Json
          created_at?: string | null
          file_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          alt_text: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          alt_text: string | null
          category_id: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
        }
        Insert: {
          alt_text?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price: number
        }
        Update: {
          alt_text?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          items: Json
          notes: string | null
          order_source: string | null
          status: string | null
          total_amount: number
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          items: Json
          notes?: string | null
          order_source?: string | null
          status?: string | null
          total_amount: number
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_source?: string | null
          status?: string | null
          total_amount?: number
        }
        Relationships: []
      }
      pos_charging_orders: {
        Row: {
          charging_station_id: string | null
          created_at: string | null
          created_by: string | null
          customer_name: string
          customer_phone: string | null
          driver_id: string | null
          end_time: string | null
          expected_end_time: string | null
          id: string
          order_number: string | null
          payment_method: string | null
          payment_status: string | null
          rate_per_unit: number
          start_time: string | null
          status: string | null
          total_amount: number
          units_consumed: number | null
          vehicle_number: string | null
        }
        Insert: {
          charging_station_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_name: string
          customer_phone?: string | null
          driver_id?: string | null
          end_time?: string | null
          expected_end_time?: string | null
          id?: string
          order_number?: string | null
          payment_method?: string | null
          payment_status?: string | null
          rate_per_unit: number
          start_time?: string | null
          status?: string | null
          total_amount: number
          units_consumed?: number | null
          vehicle_number?: string | null
        }
        Update: {
          charging_station_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_name?: string
          customer_phone?: string | null
          driver_id?: string | null
          end_time?: string | null
          expected_end_time?: string | null
          id?: string
          order_number?: string | null
          payment_method?: string | null
          payment_status?: string | null
          rate_per_unit?: number
          start_time?: string | null
          status?: string | null
          total_amount?: number
          units_consumed?: number | null
          vehicle_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_charging_orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_charging_orders_charging_station_id_fkey"
            columns: ["charging_station_id"]
            isOneToOne: false
            referencedRelation: "charging_stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_charging_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "pos_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_deposits: {
        Row: {
          amount: number
          created_at: string | null
          deposit_date: string
          deposit_method: string | null
          deposited_by: string | null
          description: string | null
          id: string
          reference_number: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          deposit_date: string
          deposit_method?: string | null
          deposited_by?: string | null
          description?: string | null
          id?: string
          reference_number?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          deposit_date?: string
          deposit_method?: string | null
          deposited_by?: string | null
          description?: string | null
          id?: string
          reference_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_deposits_deposited_by_fkey"
            columns: ["deposited_by"]
            isOneToOne: false
            referencedRelation: "pos_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          created_by: string | null
          description: string
          expense_date: string
          expense_type: string | null
          id: string
          payment_method: string | null
          receipt_number: string | null
          vendor_name: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          created_by?: string | null
          description: string
          expense_date: string
          expense_type?: string | null
          id?: string
          payment_method?: string | null
          receipt_number?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          expense_date?: string
          expense_type?: string | null
          id?: string
          payment_method?: string | null
          receipt_number?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "pos_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_menu_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string | null
        }
        Relationships: []
      }
      pos_menu_items: {
        Row: {
          category_id: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          sku: string | null
          stock_quantity: number | null
          track_stock: boolean | null
          vat_inclusive: boolean | null
          vat_rate: number | null
        }
        Insert: {
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price: number
          sku?: string | null
          stock_quantity?: number | null
          track_stock?: boolean | null
          vat_inclusive?: boolean | null
          vat_rate?: number | null
        }
        Update: {
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
          sku?: string | null
          stock_quantity?: number | null
          track_stock?: boolean | null
          vat_inclusive?: boolean | null
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "pos_menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_order_items: {
        Row: {
          created_at: string | null
          id: string
          item_name: string
          menu_item_id: string | null
          notes: string | null
          order_id: string | null
          quantity: number
          total_amount: number
          unit_price: number
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_name: string
          menu_item_id?: string | null
          notes?: string | null
          order_id?: string | null
          quantity?: number
          total_amount: number
          unit_price: number
          vat_amount: number
          vat_rate: number
        }
        Update: {
          created_at?: string | null
          id?: string
          item_name?: string
          menu_item_id?: string | null
          notes?: string | null
          order_id?: string | null
          quantity?: number
          total_amount?: number
          unit_price?: number
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "pos_menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "pos_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_orders: {
        Row: {
          cashier_id: string | null
          completed_at: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_amount: number | null
          driver_id: string | null
          id: string
          notes: string | null
          order_number: string
          order_status: string | null
          order_type: string | null
          payment_method: string | null
          payment_status: string | null
          subtotal: number
          table_number: string | null
          total_amount: number
          vat_amount: number
          waiter_id: string | null
        }
        Insert: {
          cashier_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          driver_id?: string | null
          id?: string
          notes?: string | null
          order_number: string
          order_status?: string | null
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          subtotal?: number
          table_number?: string | null
          total_amount: number
          vat_amount?: number
          waiter_id?: string | null
        }
        Update: {
          cashier_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          driver_id?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          order_status?: string | null
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          subtotal?: number
          table_number?: string | null
          total_amount?: number
          vat_amount?: number
          waiter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_orders_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "pos_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_orders_waiter_id_fkey"
            columns: ["waiter_id"]
            isOneToOne: false
            referencedRelation: "pos_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_savings: {
        Row: {
          amount: number
          created_at: string
          deposited_by: string | null
          id: string
          remarks: string | null
          save_to: string
          saving_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          deposited_by?: string | null
          id?: string
          remarks?: string | null
          save_to: string
          saving_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          deposited_by?: string | null
          id?: string
          remarks?: string | null
          save_to?: string
          saving_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_savings_deposited_by_fkey"
            columns: ["deposited_by"]
            isOneToOne: false
            referencedRelation: "pos_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "pos_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          created_by: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          username: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "pos_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_withdrawals: {
        Row: {
          amount: number
          created_at: string
          id: string
          remarks: string | null
          updated_at: string
          withdraw_from: string
          withdrawal_date: string
          withdrawn_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          remarks?: string | null
          updated_at?: string
          withdraw_from: string
          withdrawal_date?: string
          withdrawn_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          remarks?: string | null
          updated_at?: string
          withdraw_from?: string
          withdrawal_date?: string
          withdrawn_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_withdrawals_withdrawn_by_fkey"
            columns: ["withdrawn_by"]
            isOneToOne: false
            referencedRelation: "pos_users"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          date: string
          guests: number
          id: string
          special_requests: string | null
          status: string | null
          time: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          date: string
          guests: number
          id?: string
          special_requests?: string | null
          status?: string | null
          time: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          date?: string
          guests?: number
          id?: string
          special_requests?: string | null
          status?: string | null
          time?: string
        }
        Relationships: []
      }
      seo_audit_log: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          issue_type: string
          page_path: string
          resolved: boolean | null
          severity: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          issue_type: string
          page_path: string
          resolved?: boolean | null
          severity?: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          issue_type?: string
          page_path?: string
          resolved?: boolean | null
          severity?: string
        }
        Relationships: []
      }
      seo_redirects: {
        Row: {
          created_at: string | null
          from_path: string
          id: string
          is_active: boolean | null
          status_code: number | null
          to_path: string
        }
        Insert: {
          created_at?: string | null
          from_path: string
          id?: string
          is_active?: boolean | null
          status_code?: number | null
          to_path: string
        }
        Update: {
          created_at?: string | null
          from_path?: string
          id?: string
          is_active?: boolean | null
          status_code?: number | null
          to_path?: string
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          auto_generated: boolean | null
          canonical_url: string | null
          content_hash: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_auto_generated_at: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_path: string
          robots_directives: string | null
          schema_markup: Json | null
          twitter_card: string | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string | null
        }
        Insert: {
          auto_generated?: boolean | null
          canonical_url?: string | null
          content_hash?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_auto_generated_at?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path: string
          robots_directives?: string | null
          schema_markup?: Json | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_generated?: boolean | null
          canonical_url?: string | null
          content_hash?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_auto_generated_at?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path?: string
          robots_directives?: string | null
          schema_markup?: Json | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_title: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          rating: number
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_title?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          rating: number
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_title?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          rating?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      charging_order_availability: {
        Row: {
          charging_station_id: string | null
          expected_end_time: string | null
          start_time: string | null
          status: string | null
        }
        Insert: {
          charging_station_id?: string | null
          expected_end_time?: string | null
          start_time?: string | null
          status?: string | null
        }
        Update: {
          charging_station_id?: string | null
          expected_end_time?: string | null
          start_time?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_charging_orders_charging_station_id_fkey"
            columns: ["charging_station_id"]
            isOneToOne: false
            referencedRelation: "charging_stations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_charging_order_number: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
      get_current_user_pos_role: { Args: never; Returns: string }
      get_overall_charger_availability: {
        Args: never
        Returns: {
          available_connectors: number
          is_any_available: boolean
          total_connectors: number
        }[]
      }
      is_pos_staff: { Args: never; Returns: boolean }
      slugify: { Args: { input: string }; Returns: string }
      update_charger_status_from_ocpp: {
        Args: {
          p_charger_id: string
          p_connector_id: number
          p_error_code?: string
          p_status: string
        }
        Returns: {
          charger_id: string
          connector_id: number
          id: number
          is_available: boolean
          updated_at: string
        }[]
      }
    }
    Enums: {
      driver_loyalty_tier: "none" | "silver" | "gold" | "platinum"
      user_role: "admin" | "cashier" | "waiter" | "charging_staff" | "manager"
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
      driver_loyalty_tier: ["none", "silver", "gold", "platinum"],
      user_role: ["admin", "cashier", "waiter", "charging_staff", "manager"],
    },
  },
} as const
