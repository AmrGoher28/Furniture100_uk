alter table public.offers
  add column if not exists gclid        text,
  add column if not exists gbraid       text,
  add column if not exists wbraid       text,
  add column if not exists landing_page text,
  add column if not exists referrer     text,
  add column if not exists click_ts     timestamptz,
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text;

create index if not exists offers_click_id_created_at_idx
  on public.offers (created_at desc)
  where gclid is not null or gbraid is not null or wbraid is not null;

comment on column public.offers.gclid is
  'Google Ads click ID captured on landing, for offline conversion upload. Null without marketing consent.';
comment on column public.offers.click_ts is
  'When the ad click was captured, not when the offer was made. Google matches on the click ID; this is for auditing.';
comment on column public.offers.gbraid is
  'Google Analytics 4 cross-device click ID. Null without marketing consent.';
comment on column public.offers.wbraid is
  'Google Analytics 4 iOS/web-to-app click ID. Null without marketing consent.';
comment on column public.offers.landing_page is
  'First page the visitor landed on in the session that produced the offer.';
comment on column public.offers.referrer is
  'Document referrer at the time the click IDs were captured.';
comment on column public.offers.utm_source is
  'UTM source parameter from the landing session.';
comment on column public.offers.utm_medium is
  'UTM medium parameter from the landing session.';
comment on column public.offers.utm_campaign is
  'UTM campaign parameter from the landing session.';