alter table public.submissions
  add column if not exists review_note text,
  add column if not exists reviewed_at timestamptz;

alter table public.submissions drop constraint if exists submissions_status_check;
alter table public.submissions
  add constraint submissions_status_check
  check (status in ('pending', 'approved', 'rejected'));
