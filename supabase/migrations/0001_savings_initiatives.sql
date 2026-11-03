-- Savings initiatives registry, seeded from the uploaded workbook
create table public.savings_initiatives (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  "mat_plant" text,
  "material" numeric,
  "material_name" text,
  "plant" text,
  "plant_region" text,
  "sub_category" text,
  "silicones" text,
  "catergory_manager" text,
  "dyes_chem" text,
  "material_classification" text,
  "ytd_sep26_12mths_po_qty_kgs" numeric,
  "ytd_sep26_12mths_po_spends_usd" numeric,
  "ytd_sep26_avg_unit_px" numeric,
  "stage_gate" text,
  "probability_of_success" numeric,
  "july_sep26_q4_q4_26_po_qty" numeric,
  "july_sep26_q4_q4_26_po_spend" numeric,
  "july_sep26_q4_q4_26_avg_unit_px" numeric,
  "baseline_po_price_for_fy27_savings" numeric,
  "explain_exceptions" text,
  "fy26_annualised_vol" numeric,
  "fy26_annualised_spends_adjusted_price" numeric,
  "savings_start_month" date,
  "carry_over_or_new" text,
  "initiative_type" text,
  "project_name_supplier" text,
  "no_blank" text,
  "aop27_mkt_px_change_increase_decrease" numeric,
  "aop27_productivity_savings_kg_decrease" numeric,
  "aop27_final_price" numeric,
  "aop27_volume_vol_can_be_changed" numeric,
  "aop27_spends" numeric,
  "spends_delta_fav_unfav" numeric,
  "volume_impact" numeric,
  "market_effect" numeric,
  "annual_productivity" numeric,
  "annual_productivity_in_ve" numeric,
  "check" numeric,
  "oct_26_vol" numeric,
  "nov_26_vol" numeric,
  "dec_26_vol" numeric,
  "jan_27_vol" numeric,
  "feb_27_vol" numeric,
  "mar_27_vol" numeric,
  "apr_27_vol" numeric,
  "may_27_vol" numeric,
  "jun_27_vol" numeric,
  "jul_27_vol" numeric,
  "aug_27_vol" numeric,
  "sep_27_vol" numeric,
  "oct_26_saving" numeric,
  "nov_26_saving" numeric,
  "dec_26_saving" numeric,
  "jan_27_saving" numeric,
  "feb_27_saving" numeric,
  "mar_27_saving" numeric,
  "apr_27_saving" numeric,
  "may_27_saving" numeric,
  "jun_27_saving" numeric,
  "jul_27_saving" numeric,
  "aug_27_saving" numeric,
  "sep_27_saving" numeric,
  "oct_26_actuals" numeric,
  "nov_26_actuals" numeric,
  "dec_26_actuals" numeric,
  "jan_27_actuals" numeric,
  "feb_27_actuals" numeric,
  "mar_27_actuals" numeric,
  "apr_27_actuals" numeric,
  "may_27_actuals" numeric,
  "jun_27_actuals" numeric,
  "jul_27_actuals" numeric,
  "aug_27_actuals" numeric,
  "sep_27_actuals" numeric,
  "actual_savings_ytd" numeric
);

grant select on public.savings_initiatives to authenticated;
grant all on public.savings_initiatives to service_role;

alter table public.savings_initiatives enable row level security;

create policy "Signed-in users can read initiatives"
  on public.savings_initiatives for select
  to authenticated
  using (true);

insert into public.savings_initiatives ("mat_plant", "material", "material_name", "plant", "plant_region", "sub_category", "silicones", "catergory_manager", "dyes_chem", "material_classification", "ytd_sep26_12mths_po_qty_kgs", "ytd_sep26_12mths_po_spends_usd", "ytd_sep26_avg_unit_px", "stage_gate", "probability_of_success", "july_sep26_q4_q4_26_po_qty", "july_sep26_q4_q4_26_po_spend", "july_sep26_q4_q4_26_avg_unit_px", "baseline_po_price_for_fy27_savings", "explain_exceptions", "fy26_annualised_vol", "fy26_annualised_spends_adjusted_price", "savings_start_month", "carry_over_or_new", "initiative_type", "project_name_supplier", "no_blank", "aop27_mkt_px_change_increase_decrease", "aop27_productivity_savings_kg_decrease", "aop27_final_price", "aop27_volume_vol_can_be_changed", "aop27_spends", "spends_delta_fav_unfav", "volume_impact", "market_effect", "annual_productivity", "annual_productivity_in_ve", "check", "oct_26_vol", "nov_26_vol", "dec_26_vol", "jan_27_vol", "feb_27_vol", "mar_27_vol", "apr_27_vol", "may_27_vol", "jun_27_vol", "jul_27_vol", "aug_27_vol", "sep_27_vol", "oct_26_saving", "nov_26_saving", "dec_26_saving", "jan_27_saving", "feb_27_saving", "mar_27_saving", "apr_27_saving", "may_27_saving", "jun_27_saving", "jul_27_saving", "aug_27_saving", "sep_27_saving", "oct_26_actuals", "nov_26_actuals", "dec_26_actuals", "jan_27_actuals", "feb_27_actuals", "mar_27_actuals", "apr_27_actuals", "may_27_actuals", "jun_27_actuals", "jul_27_actuals", "aug_27_actuals", "sep_27_actuals", "actual_savings_ytd")
values
  ('286009308125811', 28600930812.0, 'Ultraphor PWC R pdr                 0020', '5811', 'North America', 'Process & OBA Chemicals', 'Process & OBA', 'Ben Mo', 'Chemicals', 'Non_Index', 460000.0, 8199069.0, 17.82406304347826, '4-Go Live', 1.0, 80000.0, 1449063.0, 18.1132875, 18.1132875, NULL, 460000.0, 8332112.249999999, '2027-01-01', 'New', 'New/alternative source/vendor', 'Hongda', 'NO', NULL, -3.0, 15.113287499999998, 460000.0, 6952112.249999999, -1380000.0, 0.0, 0.0, -1380000.0, 1.38, 0.0, 38333.333333333336, 38333.333333333336, 38333.333333333336, 38333.333333333336, 38333.333333333336, 38333.333333333336, 38333.333333333336, 38333.333333333336, 38333.333333333336, 38333.333333333336, 38333.333333333336, 38333.333333333336, 0.0, 0.0, 0.0, 115000.0, 115000.0, 115000.0, 115000.0, 115000.0, 115000.0, 115000.0, 115000.0, 115000.0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('2417472104', 241747.0, 'Perfluorhexylethylmethacrylat', '2104', 'EMEA', 'Fluoro Chemicals', 'Flouro Chem', 'Charles Allotey', 'Chemicals', 'Non_Index', 203600.0, 9425250.0, 46.29297642436149, '4-Go Live', 1.0, 82000.0, 3765713.0, 45.92332926829268, 45.92332926829268, NULL, 203600.0, 9349989.839024391, '2026-04-01', 'Carry over', 'Respecification', 'Zhongfu - new manuf. partner; ARC supplying key feedstock Iodine', 'NO', NULL, -2.98, 42.943329268292686, 203600.0, 8743261.839024391, -606728.0, 0.0, 0.0, -606728.0, 0.606728, 0.0, 16966.666666666668, 16966.666666666668, 16966.666666666668, 16966.666666666668, 16966.666666666668, 16966.666666666668, 16966.666666666668, 16966.666666666668, 16966.666666666668, 16966.666666666668, 16966.666666666668, 16966.666666666668, 50560.666666666664, 50560.666666666664, 50560.666666666664, 50560.666666666664, 50560.666666666664, 50560.666666666664, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('2897975504', 289797.0, 'FORMAZANE BLUE F-R MOIST PURCHASED', '5504', 'South East Asia', 'Reactive Dyes & Intermediates', 'Reactive Dyes', 'Bhavesh Thakkar', 'Dyes', 'Non_Index', 1161557.0, 7550181.0, 6.50005208526142, '4-Go Live', 1.0, 254268.0, 1814778.0, 7.137264618434093, 7.137264618434093, NULL, 1161557.0, 8290339.67839445, '2026-10-01', 'New', 'Bulk Buying', 'Ambica', 'NO', 0.5, -0.4, 7.237264618434093, 1161557.0, 8406495.37839445, 116155.69999999925, 0.0, 580778.5, -464622.80000000005, 0.46462280000000006, -6.984919309616089e-10, 96796.41666666667, 96796.41666666667, 96796.41666666667, 96796.41666666667, 96796.41666666667, 96796.41666666667, 96796.41666666667, 96796.41666666667, 96796.41666666667, 96796.41666666667, 96796.41666666667, 96796.41666666667, 38718.56666666667, 38718.56666666667, 38718.56666666667, 38718.56666666667, 38718.56666666667, 38718.56666666667, 38718.56666666667, 38718.56666666667, 38718.56666666667, 38718.56666666667, 38718.56666666667, 38718.56666666667, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('2896124006', 289612.0, '1-BR-4-CYCLOHEXYLAMINO-AQ CRUDE DRY', '4006', 'North America', 'WPP Dyes, Pigments & Intermediates', 'WPP Dyes', 'Charuwan Maidee', 'Dyes', 'Non_Index', 22403.0, 916215.0, 40.89697808329242, '2-Development', 0.5, 8334.0, 418223.0, 50.18274538036957, 50.18274538036957, NULL, 22403.0, 1124244.0447564195, '2027-02-01', 'New', 'New/alternative source/vendor', 'Anhui royal', 'NO', NULL, -15.0, 35.18274538036957, 22403.0, 788199.0447564194, -336045.0000000001, 0.0, 0.0, -336045.0, 0.336045, 0.0, 1866.9166666666667, 1866.9166666666667, 1866.9166666666667, 1866.9166666666667, 1866.9166666666667, 1866.9166666666667, 1866.9166666666667, 1866.9166666666667, 1866.9166666666667, 1866.9166666666667, 1866.9166666666667, 1866.9166666666667, 0.0, 0.0, 0.0, 0.0, 28003.75, 28003.75, 28003.75, 28003.75, 28003.75, 28003.75, 28003.75, 28003.75, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('2947683201', 294768.0, 'Lemonite 0124 ACP', '3201', 'South East Asia', 'Process & OBA Chemicals', 'Process & OBA', 'Ben Mo', 'Chemicals', 'Non_Index', 109000.0, 2088212.0, 19.157908256880734, '3-Testing', 0.75, 0.0, 0.0, 0.0, 0.0, NULL, 109000.0, 0.0, '2026-10-01', 'New', 'New/alternative source/vendor', 'Hongda', 'NO', NULL, -3.0, -3.0, 109000.0, -327000.0, -327000.0, 0.0, 0.0, -327000.0, 0.327, 0.0, 9083.333333333334, 9083.333333333334, 9083.333333333334, 9083.333333333334, 9083.333333333334, 9083.333333333334, 9083.333333333334, 9083.333333333334, 9083.333333333334, 9083.333333333334, 9083.333333333334, 9083.333333333334, 27250.0, 27250.0, 27250.0, 27250.0, 27250.0, 27250.0, 27250.0, 27250.0, 27250.0, 27250.0, 27250.0, 27250.0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('288420307813003', 28842030781.0, 'ZELAN R3                         0108.96', '3003', 'North Asia', 'Fluoro Chemicals', 'Flouro Chem', 'Charles Allotey', 'Chemicals', 'Non_Index', 548505.0, 6294607.0, 11.475933674260034, '4-Go Live', 1.0, 76926.0, 891676.0, 11.591347528793905, 11.591347528793905, NULL, 548505.0, 6357912.076281101, '2026-09-01', 'Carry over', 'Renegotiation', 'NICCA (before Chemours) for china', 'NO', 1.2, -0.3, 12.491347528793904, 548505.0, 6851566.5762811005, 493654.49999999907, 0.0, 658206.0, -164551.5, 0.1645515, -9.313225746154785e-10, 45708.75, 45708.75, 45708.75, 45708.75, 45708.75, 45708.75, 45708.75, 45708.75, 45708.75, 45708.75, 45708.75, 45708.75, 13712.625, 13712.625, 13712.625, 13712.625, 13712.625, 13712.625, 13712.625, 13712.625, 13712.625, 13712.625, 13712.625, 0.0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('2904814006', 290481.0, 'METHANOL', '4006', 'North America', 'Base Chemicals', 'Base Chemicals', 'Thais Prado', 'Chemicals', 'Index', 2466788.0, 1344807.0, 0.545165210792334, '4-Go Live', 1.0, 448996.0, 314008.0, 0.6993558962663364, 0.6993558962663364, 'Price increase in June and supply issues', 2466788.0, 1725162.7326390436, '2026-09-01', 'Carry over', 'Market Indexing', 'Supply agreement - Bulk', 'NO', 0.05, -0.1, 0.6493558962663365, 2466788.0, 1601823.3326390437, -123339.3999999999, 0.0, 123339.40000000001, -246678.80000000002, 0.2466788, 0.0, 205565.66666666666, 205565.66666666666, 205565.66666666666, 205565.66666666666, 205565.66666666666, 205565.66666666666, 205565.66666666666, 205565.66666666666, 205565.66666666666, 205565.66666666666, 205565.66666666666, 205565.66666666666, 20556.56666666667, 20556.56666666667, 20556.56666666667, 20556.56666666667, 20556.56666666667, 20556.56666666667, 20556.56666666667, 20556.56666666667, 20556.56666666667, 20556.56666666667, 20556.56666666667, 0.0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('2910223520', 291022.0, 'REACTIVE RED 239 HC', '3520', 'South Asia', 'Reactive Dyes & Intermediates', 'Reactive Dyes', 'Bhavesh Thakkar', 'Dyes', 'Non_Index', 834500.0, 2903570.0, 3.4794128220491314, '4-Go Live', 1.0, 270000.0, 1175309.0, 4.352996296296296, 4.352996296296296, NULL, 834500.0, 3632575.4092592592, '2026-10-01', 'New', 'Bulk Buying', 'EBONY- Stratergic Partnership', 'NO', NULL, -0.3, 4.052996296296296, 834500.0, 3382225.4092592592, -250350.0, 0.0, 0.0, -250350.0, 0.25035, 0.0, 69541.66666666667, 69541.66666666667, 69541.66666666667, 69541.66666666667, 69541.66666666667, 69541.66666666667, 69541.66666666667, 69541.66666666667, 69541.66666666667, 69541.66666666667, 69541.66666666667, 69541.66666666667, 20862.5, 20862.5, 20862.5, 20862.5, 20862.5, 20862.5, 20862.5, 20862.5, 20862.5, 20862.5, 20862.5, 20862.5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('23666010620CNAA', 23666010620.0, 'Genapol PH 70                       0200', 'CNAA', 'North Asia', 'EO /PO derivatives & Fatty Acids', 'EO/PO ', 'Flofill Liu', 'Chemicals', 'Non_Index', 97850.0, 532346.0, 5.440429228410833, '3-Testing', 0.75, 62130.0, 342556.0, 5.513536133912764, 5.513536133912764, NULL, 97850.0, 539499.5107033639, '2027-01-01', 'New', 'New/alternative source/vendor', 'alternative source: 295578', 'NO', NULL, -2.2, 3.3135361339127636, 102000.0, 337980.6856591019, -201518.82504426205, 22881.17495573797, 0.0, -224400.00000000003, 0.22440000000000002, 0.0, NULL, NULL, NULL, 8500.0, 8500.0, 8500.0, 8500.0, 8500.0, 8500.0, 8500.0, 8500.0, 8500.0, 0.0, 0.0, 0.0, 18700.0, 18700.0, 18700.0, 18700.0, 18700.0, 18700.0, 18700.0, 18700.0, 18700.0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- Roles: admin (upload + user management) vs viewer (read-only)
create type public.app_role as enum ('admin', 'viewer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'viewer',
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Signed-in users can read roles"
  on public.user_roles for select
  to authenticated
  using (true);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- The first person to sign up becomes admin; everyone after starts as viewer.
create or replace function public.assign_role_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'viewer')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger on_user_created_assign_role
  after insert on auth.users
  for each row execute function public.assign_role_on_signup();
