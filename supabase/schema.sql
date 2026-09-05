-- Adaptive Syllabus cloud schema
-- Run this once in Supabase SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_id text unique not null,
  name text not null,
  dob date,
  exam text not null,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exam text not null,
  question_id text not null,
  node_id text,
  selected smallint,
  answer smallint,
  correct boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists public.question_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  exam text not null,
  question_id text not null,
  attempts integer not null default 0,
  correct integer not null default 0,
  mastery integer not null default 50,
  last_attempt_at timestamptz,
  primary key (user_id, exam, question_id)
);

create index if not exists attempts_user_exam_idx on public.attempts(user_id, exam, created_at desc);
create index if not exists attempts_exam_idx on public.attempts(exam, created_at desc);

alter table public.profiles enable row level security;
alter table public.attempts enable row level security;
alter table public.question_progress enable row level security;

-- A student can read/update only their own profile.
create policy "profiles self select" on public.profiles for select using (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);

-- Students can write/read only their own learning data.
create policy "attempts self select" on public.attempts for select using (auth.uid() = user_id);
create policy "attempts self insert" on public.attempts for insert with check (auth.uid() = user_id);
create policy "progress self select" on public.question_progress for select using (auth.uid() = user_id);
create policy "progress self insert" on public.question_progress for insert with check (auth.uid() = user_id);
create policy "progress self update" on public.question_progress for update using (auth.uid() = user_id);

-- Admins can inspect all student profiles and performance.
create policy "admins read profiles" on public.profiles for select using (
  auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "admins read attempts" on public.attempts for select using (
  auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "admins read progress" on public.question_progress for select using (
  auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- New auth users automatically get a profile only if metadata supplies the fields.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id,user_id,name,dob,exam,role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_id', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'name', 'Student'),
    nullif(new.raw_user_meta_data->>'dob','')::date,
    coalesce(new.raw_user_meta_data->>'exam','ras'),
    'student'
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- After your first cloud account is created, promote it manually:
-- update public.profiles set role='admin' where user_id='YOUR_ADMIN_ID';
