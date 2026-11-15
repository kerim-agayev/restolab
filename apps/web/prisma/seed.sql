-- Gün 14 seed: SAHTE kişiler ve restoranlar (.test alan adı gerçek değildir).
-- Tekrar çalıştırılabilir: ON CONFLICT DO NOTHING → zaten varsa dokunmaz.
-- Çalıştır: pnpm --filter web db:seed

insert into restaurants (slug, name) values
  ('dolma-evi', 'Dolma Evi'),
  ('cay-bagi', 'Çay Bağı')
on conflict (slug) do nothing;

insert into users (email, name) values
  ('leyla@restolab.test',  'Leyla Məmmədova'),
  ('rauf@restolab.test',   'Rauf Əliyev'),
  ('nigar@restolab.test',  'Nigar Həsənova'),
  ('kamran@restolab.test', 'Kamran Quliyev')
on conflict (email) do nothing;

-- Üyelikler isimle değil NUMARAYLA bağlanır; numarayı alt sorguyla buluyoruz.
-- Leyla iki restoranda: birinde sahip, diğerinde müdür → çoka-çok (many-to-many) ilişkinin canlı örneği.
insert into memberships (user_id, restaurant_id, role)
select u.id, r.id, m.role::role
from (values
  ('leyla@restolab.test',  'dolma-evi', 'OWNER'),
  ('leyla@restolab.test',  'cay-bagi',  'MANAGER'),
  ('rauf@restolab.test',   'dolma-evi', 'WAITER'),
  ('nigar@restolab.test',  'dolma-evi', 'MANAGER'),
  ('kamran@restolab.test', 'cay-bagi',  'WAITER')
) as m(email, slug, role)
join users u on u.email = m.email
join restaurants r on r.slug = m.slug
on conflict (user_id, restaurant_id) do nothing;
