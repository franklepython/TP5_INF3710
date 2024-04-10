SET search_path = ornithologue_bd;

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
