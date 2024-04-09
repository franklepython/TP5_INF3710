SET search_path = especeDB;

DROP SCHEMA IF EXISTS HOTELDB CASCADE;
CREATE SCHEMA HOTELDB;

CREATE TABLE IF NOT EXISTS HOTELDB.Espece (
    nomScientifique     VARCHAR(10)     NOT NULL,
    nomCommun        VARCHAR(20)     NOT NULL,
    status        VARCHAR(50)     NOT NULL,
    PRIMARY KEY (nomScientifique)
);

CREATE TABLE IF NOT EXISTS HOTELDB.Room(
    roomNb  VARCHAR(10)     NOT NULL,
    nomScientifique VARCHAR(10)     NOT NULL,
    type    VARCHAR(10)     NOT NULL,
    price   NUMERIC(6,3)    NOT NULL,
    PRIMARY KEY (roomNb, nomScientifique),
    FOREIGN KEY(nomScientifique) REFERENCES HOTELDB.Espece(nomScientifique) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE DOMAIN HOTELDB.genderType AS CHAR
    CHECK (VALUE IN ('M', 'F', 'O'));

CREATE TABLE IF NOT EXISTS HOTELDB.Guest(
    guestNb VARCHAR(10) NOT NULL,
    nas     VARCHAR(10) UNIQUE NOT NULL,
    nomCommun    VARCHAR(20) NOT NULL,
    gender  genderType  DEFAULT 'M',
    status    VARCHAR(50) NOT NULL,
    PRIMARY KEY (guestNb)
);

CREATE TABLE IF NOT EXISTS HOTELDB.Booking(
    nomScientifique     VARCHAR(10)     NOT NULL,
    roomNb      VARCHAR(10)     NOT NULL,
    guestNb     VARCHAR(10)     NOT NULL,
    dateFrom    DATE            NOT NULL,
    dateTo      DATE            NULL,
    PRIMARY KEY (nomScientifique, guestNb, roomNb, dateFrom),
    FOREIGN KEY (guestNb) REFERENCES HOTELDB.Guest(guestNb)
    ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (nomScientifique, roomNb) REFERENCES HOTELDB.Room (nomScientifique, roomNb)
    ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT date CHECK (dateTo >= dateFrom),
    CONSTRAINT dateFrom CHECK (dateFrom >= current_date)
);

ALTER TABLE HOTELDB.Guest ALTER gender DROP DEFAULT;