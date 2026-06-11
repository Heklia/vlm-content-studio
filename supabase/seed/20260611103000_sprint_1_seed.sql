insert into public.app_settings (key, value, description)
values
  (
    'default_ai_provider',
    'null'::jsonb,
    'Fournisseur IA par défaut, non configuré au Sprint 1.'
  ),
  (
    'default_text_model',
    'null'::jsonb,
    'Modèle texte par défaut, non configuré au Sprint 1.'
  ),
  (
    'mandatory_ai_visual_notice',
    to_jsonb('Visuel d’illustration réalisé dans le cadre d’une étude de projet.'::text),
    'Mention obligatoire pour tout visuel généré par IA.'
  ),
  (
    'publication_frequency_wordpress',
    to_jsonb(1),
    'Fréquence éditoriale initiale WordPress.'
  ),
  (
    'publication_frequency_linkedin',
    to_jsonb(2),
    'Fréquence éditoriale initiale LinkedIn.'
  ),
  (
    'publication_frequency_pinterest',
    to_jsonb(4),
    'Fréquence éditoriale initiale Pinterest.'
  ),
  (
    'publication_frequency_google_business',
    to_jsonb(1),
    'Fréquence éditoriale initiale Google Business.'
  )
on conflict (key) do update
set
  value = excluded.value,
  description = excluded.description;

insert into public.connector_settings (provider, label, status, config)
values
  ('wordpress', 'WordPress', 'disabled', '{}'::jsonb),
  ('linkedin', 'LinkedIn', 'disabled', '{}'::jsonb),
  ('pinterest', 'Pinterest', 'disabled', '{}'::jsonb),
  ('google_business', 'Google Business', 'disabled', '{}'::jsonb),
  ('instagram', 'Instagram', 'disabled', '{}'::jsonb),
  ('facebook', 'Facebook', 'disabled', '{}'::jsonb),
  ('newsletter', 'Newsletter', 'disabled', '{}'::jsonb)
on conflict (provider) do update
set
  label = excluded.label,
  status = excluded.status,
  config = excluded.config;

