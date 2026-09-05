-- Fix existing production profiles role constraint.
-- Run this once in Supabase SQL Editor.

alter table public.profiles drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('student','mentor','admin'));

-- Verify current roles after the constraint is fixed.
select id, user_id, name, role, exam
from public.profiles
order by created_at;
