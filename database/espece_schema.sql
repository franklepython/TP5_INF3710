DROP SCHEMA IF EXISTS ornithologue_bd CASCADE;

CREATE SCHEMA ornithologue_bd;
SET search_path = ornithologue_bd;

CREATE TABLE Especeoiseau (
    nomscientifique VARCHAR(255) PRIMARY KEY,
    nomcommun VARCHAR(255),
    statutspeces VARCHAR(255),
    nomscientifiquecomsommer VARCHAR(255),
    FOREIGN KEY (nomscientifiquecomsommer) REFERENCES Especeoiseau(nomscientifique)
);
