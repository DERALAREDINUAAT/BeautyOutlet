DROP TYPE IF EXISTS categ_produs;
DROP TYPE IF EXISTS tipuri_produse_cosmetice;

CREATE TYPE categ_produs AS ENUM('noutate', 'promotie', 'exclusiv', 'best seller', 'travel size', 'clasic');
CREATE TYPE tipuri_produse_cosmetice AS ENUM('parfum', 'machiaj', 'skincare', 'ingrijire_par', 'accesoriu');

CREATE TABLE IF NOT EXISTS produse (
   id serial PRIMARY KEY,
   nume VARCHAR(100) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL CHECK (pret > 0),
   cantitate_ml INT CHECK (cantitate_ml >= 0),
   tip_produs tipuri_produse_cosmetice DEFAULT 'parfum',
   categorie categ_produs DEFAULT 'clasic',
   ingrediente VARCHAR[], 
   vegan BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT INTO produse (nume, descriere, pret, cantitate_ml, tip_produs, categorie, ingrediente, vegan, imagine) VALUES
('Parfum “Noapte misterioasă”', 'Note de mosc și lemn de santal, pentru seri în care vrei să lași o impresie... de durată.', 120.00, 50, 'parfum', 'exclusiv', '{"alcool","mosc","santal","iasomie"}', False, 'noapte-misterioasa.jpg'),

('Ruj Mat Eternal Kiss', 'Promite să reziste mai mult decât majoritatea relațiilor.', 49.90, 5, 'machiaj', 'best seller', '{"pigmenti","ulei de jojoba"}', True, 'ruj-eternal-kiss.jpg'),

('Crema de față cu aur', 'Pentru cei care vor să pună aurul acolo unde contează... pe frunte.', 185.50, 30, 'skincare', 'noutate', '{"aur","acid hialuronic","colagen"}', False, 'crema-aur.jpg'),

('Șampon Volum Magie', 'Ideal pentru părul care a uitat ce înseamnă volum.', 35.00, 250, 'ingrijire_par', 'clasic', '{"keratina","ulei de argan"}', True, 'sampon-volum.jpg'),

('Mini Parfum “Călător între stele”', 'Perfect pentru călătorii... sau pentru buzunarul de la piept.', 35.00, 10, 'parfum', 'travel size', '{"iasomie","vanilie","patchouli"}', False, 'mini-parfum-stele.jpg'),

('Set pensule “Artist”', 'Transformă orice față în operă de artă... sau măcar într-un schiț.', 89.00, NULL, 'accesoriu', 'promotie', NULL, True, 'set-pensule-artist.jpg'),

('Gel de curățare cu cărbune activ', 'Scoate impuritățile la suprafață... inclusiv gândurile toxice.', 55.00, 150, 'skincare', 'best seller', '{"carbune activ","extract de ceai verde"}', True, 'gel-carbune.jpg'),

('Mascara Volum Nebun', 'Pentru gene care pot flutura în locul tău.', 59.00, 8, 'machiaj', 'clasic', '{"pigmenti","cera alba"}', False, 'mascara-volum.jpg'),

('Ser regenerant “Timp în sticlă”', 'Nu oprește timpul, dar îți dă iluzia că ai putea.', 145.00, 30, 'skincare', 'exclusiv', '{"retinol","acid hialuronic","extract de trandafir"}', False, 'ser-timp.jpg'),

('Parfum “Plimbare de vară”', 'Ușor, floral, și cu miros de vacanță.', 89.00, 75, 'parfum', 'clasic', '{"citronella","iasomie","bergamota"}', True, 'parfum-vara.jpg');

('Cremă de zi „Lumina matinală”', 'Hrănitoare și ușoară, perfectă pentru dimineți grăbite.', 67.50, 50, 'skincare', 'noutate', '{"aloe vera","vitamina C","ulei de măsline"}', True, 'crema-lumina.jpg'),

('Balsam pentru păr „Catifelare”', 'Pentru un păr care se descurcă singur. La propriu.', 29.99, 200, 'ingrijire_par', 'best seller', '{"keratina","ulei de cocos"}', True, 'balsam-catifelare.jpg'),

('Trusă de machiaj „Noir Deluxe”', 'Culori intense, pentru nopți pe măsură.', 139.00, NULL, 'machiaj', 'exclusiv', '{"pigmenti","mica","ulei de ricin"}', False, 'trusa-noir.jpg'),

('Apă micelară „Purificare”', 'Curăță machiajul, impuritățile și... regretele.', 38.90, 150, 'skincare', 'clasic', '{"apa florala","glicerina","extract de castravete"}', True, 'apa-micelara.jpg'),

('Accesoriu: Oglindă de buzunar „Reflexie”', 'Oglinda nu minte. Doar amplifică.', 19.00, NULL, 'accesoriu', 'travel size', NULL, False, 'oglinda-reflexie.jpg'),

('Set unghii „Perfect Finish”', 'Tot ce ai nevoie pentru unghii demne de poză.', 59.00, NULL, 'accesoriu', 'promotie', '{"pile","forfecuță","mini-lac"}', False, 'set-unghii.jpg'),

('Spray de corp „Zori de vară”', 'Ușor, floral, și persistent cât trebuie.', 45.00, 100, 'parfum', 'clasic', '{"iasomie","lămâie","ceai verde"}', True, 'spray-zori.jpg'),

('Pudră iluminatoare „GlowDust”', 'Pentru când vrei să strălucești... la propriu.', 55.00, 20, 'machiaj', 'noutate', '{"mica","praf de perle"}', False, 'pudra-glow.jpg'),

('Set contur ochi „Privire proaspătă”', 'Ascunde orele nedormite sub 5ml de magie.', 88.00, 15, 'skincare', 'exclusiv', '{"acid hialuronic","cofeină","extract de albăstrele"}', True, 'set-ochi.jpg'),

('Rimel colorat „Electric Blue”', 'Un strop de nebunie la fiecare clipire.', 39.90, 9, 'machiaj', 'best seller', '{"pigmenti","ulei de ricin","apa"}', False, 'rimel-electric.jpg');
