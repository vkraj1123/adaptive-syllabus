-- Multi-exam profile migration for Adaptive Syllabus
create table if not exists public.student_exams (
  user_id uuid not null references public.profiles(id) on delete cascade,
  exam text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, exam)
);
alter table public.student_exams enable row level security;
drop policy if exists "student exams self select" on public.student_exams;
drop policy if exists "student exams self insert" on public.student_exams;
drop policy if exists "student exams self delete" on public.student_exams;
drop policy if exists "admins read student exams" on public.student_exams;
create policy "student exams self select" on public.student_exams for select using (auth.uid()=user_id or public.is_admin());
create policy "student exams self insert" on public.student_exams for insert with check (auth.uid()=user_id);
create policy "student exams self delete" on public.student_exams for delete using (auth.uid()=user_id or public.is_admin());
create policy "admins read student exams" on public.student_exams for select using (public.is_admin());

-- Existing profile exam becomes the initial selected exam.
insert into public.student_exams(user_id, exam)
select id, exam from public.profiles
on conflict (user_id, exam) do nothing;

-- Future signups: first account is admin; all later accounts are students.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public
as $$
declare first_account boolean;
declare first_exam text;
begin
  perform pg_advisory_xact_lock(918273645);
  select not exists(select 1 from public.profiles) into first_account;
  first_exam := coalesce(new.raw_user_meta_data->>'exam','ras');
  insert into public.profiles(id,user_id,name,dob,exam,role)
  values(new.id,coalesce(new.raw_user_meta_data->>'user_id',split_part(new.email,'@',1)),coalesce(new.raw_user_meta_data->>'name','Student'),nullif(new.raw_user_meta_data->>'dob','')::date,first_exam,case when first_account then 'admin' else 'student' end)
  on conflict(id) do nothing;
  insert into public.student_exams(user_id,exam) values(new.id,first_exam) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
