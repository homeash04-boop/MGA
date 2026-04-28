-- School Portal Full V10 Schema
-- نفّذ هذا الملف مرة واحدة في Supabase SQL Editor

do $$
begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace where t.typname='user_role' and n.nspname='public') then
    create type public.user_role as enum ('admin','teacher','student','parent');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace where t.typname='attendance_status' and n.nspname='public') then
    create type public.attendance_status as enum ('present','absent','late','excused');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'student',
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.classes (
  id bigserial primary key,
  name text not null,
  section text,
  created_at timestamptz default now()
);

create table if not exists public.subjects (
  id bigserial primary key,
  name text not null,
  code text,
  created_at timestamptz default now()
);

create table if not exists public.academic_terms (
  id bigserial primary key,
  name text not null,
  year_label text not null,
  starts_on date,
  ends_on date,
  is_active boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.students (
  id bigserial primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  class_id bigint references public.classes(id) on delete set null,
  student_number text unique,
  date_of_birth date,
  address text,
  created_at timestamptz default now()
);

create table if not exists public.parent_students (
  id bigserial primary key,
  parent_id uuid references public.profiles(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  relation text default 'parent',
  unique(parent_id, student_id)
);

create table if not exists public.teacher_subjects (
  id bigserial primary key,
  teacher_id uuid references public.profiles(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  class_id bigint references public.classes(id) on delete cascade,
  unique(teacher_id, subject_id, class_id)
);

create table if not exists public.class_subjects (
  id bigserial primary key,
  class_id bigint references public.classes(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.grades (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  title text not null,
  score numeric(7,2) not null,
  max_score numeric(7,2) not null default 100,
  created_at timestamptz default now()
);

create table if not exists public.attendance (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  class_id bigint references public.classes(id) on delete cascade,
  date date not null default current_date,
  status public.attendance_status not null,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  unique(student_id, date)
);

create table if not exists public.assignments (
  id bigserial primary key,
  class_id bigint references public.classes(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  is_online boolean default true,
  allow_file boolean default false,
  max_score numeric(7,2) default 100,
  created_at timestamptz default now()
);

create table if not exists public.assignment_submissions (
  id bigserial primary key,
  assignment_id bigint references public.assignments(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  answer_text text,
  file_url text,
  score numeric(7,2),
  teacher_note text,
  submitted_at timestamptz default now(),
  graded_at timestamptz,
  unique(assignment_id, student_id)
);

create table if not exists public.timetable (
  id bigserial primary key,
  class_id bigint references public.classes(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  day_of_week int not null check (day_of_week between 1 and 7),
  start_time time not null,
  end_time time not null,
  room text
);

create table if not exists public.announcements (
  id bigserial primary key,
  title text not null,
  body text not null,
  target_role public.user_role,
  class_id bigint references public.classes(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id bigserial primary key,
  sender_id uuid references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete cascade,
  body text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

create table if not exists public.password_reset_requests (
  id bigserial primary key,
  email text not null,
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  admin_id uuid references public.profiles(id) on delete set null,
  admin_note text,
  action_link text,
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

create table if not exists public.grade_visibility_rules (
  id bigserial primary key,
  title text not null,
  is_visible boolean not null default true,
  class_id bigint references public.classes(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  starts_at timestamptz,
  ends_at timestamptz,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.accounting_categories (
  id bigserial primary key,
  name text not null unique,
  type text not null default 'fee' check (type in ('fee','discount','expense')),
  created_at timestamptz default now()
);

create table if not exists public.student_fees (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  category_id bigint references public.accounting_categories(id) on delete set null,
  title text not null,
  amount numeric(10,2) not null check (amount >= 0),
  due_date date,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.student_payments (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  amount numeric(10,2) not null check (amount > 0),
  payment_date date not null default current_date,
  method text default 'cash',
  receipt_no text unique,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.student_discounts (
  id bigserial primary key,
  student_id bigint references public.students(id) on delete cascade,
  academic_term_id bigint references public.academic_terms(id) on delete set null,
  title text not null,
  amount numeric(10,2) not null check (amount >= 0),
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.online_exams (
  id bigserial primary key,
  title text not null,
  description text,
  class_id bigint references public.classes(id) on delete cascade,
  subject_id bigint references public.subjects(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  duration_minutes int not null default 30,
  total_score numeric(7,2) not null default 100,
  starts_at timestamptz,
  ends_at timestamptz,
  is_published boolean default false,
  allow_retake boolean default false,
  show_result_immediately boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.online_exam_questions (
  id bigserial primary key,
  exam_id bigint references public.online_exams(id) on delete cascade,
  question_text text not null,
  question_type text not null check (question_type in ('mcq','true_false','short_answer')),
  options jsonb,
  correct_answer text,
  score numeric(7,2) not null default 1,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.online_exam_attempts (
  id bigserial primary key,
  exam_id bigint references public.online_exams(id) on delete cascade,
  student_id bigint references public.students(id) on delete cascade,
  started_at timestamptz default now(),
  submitted_at timestamptz,
  auto_score numeric(7,2) default 0,
  manual_score numeric(7,2) default 0,
  total_score numeric(7,2) default 0,
  status text not null default 'in_progress' check (status in ('in_progress','submitted','graded'))
);

create table if not exists public.online_exam_answers (
  id bigserial primary key,
  attempt_id bigint references public.online_exam_attempts(id) on delete cascade,
  question_id bigint references public.online_exam_questions(id) on delete cascade,
  answer_text text,
  is_correct boolean,
  score_awarded numeric(7,2) default 0,
  teacher_note text,
  unique(attempt_id, question_id)
);

create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.subjects enable row level security;
alter table public.academic_terms enable row level security;
alter table public.students enable row level security;
alter table public.parent_students enable row level security;
alter table public.teacher_subjects enable row level security;
alter table public.class_subjects enable row level security;
alter table public.grades enable row level security;
alter table public.attendance enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.timetable enable row level security;
alter table public.announcements enable row level security;
alter table public.messages enable row level security;
alter table public.app_settings enable row level security;
alter table public.password_reset_requests enable row level security;
alter table public.grade_visibility_rules enable row level security;
alter table public.accounting_categories enable row level security;
alter table public.student_fees enable row level security;
alter table public.student_payments enable row level security;
alter table public.student_discounts enable row level security;
alter table public.online_exams enable row level security;
alter table public.online_exam_questions enable row level security;
alter table public.online_exam_attempts enable row level security;
alter table public.online_exam_answers enable row level security;

-- Clean old policies
do $$
declare r record;
begin
  for r in (select schemaname, tablename, policyname from pg_policies where schemaname='public') loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- Pragmatic MVP policies
create policy "profiles read authenticated" on public.profiles for select to authenticated using (true);
create policy "profiles admin all" on public.profiles for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "all read authenticated classes" on public.classes for select to authenticated using (true);
create policy "admin all classes" on public.classes for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "all read subjects" on public.subjects for select to authenticated using (true);
create policy "admin all subjects" on public.subjects for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "all read terms" on public.academic_terms for select to authenticated using (true);
create policy "admin all terms" on public.academic_terms for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "students read authenticated" on public.students for select to authenticated using (true);
create policy "admin all students" on public.students for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "admin all parent_students" on public.parent_students for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');
create policy "parent_students read own" on public.parent_students for select to authenticated using (parent_id=auth.uid() or public.current_user_role()='admin');

create policy "teacher_subjects read" on public.teacher_subjects for select to authenticated using (true);
create policy "admin all teacher_subjects" on public.teacher_subjects for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "class_subjects read" on public.class_subjects for select to authenticated using (true);
create policy "admin all class_subjects" on public.class_subjects for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "grades read auth" on public.grades for select to authenticated using (true);
create policy "grades teacher admin all" on public.grades for all to authenticated using (public.current_user_role() in ('admin','teacher')) with check (public.current_user_role() in ('admin','teacher'));

create policy "attendance read auth" on public.attendance for select to authenticated using (true);
create policy "attendance teacher admin all" on public.attendance for all to authenticated using (public.current_user_role() in ('admin','teacher')) with check (public.current_user_role() in ('admin','teacher'));

create policy "assignments read auth" on public.assignments for select to authenticated using (true);
create policy "assignments teacher admin all" on public.assignments for all to authenticated using (public.current_user_role() in ('admin','teacher')) with check (public.current_user_role() in ('admin','teacher'));

create policy "submissions read auth" on public.assignment_submissions for select to authenticated using (true);
create policy "submissions student insert update" on public.assignment_submissions for all to authenticated using (true) with check (true);

create policy "timetable read auth" on public.timetable for select to authenticated using (true);
create policy "timetable admin all" on public.timetable for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "announcements read auth" on public.announcements for select to authenticated using (true);
create policy "announcements admin all" on public.announcements for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "messages read own" on public.messages for select to authenticated using (sender_id=auth.uid() or receiver_id=auth.uid() or public.current_user_role()='admin');
create policy "messages insert own" on public.messages for insert to authenticated with check (sender_id=auth.uid());

create policy "settings read auth" on public.app_settings for select to authenticated using (true);
create policy "settings admin all" on public.app_settings for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "password requests insert" on public.password_reset_requests for insert to anon, authenticated with check (true);
create policy "password requests admin all" on public.password_reset_requests for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "grade_visibility read" on public.grade_visibility_rules for select to authenticated using (true);
create policy "grade_visibility admin all" on public.grade_visibility_rules for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "accounting read auth categories" on public.accounting_categories for select to authenticated using (true);
create policy "accounting admin categories" on public.accounting_categories for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');
create policy "fees read auth" on public.student_fees for select to authenticated using (true);
create policy "fees admin all" on public.student_fees for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');
create policy "payments read auth" on public.student_payments for select to authenticated using (true);
create policy "payments admin all" on public.student_payments for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');
create policy "discounts read auth" on public.student_discounts for select to authenticated using (true);
create policy "discounts admin all" on public.student_discounts for all to authenticated using (public.current_user_role()='admin') with check (public.current_user_role()='admin');

create policy "exams read auth" on public.online_exams for select to authenticated using (true);
create policy "exams teacher admin all" on public.online_exams for all to authenticated using (public.current_user_role() in ('admin','teacher')) with check (public.current_user_role() in ('admin','teacher'));
create policy "questions read auth" on public.online_exam_questions for select to authenticated using (true);
create policy "questions teacher admin all" on public.online_exam_questions for all to authenticated using (public.current_user_role() in ('admin','teacher')) with check (public.current_user_role() in ('admin','teacher'));
create policy "attempts read auth" on public.online_exam_attempts for select to authenticated using (true);
create policy "attempts all auth" on public.online_exam_attempts for all to authenticated using (true) with check (true);
create policy "answers read auth" on public.online_exam_answers for select to authenticated using (true);
create policy "answers all auth" on public.online_exam_answers for all to authenticated using (true) with check (true);

-- Views
create or replace view public.student_account_summary as
select
  s.id as student_id,
  s.student_number,
  p.full_name as student_name,
  c.name as class_name,
  c.section as class_section,
  coalesce(f.total_fees, 0) as total_fees,
  coalesce(d.total_discounts, 0) as total_discounts,
  coalesce(pay.total_payments, 0) as total_payments,
  coalesce(f.total_fees, 0) - coalesce(d.total_discounts, 0) - coalesce(pay.total_payments, 0) as balance
from public.students s
left join public.profiles p on p.id = s.profile_id
left join public.classes c on c.id = s.class_id
left join (select student_id, sum(amount) as total_fees from public.student_fees group by student_id) f on f.student_id = s.id
left join (select student_id, sum(amount) as total_discounts from public.student_discounts group by student_id) d on d.student_id = s.id
left join (select student_id, sum(amount) as total_payments from public.student_payments group by student_id) pay on pay.student_id = s.id;

-- Defaults
insert into public.classes (name, section) values ('الصف السابع','أ'),('الصف الثامن','أ') on conflict do nothing;
insert into public.subjects (name, code) values ('الرياضيات','MATH'),('العلوم','SCI'),('اللغة العربية','AR') on conflict do nothing;
insert into public.academic_terms (name, year_label, starts_on, ends_on, is_active)
values ('الفصل الأول','2026/2027','2026-09-01','2027-01-15',true),('الفصل الثاني','2026/2027','2027-02-01','2027-06-15',false)
on conflict do nothing;
insert into public.accounting_categories (name, type) values ('رسوم مدرسية','fee'),('رسوم باص','fee'),('رسوم كتب','fee'),('خصم أخوة','discount'),('منحة','discount') on conflict (name) do nothing;
insert into public.app_settings (key, value) values ('school_name','بوابة الطالب المدرسية'),('school_email_domain','mga-school.com'),('student_number_prefix','MGA-ST') on conflict (key) do nothing;
insert into public.grade_visibility_rules (title, is_visible, note)
select 'الإعداد الافتراضي: العلامات ظاهرة', true, 'يمكن إضافة قواعد إخفاء مخصصة'
where not exists (select 1 from public.grade_visibility_rules);
