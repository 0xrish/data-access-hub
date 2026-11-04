// Column registry for the savings initiatives dataset (generated from the
// uploaded workbook headers). Ordered with key business fields first.
export type ColumnType = "text" | "number" | "date";

export interface ColumnDef {
  column: string;
  label: string;
  type: ColumnType;
}

export const DATA_COLUMNS: ColumnDef[] = [
  { column: "material_name", label: "Material Name", type: "text" },
  { column: "material", label: "Material", type: "number" },
  { column: "plant", label: "Plant", type: "text" },
  { column: "plant_region", label: "Plant Region", type: "text" },
  { column: "sub_category", label: "Sub Category", type: "text" },
  { column: "catergory_manager", label: "Category Manager", type: "text" },
  { column: "dyes_chem", label: "Dyes/Chem", type: "text" },
  { column: "stage_gate", label: "Stage Gate", type: "text" },
  { column: "initiative_type", label: "Initiative Type", type: "text" },
  { column: "project_name_supplier", label: "Project Name/Supplier", type: "text" },
  { column: "ytd_sep26_12mths_po_qty_kgs", label: "YTD Sep26 12mths PO Qty (Kgs)", type: "number" },
  {
    column: "ytd_sep26_12mths_po_spends_usd",
    label: "YTD Sep26 12mths PO Spends (USD)",
    type: "number",
  },
  { column: "ytd_sep26_avg_unit_px", label: "YTD Sep26 Avg Unit Px", type: "number" },
  { column: "aop27_final_price", label: "AOP27 Final Price", type: "number" },
  { column: "aop27_spends", label: "AOP27 Spends", type: "number" },
  { column: "annual_productivity", label: "Annual Productivity", type: "number" },
  { column: "actual_savings_ytd", label: "Actual Savings (YTD)", type: "number" },
  { column: "savings_start_month", label: "Savings Start Month", type: "date" },
  { column: "carry_over_or_new", label: "Carry Over or New", type: "text" },
  { column: "annual_productivity_in_ve", label: "Annual Productivity (+ve)", type: "number" },
  {
    column: "aop27_mkt_px_change_increase_decrease",
    label: "AOP27 Mkt Px Change $ - increase / (decrease)",
    type: "number",
  },
  {
    column: "aop27_productivity_savings_kg_decrease",
    label: "AOP27 Productivity Savings $/kg - (decrease)",
    type: "number",
  },
  {
    column: "aop27_volume_vol_can_be_changed",
    label: "AOP27 Volume (Vol can be changed)",
    type: "number",
  },
  { column: "apr_27_actuals", label: "Apr 27 (Actuals)", type: "number" },
  { column: "apr_27_saving", label: "Apr 27 (Saving)", type: "number" },
  { column: "apr_27_vol", label: "Apr 27 (Vol)", type: "number" },
  { column: "aug_27_actuals", label: "Aug 27 (Actuals)", type: "number" },
  { column: "aug_27_saving", label: "Aug 27 (Saving)", type: "number" },
  { column: "aug_27_vol", label: "Aug 27 (Vol)", type: "number" },
  {
    column: "baseline_po_price_for_fy27_savings",
    label: "Baseline PO Price for FY27 Savings",
    type: "number",
  },
  { column: "check", label: "Check", type: "number" },
  { column: "dec_26_actuals", label: "Dec 26 (Actuals)", type: "number" },
  { column: "dec_26_saving", label: "Dec 26 (Saving)", type: "number" },
  { column: "dec_26_vol", label: "Dec 26 (Vol)", type: "number" },
  { column: "explain_exceptions", label: "Explain Exceptions", type: "text" },
  { column: "feb_27_actuals", label: "Feb 27 (Actuals)", type: "number" },
  { column: "feb_27_saving", label: "Feb 27 (Saving)", type: "number" },
  { column: "feb_27_vol", label: "Feb 27 (Vol)", type: "number" },
  {
    column: "fy26_annualised_spends_adjusted_price",
    label: "FY26 Annualised Spends (Adjusted Price)",
    type: "number",
  },
  { column: "fy26_annualised_vol", label: "FY26 Annualised Vol", type: "number" },
  { column: "jan_27_actuals", label: "Jan 27 (Actuals)", type: "number" },
  { column: "jan_27_saving", label: "Jan 27 (Saving)", type: "number" },
  { column: "jan_27_vol", label: "Jan 27 (Vol)", type: "number" },
  { column: "jul_27_actuals", label: "Jul 27 (Actuals)", type: "number" },
  { column: "jul_27_saving", label: "Jul 27 (Saving)", type: "number" },
  { column: "jul_27_vol", label: "Jul 27 (Vol)", type: "number" },
  {
    column: "july_sep26_q4_q4_26_avg_unit_px",
    label: "July-Sep26 Q4 (Q4 26 Avg Unit Px)",
    type: "number",
  },
  { column: "july_sep26_q4_q4_26_po_qty", label: "July-Sep26 Q4 (Q4 26 PO Qty)", type: "number" },
  {
    column: "july_sep26_q4_q4_26_po_spend",
    label: "July-Sep26 Q4 (Q4 26 PO Spend)",
    type: "number",
  },
  { column: "jun_27_actuals", label: "Jun 27 (Actuals)", type: "number" },
  { column: "jun_27_saving", label: "Jun 27 (Saving)", type: "number" },
  { column: "jun_27_vol", label: "Jun 27 (Vol)", type: "number" },
  { column: "mar_27_actuals", label: "Mar 27 (Actuals)", type: "number" },
  { column: "mar_27_saving", label: "Mar 27 (Saving)", type: "number" },
  { column: "mar_27_vol", label: "Mar 27 (Vol)", type: "number" },
  { column: "market_effect", label: "Market Effect", type: "number" },
  { column: "mat_plant", label: "Mat+Plant", type: "text" },
  { column: "material_classification", label: "Material Classification", type: "text" },
  { column: "may_27_actuals", label: "May 27 (Actuals)", type: "number" },
  { column: "may_27_saving", label: "May 27 (Saving)", type: "number" },
  { column: "may_27_vol", label: "May 27 (Vol)", type: "number" },
  { column: "no_blank", label: "Blank Flag", type: "text" },
  { column: "nov_26_actuals", label: "Nov 26 (Actuals)", type: "number" },
  { column: "nov_26_saving", label: "Nov 26 (Saving)", type: "number" },
  { column: "nov_26_vol", label: "Nov 26 (Vol)", type: "number" },
  { column: "oct_26_actuals", label: "Oct 26 (Actuals)", type: "number" },
  { column: "oct_26_saving", label: "Oct 26 (Saving)", type: "number" },
  { column: "oct_26_vol", label: "Oct 26 (Vol)", type: "number" },
  { column: "probability_of_success", label: "Probability of Success", type: "number" },
  { column: "sep_27_actuals", label: "Sep 27 (Actuals)", type: "number" },
  { column: "sep_27_saving", label: "Sep 27 (Saving)", type: "number" },
  { column: "sep_27_vol", label: "Sep 27 (Vol)", type: "number" },
  { column: "silicones", label: "Silicones", type: "text" },
  { column: "spends_delta_fav_unfav", label: "Spends Delta (Fav) / Unfav", type: "number" },
  { column: "volume_impact", label: "Volume Impact", type: "number" },
];

export const COLUMN_MAP = new Map(DATA_COLUMNS.map((c) => [c.column, c]));

const KEY_COLUMNS = [
  "mat_plant",
  "material_name",
  "material",
  "plant",
  "plant_region",
  "sub_category",
  "dyes_chem",
  "catergory_manager",
  "stage_gate",
  "initiative_type",
  "project_name_supplier",
  "savings_start_month",
  "carry_over_or_new",
  "ytd_sep26_12mths_po_qty_kgs",
  "ytd_sep26_12mths_po_spends_usd",
  "ytd_sep26_avg_unit_px",
  "aop27_final_price",
  "aop27_spends",
  "annual_productivity",
  "actual_savings_ytd",
];

export const DEFAULT_VISIBLE_COLUMNS = KEY_COLUMNS.filter((c) => COLUMN_MAP.has(c));

// Filter dimensions: [db column, display label]
export const FILTER_FIELDS: { column: string; label: string }[] = [
  { column: "dyes_chem", label: "Dyes / Chemical" },
  { column: "plant_region", label: "Plant Region" },
  { column: "initiative_type", label: "Initiative Type" },
  { column: "sub_category", label: "Sub Category" },
  { column: "catergory_manager", label: "Category Manager" },
  { column: "plant", label: "Plant" },
  { column: "material_name", label: "Material Name" },
  { column: "material", label: "Material Code" },
];

export const MONTHS = [
  { vol: "oct_26_vol", saving: "oct_26_saving", actuals: "oct_26_actuals", label: "Oct 26" },
  { vol: "nov_26_vol", saving: "nov_26_saving", actuals: "nov_26_actuals", label: "Nov 26" },
  { vol: "dec_26_vol", saving: "dec_26_saving", actuals: "dec_26_actuals", label: "Dec 26" },
  { vol: "jan_27_vol", saving: "jan_27_saving", actuals: "jan_27_actuals", label: "Jan 27" },
  { vol: "feb_27_vol", saving: "feb_27_saving", actuals: "feb_27_actuals", label: "Feb 27" },
  { vol: "mar_27_vol", saving: "mar_27_saving", actuals: "mar_27_actuals", label: "Mar 27" },
  { vol: "apr_27_vol", saving: "apr_27_saving", actuals: "apr_27_actuals", label: "Apr 27" },
  { vol: "may_27_vol", saving: "may_27_saving", actuals: "may_27_actuals", label: "May 27" },
  { vol: "jun_27_vol", saving: "jun_27_saving", actuals: "jun_27_actuals", label: "Jun 27" },
  { vol: "jul_27_vol", saving: "jul_27_saving", actuals: "jul_27_actuals", label: "Jul 27" },
  { vol: "aug_27_vol", saving: "aug_27_saving", actuals: "aug_27_actuals", label: "Aug 27" },
  { vol: "sep_27_vol", saving: "sep_27_saving", actuals: "sep_27_actuals", label: "Sep 27" },
];
