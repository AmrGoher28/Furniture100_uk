alter table public.dropship_applications
  add column if not exists plan text;

comment on column public.dropship_applications.plan is
  'Membership tier the applicant says they have in mind (Standard / Plus / Pro / not sure). Free text, set from the public form.';

notify pgrst, 'reload schema';