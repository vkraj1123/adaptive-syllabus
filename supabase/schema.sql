-- Adaptive Syllabus cloud schema
-- Multi-exam student model: one account can prepare for many exams.
-- Shared cloud question bank: one question source for all students.
-- The first cloud account after a clean reset becomes admin.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_id text unique not null,
  name text not null,
  dob date,
  exam text not null,
  active_exam text,
  role text not null default 'student',
  created_at timestamptz not null default now()
);
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('student','mentor','admin'));

create table if not exists public.student_exams (
  user_id uuid not null references public.profiles(id) on delete cascade,
  exam text not null,
  added_at timestamptz not null default now(),
  primary key (user_id, exam)
);

create table if not exists public.attempts (id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles(id) on delete cascade,exam text not null,question_id text not null,node_id text,selected smallint,answer smallint,correct boolean not null,created_at timestamptz not null default now());
create table if not exists public.question_progress (user_id uuid not null references public.profiles(id) on delete cascade,exam text not null,question_id text not null,attempts integer not null default 0,correct integer not null default 0,mastery integer not null default 50,last_attempt_at timestamptz,primary key (user_id,exam,question_id));
create index if not exists attempts_user_exam_idx on public.attempts(user_id,exam,created_at desc);
create index if not exists attempts_exam_idx on public.attempts(exam,created_at desc);

create table if not exists public.questions (
  id text primary key,
  exam text not null,
  stage text,
  year integer,
  question text not null,
  question_hi text,
  options jsonb not null default '{}'::jsonb,
  options_hi jsonb not null default '{}'::jsonb,
  correct_option text not null check(correct_option in ('A','B','C','D','E')),
  node_id text,
  subject text,
  topic text,
  subtopic text,
  concept text,
  explanation_short text,
  explanation_detailed text,
  explanation_short_hi text,
  explanation_detailed_hi text,
  why_correct text,
  why_others_wrong jsonb,
  key_fact text,
  key_fact_hi text,
  common_confusion text,
  source text,
  difficulty text,
  question_type text,
  pyq boolean default false,
  verification_status text,
  expected_time_sec integer,
  raw_data jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists questions_exam_idx on public.questions(exam);
create index if not exists questions_node_idx on public.questions(exam,node_id);
create index if not exists questions_year_idx on public.questions(exam,year);

alter table public.profiles enable row level security;
alter table public.student_exams enable row level security;
alter table public.attempts enable row level security;
alter table public.question_progress enable row level security;
alter table public.questions enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin'); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.is_staff() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.profiles where id=auth.uid() and role in ('admin','mentor')); $$;
revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated;

drop policy if exists "profiles self select" on public.profiles;
drop policy if exists "profiles self insert" on public.profiles;
drop policy if exists "profiles self update" on public.profiles;
drop policy if exists "admins read profiles" on public.profiles;
drop policy if exists "student exams self select" on public.student_exams;
drop policy if exists "student exams self insert" on public.student_exams;
drop policy if exists "student exams self delete" on public.student_exams;
drop policy if exists "admins read student exams" on public.student_exams;
drop policy if exists "attempts self select" on public.attempts;
drop policy if exists "attempts self insert" on public.attempts;
drop policy if exists "admins read attempts" on public.attempts;
drop policy if exists "progress self select" on public.question_progress;
drop policy if exists "progress self insert" on public.question_progress;
drop policy if exists "progress self update" on public.question_progress;
drop policy if exists "admins read progress" on public.question_progress;
drop policy if exists "questions authenticated select" on public.questions;
drop policy if exists "questions staff insert" on public.questions;
drop policy if exists "questions staff update" on public.questions;
drop policy if exists "questions admins delete" on public.questions;

create policy "profiles self select" on public.profiles for select using (auth.uid()=id or public.is_admin());
create policy "profiles self insert" on public.profiles for insert with check (auth.uid()=id);
create policy "profiles self update" on public.profiles for update using (auth.uid()=id or public.is_admin());
create policy "student exams self select" on public.student_exams for select using (auth.uid()=user_id or public.is_admin());
create policy "student exams self insert" on public.student_exams for insert with check (auth.uid()=user_id or public.is_admin());
create policy "student exams self delete" on public.student_exams for delete using (auth.uid()=user_id or public.is_admin());
create policy "attempts self select" on public.attempts for select using (auth.uid()=user_id or public.is_admin());
create policy "attempts self insert" on public.attempts for insert with check (auth.uid()=user_id);
create policy "progress self select" on public.question_progress for select using (auth.uid()=user_id or public.is_admin());
create policy "progress self insert" on public.question_progress for insert with check (auth.uid()=user_id);
create policy "progress self update" on public.question_progress for update using (auth.uid()=user_id);
create policy "questions authenticated select" on public.questions for select to authenticated using(true);
create policy "questions staff insert" on public.questions for insert to authenticated with check(public.is_staff());
create policy "questions staff update" on public.questions for update to authenticated using(public.is_staff()) with check(public.is_staff());
create policy "questions admins delete" on public.questions for delete to authenticated using(public.is_admin());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
declare first_account boolean; initial_exam text;
begin
  perform pg_advisory_xact_lock(918273645);
  select not exists(select 1 from public.profiles) into first_account;
  initial_exam:=coalesce(new.raw_user_meta_data->>'exam','ras');
  insert into public.profiles(id,user_id,name,dob,exam,active_exam,role)
  values(new.id,coalesce(new.raw_user_meta_data->>'user_id',split_part(new.email,'@',1)),coalesce(new.raw_user_meta_data->>'name','Student'),nullif(new.raw_user_meta_data->>'dob','')::date,initial_exam,initial_exam,case when first_account then 'admin' else 'student' end)
  on conflict(id) do nothing;
  insert into public.student_exams(user_id,exam) values(new.id,initial_exam) on conflict do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into public.student_exams(user_id,exam) select id,coalesce(active_exam,exam) from public.profiles on conflict do nothing;
