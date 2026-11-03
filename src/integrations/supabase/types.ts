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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      savings_initiatives: {
        Row: {
          actual_savings_ytd: number | null
          annual_productivity: number | null
          annual_productivity_in_ve: number | null
          aop27_final_price: number | null
          aop27_mkt_px_change_increase_decrease: number | null
          aop27_productivity_savings_kg_decrease: number | null
          aop27_spends: number | null
          aop27_volume_vol_can_be_changed: number | null
          apr_27_actuals: number | null
          apr_27_saving: number | null
          apr_27_vol: number | null
          aug_27_actuals: number | null
          aug_27_saving: number | null
          aug_27_vol: number | null
          baseline_po_price_for_fy27_savings: number | null
          carry_over_or_new: string | null
          catergory_manager: string | null
          check: number | null
          created_at: string
          dec_26_actuals: number | null
          dec_26_saving: number | null
          dec_26_vol: number | null
          dyes_chem: string | null
          explain_exceptions: string | null
          feb_27_actuals: number | null
          feb_27_saving: number | null
          feb_27_vol: number | null
          fy26_annualised_spends_adjusted_price: number | null
          fy26_annualised_vol: number | null
          id: string
          initiative_type: string | null
          jan_27_actuals: number | null
          jan_27_saving: number | null
          jan_27_vol: number | null
          jul_27_actuals: number | null
          jul_27_saving: number | null
          jul_27_vol: number | null
          july_sep26_q4_q4_26_avg_unit_px: number | null
          july_sep26_q4_q4_26_po_qty: number | null
          july_sep26_q4_q4_26_po_spend: number | null
          jun_27_actuals: number | null
          jun_27_saving: number | null
          jun_27_vol: number | null
          mar_27_actuals: number | null
          mar_27_saving: number | null
          mar_27_vol: number | null
          market_effect: number | null
          mat_plant: string | null
          material: number | null
          material_classification: string | null
          material_name: string | null
          may_27_actuals: number | null
          may_27_saving: number | null
          may_27_vol: number | null
          no_blank: string | null
          nov_26_actuals: number | null
          nov_26_saving: number | null
          nov_26_vol: number | null
          oct_26_actuals: number | null
          oct_26_saving: number | null
          oct_26_vol: number | null
          plant: string | null
          plant_region: string | null
          probability_of_success: number | null
          project_name_supplier: string | null
          savings_start_month: string | null
          sep_27_actuals: number | null
          sep_27_saving: number | null
          sep_27_vol: number | null
          silicones: string | null
          spends_delta_fav_unfav: number | null
          stage_gate: string | null
          sub_category: string | null
          volume_impact: number | null
          ytd_sep26_12mths_po_qty_kgs: number | null
          ytd_sep26_12mths_po_spends_usd: number | null
          ytd_sep26_avg_unit_px: number | null
        }
        Insert: {
          actual_savings_ytd?: number | null
          annual_productivity?: number | null
          annual_productivity_in_ve?: number | null
          aop27_final_price?: number | null
          aop27_mkt_px_change_increase_decrease?: number | null
          aop27_productivity_savings_kg_decrease?: number | null
          aop27_spends?: number | null
          aop27_volume_vol_can_be_changed?: number | null
          apr_27_actuals?: number | null
          apr_27_saving?: number | null
          apr_27_vol?: number | null
          aug_27_actuals?: number | null
          aug_27_saving?: number | null
          aug_27_vol?: number | null
          baseline_po_price_for_fy27_savings?: number | null
          carry_over_or_new?: string | null
          catergory_manager?: string | null
          check?: number | null
          created_at?: string
          dec_26_actuals?: number | null
          dec_26_saving?: number | null
          dec_26_vol?: number | null
          dyes_chem?: string | null
          explain_exceptions?: string | null
          feb_27_actuals?: number | null
          feb_27_saving?: number | null
          feb_27_vol?: number | null
          fy26_annualised_spends_adjusted_price?: number | null
          fy26_annualised_vol?: number | null
          id?: string
          initiative_type?: string | null
          jan_27_actuals?: number | null
          jan_27_saving?: number | null
          jan_27_vol?: number | null
          jul_27_actuals?: number | null
          jul_27_saving?: number | null
          jul_27_vol?: number | null
          july_sep26_q4_q4_26_avg_unit_px?: number | null
          july_sep26_q4_q4_26_po_qty?: number | null
          july_sep26_q4_q4_26_po_spend?: number | null
          jun_27_actuals?: number | null
          jun_27_saving?: number | null
          jun_27_vol?: number | null
          mar_27_actuals?: number | null
          mar_27_saving?: number | null
          mar_27_vol?: number | null
          market_effect?: number | null
          mat_plant?: string | null
          material?: number | null
          material_classification?: string | null
          material_name?: string | null
          may_27_actuals?: number | null
          may_27_saving?: number | null
          may_27_vol?: number | null
          no_blank?: string | null
          nov_26_actuals?: number | null
          nov_26_saving?: number | null
          nov_26_vol?: number | null
          oct_26_actuals?: number | null
          oct_26_saving?: number | null
          oct_26_vol?: number | null
          plant?: string | null
          plant_region?: string | null
          probability_of_success?: number | null
          project_name_supplier?: string | null
          savings_start_month?: string | null
          sep_27_actuals?: number | null
          sep_27_saving?: number | null
          sep_27_vol?: number | null
          silicones?: string | null
          spends_delta_fav_unfav?: number | null
          stage_gate?: string | null
          sub_category?: string | null
          volume_impact?: number | null
          ytd_sep26_12mths_po_qty_kgs?: number | null
          ytd_sep26_12mths_po_spends_usd?: number | null
          ytd_sep26_avg_unit_px?: number | null
        }
        Update: {
          actual_savings_ytd?: number | null
          annual_productivity?: number | null
          annual_productivity_in_ve?: number | null
          aop27_final_price?: number | null
          aop27_mkt_px_change_increase_decrease?: number | null
          aop27_productivity_savings_kg_decrease?: number | null
          aop27_spends?: number | null
          aop27_volume_vol_can_be_changed?: number | null
          apr_27_actuals?: number | null
          apr_27_saving?: number | null
          apr_27_vol?: number | null
          aug_27_actuals?: number | null
          aug_27_saving?: number | null
          aug_27_vol?: number | null
          baseline_po_price_for_fy27_savings?: number | null
          carry_over_or_new?: string | null
          catergory_manager?: string | null
          check?: number | null
          created_at?: string
          dec_26_actuals?: number | null
          dec_26_saving?: number | null
          dec_26_vol?: number | null
          dyes_chem?: string | null
          explain_exceptions?: string | null
          feb_27_actuals?: number | null
          feb_27_saving?: number | null
          feb_27_vol?: number | null
          fy26_annualised_spends_adjusted_price?: number | null
          fy26_annualised_vol?: number | null
          id?: string
          initiative_type?: string | null
          jan_27_actuals?: number | null
          jan_27_saving?: number | null
          jan_27_vol?: number | null
          jul_27_actuals?: number | null
          jul_27_saving?: number | null
          jul_27_vol?: number | null
          july_sep26_q4_q4_26_avg_unit_px?: number | null
          july_sep26_q4_q4_26_po_qty?: number | null
          july_sep26_q4_q4_26_po_spend?: number | null
          jun_27_actuals?: number | null
          jun_27_saving?: number | null
          jun_27_vol?: number | null
          mar_27_actuals?: number | null
          mar_27_saving?: number | null
          mar_27_vol?: number | null
          market_effect?: number | null
          mat_plant?: string | null
          material?: number | null
          material_classification?: string | null
          material_name?: string | null
          may_27_actuals?: number | null
          may_27_saving?: number | null
          may_27_vol?: number | null
          no_blank?: string | null
          nov_26_actuals?: number | null
          nov_26_saving?: number | null
          nov_26_vol?: number | null
          oct_26_actuals?: number | null
          oct_26_saving?: number | null
          oct_26_vol?: number | null
          plant?: string | null
          plant_region?: string | null
          probability_of_success?: number | null
          project_name_supplier?: string | null
          savings_start_month?: string | null
          sep_27_actuals?: number | null
          sep_27_saving?: number | null
          sep_27_vol?: number | null
          silicones?: string | null
          spends_delta_fav_unfav?: number | null
          stage_gate?: string | null
          sub_category?: string | null
          volume_impact?: number | null
          ytd_sep26_12mths_po_qty_kgs?: number | null
          ytd_sep26_12mths_po_spends_usd?: number | null
          ytd_sep26_avg_unit_px?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
    }
    Enums: {
      app_role: "admin" | "viewer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "viewer"],
    },
  },
} as const
