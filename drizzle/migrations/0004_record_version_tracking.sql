alter table public.savings_initiatives
  add column if not exists record_status text not null default 'old',
  add column if not exists imported_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'savings_initiatives_record_status_check'
      and conrelid = 'public.savings_initiatives'::regclass
  ) then
    alter table public.savings_initiatives
      add constraint savings_initiatives_record_status_check
      check (record_status in ('new', 'old'));
  end if;
end $$;

create index if not exists savings_initiatives_mat_plant_idx
  on public.savings_initiatives (mat_plant);
create index if not exists savings_initiatives_imported_at_idx
  on public.savings_initiatives (imported_at desc);
