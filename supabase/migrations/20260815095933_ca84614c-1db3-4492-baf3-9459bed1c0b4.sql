alter table public.offers
  add column if not exists marketing_consent boolean;

create index if not exists offers_marketing_consent_created_at_idx
  on public.offers (created_at desc)
  where marketing_consent is true;

comment on column public.offers.marketing_consent is
  'Marketing consent at the moment the offer was submitted. Null means unknown (pre-dates the column) and must be treated as no consent. Gates enhanced-conversion uploads of the buyer''s hashed email and phone.';