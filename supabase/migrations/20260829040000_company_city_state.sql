alter table public.companies add column if not exists state text;
alter table public.submissions add column if not exists state text;

update public.companies
set state = 'Jalisco'
where slug = 'collabify'
  and (state is null or state = '');
