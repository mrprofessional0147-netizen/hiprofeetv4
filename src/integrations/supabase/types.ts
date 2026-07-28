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
      app_config: {
        Row: {
          id: string
          require_email_verification: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          require_email_verification?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          require_email_verification?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      assessment_uploads: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          kind: string
          label: string | null
          session_id: string | null
          user_id: string | null
          value: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          kind: string
          label?: string | null
          session_id?: string | null
          user_id?: string | null
          value: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          label?: string | null
          session_id?: string | null
          user_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_uploads_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          diagnosis_id: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          diagnosis_id: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          diagnosis_id?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_requests_diagnosis_id_fkey"
            columns: ["diagnosis_id"]
            isOneToOne: false
            referencedRelation: "diagnoses"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          business_name: string | null
          created_at: string
          id: string
          industry: string | null
          last_message_at: string
          route: string | null
          session_id: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          last_message_at?: string
          route?: string | null
          session_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_name?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          last_message_at?: string
          route?: string | null
          session_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string
          id: string
          order_id: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          id?: string
          order_id?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          id?: string
          order_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          id: string
          max_uses: number
          percent_off: number
          platform: string | null
          service_id: string | null
          used_count: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          id?: string
          max_uses: number
          percent_off: number
          platform?: string | null
          service_id?: string | null
          used_count?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          id?: string
          max_uses?: number
          percent_off?: number
          platform?: string | null
          service_id?: string | null
          used_count?: number
        }
        Relationships: []
      }
      diagnoses: {
        Row: {
          answers: Json
          business_name: string | null
          created_at: string
          delivered_at: string | null
          email: string | null
          id: string
          industry: string | null
          ip: string | null
          name: string | null
          pillar_scores: Json | null
          report: Json | null
          report_token: string | null
          revenue_band: string | null
          score: number | null
          session_token: string
          source: string | null
          status: string
          updated_at: string
          user_agent: string | null
          verified_at: string | null
        }
        Insert: {
          answers?: Json
          business_name?: string | null
          created_at?: string
          delivered_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          ip?: string | null
          name?: string | null
          pillar_scores?: Json | null
          report?: Json | null
          report_token?: string | null
          revenue_band?: string | null
          score?: number | null
          session_token: string
          source?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          verified_at?: string | null
        }
        Update: {
          answers?: Json
          business_name?: string | null
          created_at?: string
          delivered_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          ip?: string | null
          name?: string | null
          pillar_scores?: Json | null
          report?: Json | null
          report_token?: string | null
          revenue_band?: string | null
          score?: number | null
          session_token?: string
          source?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      email_verifications: {
        Row: {
          attempts: number
          code_hash: string
          created_at: string
          diagnosis_id: string
          email: string
          expires_at: string
          id: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number
          code_hash: string
          created_at?: string
          diagnosis_id: string
          email: string
          expires_at: string
          id?: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number
          code_hash?: string
          created_at?: string
          diagnosis_id?: string
          email?: string
          expires_at?: string
          id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_verifications_diagnosis_id_fkey"
            columns: ["diagnosis_id"]
            isOneToOne: false
            referencedRelation: "diagnoses"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_reviews: {
        Row: {
          business_name: string | null
          conversation_id: string | null
          created_at: string
          email: string
          id: string
          industry: string | null
          review_json: Json
          sent_at: string | null
          user_id: string | null
        }
        Insert: {
          business_name?: string | null
          conversation_id?: string | null
          created_at?: string
          email: string
          id?: string
          industry?: string | null
          review_json: Json
          sent_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_name?: string | null
          conversation_id?: string | null
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          review_json?: Json
          sent_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "growth_reviews_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          amount: number
          business_name: string | null
          coupon_code: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          discount_amount: number
          id: string
          platform: string | null
          quantity: number | null
          receipt_url: string | null
          service_id: string
          service_name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          business_name?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          discount_amount?: number
          id?: string
          platform?: string | null
          quantity?: number | null
          receipt_url?: string | null
          service_id: string
          service_name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          business_name?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          discount_amount?: number
          id?: string
          platform?: string | null
          quantity?: number | null
          receipt_url?: string | null
          service_id?: string
          service_name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_name: string | null
          business_stage: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          business_name?: string | null
          business_stage?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          business_name?: string | null
          business_stage?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
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
      redeem_coupon: {
        Args: { _code: string; _platform: string; _service_id: string }
        Returns: {
          coupon_id: string
          coupon_percent_off: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
