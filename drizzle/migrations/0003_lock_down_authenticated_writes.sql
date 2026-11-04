revoke insert, update, delete on public.savings_initiatives from anon, authenticated;
grant select on public.savings_initiatives to authenticated;

revoke insert, update, delete on public.user_roles from anon, authenticated;
grant select on public.user_roles to authenticated;
