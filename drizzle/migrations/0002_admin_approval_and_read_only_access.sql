-- Existing non-admin accounts were never explicitly approved; require review.
update public.user_roles set role = 'pending' where role = 'viewer';
alter table public.user_roles alter column role set default 'pending';

-- A single role per account makes approval and revocation unambiguous.
alter table public.user_roles drop constraint if exists user_roles_user_id_role_key;
delete from public.user_roles a
using public.user_roles b
where a.user_id = b.user_id and a.id > b.id;
create unique index if not exists user_roles_user_id_unique on public.user_roles(user_id);

create or replace function public.has_any_approved_role(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role in ('admin', 'viewer')
  )
$$;

drop policy if exists "Signed-in users can read initiatives" on public.savings_initiatives;
drop policy if exists "Approved users can read initiatives" on public.savings_initiatives;
create policy "Approved users can read initiatives"
  on public.savings_initiatives for select
  to authenticated
  using (public.has_any_approved_role(auth.uid()));

revoke insert, update, delete on public.savings_initiatives from authenticated;
grant select on public.savings_initiatives to authenticated;

create or replace function public.assign_role_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtext('assign-role-on-signup'));
  if not exists (select 1 from auth.users where id <> new.id) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict (user_id) do nothing;
  else
    insert into public.user_roles (user_id, role) values (new.id, 'pending')
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

-- Ensure existing auth accounts without a role are also held for approval.
insert into public.user_roles (user_id, role)
select u.id, 'pending' from auth.users u
where not exists (select 1 from public.user_roles r where r.user_id = u.id)
on conflict (user_id) do nothing;
