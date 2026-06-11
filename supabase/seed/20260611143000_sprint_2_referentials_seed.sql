insert into public.channels (key, label, status, sort_order)
values
  ('wordpress', 'WordPress', 'enabled', 10),
  ('linkedin', 'LinkedIn', 'enabled', 20),
  ('pinterest', 'Pinterest', 'enabled', 30),
  ('google_business', 'Google Business', 'enabled', 40),
  ('instagram', 'Instagram', 'coming_soon', 50),
  ('facebook', 'Facebook', 'coming_soon', 60),
  ('newsletter', 'Newsletter', 'coming_soon', 70)
on conflict (key) do update
set
  label = excluded.label,
  status = excluded.status,
  sort_order = excluded.sort_order;

insert into public.content_pillars (key, label, target_percentage, is_active, sort_order)
values
  ('etudes-de-projet', 'Études de projet', 35, true, 10),
  ('savoir-faire', 'Savoir-faire', 20, true, 20),
  ('materiaux', 'Matériaux', 20, true, 30),
  ('realisations', 'Réalisations', 10, true, 40),
  ('actualites-evenements', 'Actualités / événements', 10, true, 50),
  ('conseils-tendances', 'Conseils / tendances', 5, true, 60)
on conflict (key) do update
set
  label = excluded.label,
  target_percentage = excluded.target_percentage,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.wordpress_categories (slug, label, wordpress_id, is_active, sort_order)
values
  ('realisations', 'Réalisations', null, true, 10),
  ('materiaux', 'Matériaux', null, true, 20),
  ('evenements', 'Événements', null, true, 30),
  ('actualites', 'Actualités', null, true, 40),
  ('etudes-de-projet', 'Études de projet', null, true, 50)
on conflict (slug) do update
set
  label = excluded.label,
  wordpress_id = excluded.wordpress_id,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.ai_providers (key, label, status, is_default)
values
  ('openai', 'OpenAI', 'available', false),
  ('anthropic', 'Anthropic', 'available', false),
  ('google_gemini', 'Google Gemini', 'available', false),
  ('ollama', 'Ollama', 'available', false),
  ('mistral', 'Mistral', 'available', false),
  ('other', 'Autre modèle', 'available', false)
on conflict (key) do update
set
  label = excluded.label,
  status = excluded.status,
  is_default = excluded.is_default;

