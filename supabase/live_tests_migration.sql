-- Live concept/syllabus tests
create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  exam text not null,
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  duration_sec integer not null default 1800,
  status text not null default 'draft' check (status in ('draft','published','completed')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  check (end_at > start_at)
);
create table if not exists public.test_questions (
  test_id uuid not null references public.tests(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  order_no integer not null,
  primary key (test_id, question_id),
  unique (test_id, order_no)
);
create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score numeric,
  correct integer not null default 0,
  wrong integer not null default 0,
  unanswered integer not null default 0,
  total integer not null default 0,
  unique(test_id,user_id)
);
create table if not exists public.test_answers (
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  selected smallint,
  correct boolean not null,
  primary key (attempt_id, question_id)
);
create index if not exists tests_window_idx on public.tests(status,start_at,end_at);
create index if not exists test_questions_test_idx on public.test_questions(test_id,order_no);
create index if not exists test_attempts_test_idx on public.test_attempts(test_id,score desc,submitted_at);

alter table public.tests enable row level security;
alter table public.test_questions enable row level security;
alter table public.test_attempts enable row level security;
alter table public.test_answers enable row level security;

drop policy if exists "staff manage tests" on public.tests;
drop policy if exists "students see live tests" on public.tests;
drop policy if exists "staff manage test questions" on public.test_questions;
drop policy if exists "students see live test questions" on public.test_questions;
drop policy if exists "students manage own test attempts" on public.test_attempts;
drop policy if exists "students manage own test answers" on public.test_answers;

create policy "staff manage tests" on public.tests for all to authenticated using(public.is_staff()) with check(public.is_staff());
create policy "students see live tests" on public.tests for select to authenticated using(status='published' and now() between start_at and end_at);
create policy "staff manage test questions" on public.test_questions for all to authenticated using(public.is_staff()) with check(public.is_staff());
create policy "students see live test questions" on public.test_questions for select to authenticated using(exists(select 1 from public.tests t where t.id=test_id and t.status='published' and now() between t.start_at and t.end_at));
create policy "students manage own test attempts" on public.test_attempts for select to authenticated using(auth.uid()=user_id or public.is_staff());
create policy "students create own test attempts" on public.test_attempts for insert to authenticated with check(auth.uid()=user_id);
create policy "students update own test attempts" on public.test_attempts for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "students manage own test answers" on public.test_answers for select to authenticated using(exists(select 1 from public.test_attempts a where a.id=attempt_id and (a.user_id=auth.uid() or public.is_staff())));
create policy "students insert own test answers" on public.test_answers for insert to authenticated with check(exists(select 1 from public.test_attempts a where a.id=attempt_id and a.user_id=auth.uid()));
