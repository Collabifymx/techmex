alter table public.companies
  alter column created_at type timestamptz
  using created_at::timestamptz;

update public.companies as c
set created_at = s.created_at
from public.submissions as s
where s.kind = 'project'
  and s.status = 'approved'
  and s.url = c.url;
