-- Attendance tracking
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  created_at timestamptz default now(),
  unique(user_id, date)
);

alter table public.attendance enable row level security;

-- All authenticated can view attendance
create policy "attendance_select_all" on public.attendance
  for select using (auth.role() = 'authenticated');

-- Users can insert their own attendance
create policy "attendance_insert_own" on public.attendance
  for insert with check (auth.uid() = user_id);
