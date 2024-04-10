SET search_path = ornithologue_bd;

-- Insérer des observateurs
INSERT INTO Observateur VALUES 
('OB001', 'Albert Einstein', 'albert.einstein@polymtl.ca'),
('OB002', 'Marie Curie', 'marie.curie@polymtl.ca'),
('OB003', 'Charles Babbage', 'charles.babbage@polymtl.ca'),
('OB004', 'Nikola Tesla', 'nikola.tesla@polymtl.ca'),
('OB005', 'Ada lovelace', 'ada.lovelace@polymtl.ca'),
('OB006', 'Isaac Newton', 'isaac.newton@polymtl.ca'),
('OB007', 'Pierre Lapointe', 'pierre.lapointe@polymtl.ca');

-- Insérer des communautés
INSERT INTO Communaute VALUES 
('Les oiseaux de montréal', 'Communauté damateur doiseaux dans la région de Montréal'),
('Les oiseaux rares', 'Communauté chasant des oiseaux rares');

-- Insérer des amateurs
INSERT INTO Amateur VALUES 
('OB001', 90, 'Les oiseaux de montréal'),
('OB003', 85, 'Les oiseaux rares'),
('OB005', 70, 'Les oiseaux de montréal');

-- Insérer des professionnels
INSERT INTO Professionnel VALUES 
('OB002', 'License1'),
('OB004', 'License2'),
('OB006', 'License3'),
('OB007', 'License42');

INSERT INTO Expertise VALUES 
('Ornithologie', 'Les oiseaux de montréal'),
('Biologie', 'Les oiseaux de montréal'),
('Photographie', 'Les oiseaux de montréal'),
('Photographie', 'Les oiseaux rares');

-- Insérer des espèces d'oiseaux
INSERT INTO Especeoiseau VALUES 
('BrantaCanadensis', 'Bernache du Canada', 'Vulnérable', NULL),
('FalcoPeregrinus', 'Faucon pèlerin', 'Préoccupation mineure', NULL),
('PasserDomesticus', 'Moineau domestique', 'Non menacée', NULL),
('CarduelisCarduelis', 'Chardonneret élégant', 'Non menacée', NULL),
('AquilaChrysaetos', 'Aigle royal', 'Vulnérable', NULL),
('BuboBubo', 'Grand-duc dEurope', 'Non menacée', NULL),
('CyanocittaCristata', 'Geai bleu', 'Vulnérable', 'FalcoPeregrinus'),
('TurdusMigratorius', 'Merle américain', 'Non menacée', 'FalcoPeregrinus'),
('SturnusVulgaris', 'Étourneau sansonnet', 'Non menacée', 'BrantaCanadensis'),
('PicaPica', 'Pie bavarde', 'Vulnérable', 'BrantaCanadensis');
