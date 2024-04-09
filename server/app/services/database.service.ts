import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { Room } from "../../../common/tables/Room";
import { Espece } from "../../../common/tables/Espece";
import { Gender, Guest } from "../../../common/tables/Guest";

@injectable()
export class DatabaseService {
  // TODO: A MODIFIER POUR VOTRE BD
  public connectionConfig: pg.ConnectionConfig = {
    user: "postgres",
    database: "postgres",
    password: "INF3710",
    port: 5432,
    host: "127.0.0.1",
    keepAlive: true,
  };

  public pool: pg.Pool = new pg.Pool(this.connectionConfig);

  // ======= DEBUG =======
  public async getAllFromTable(
    tableNomCommun: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query(`SELECT * FROM HOTELDB.${tableNomCommun};`);
    client.release();
    return res;
  }

  // ======= HOTEL =======
  public async createEspece(espece: Espece): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!espece.nomScientifique || !espece.nomCommun || !espece.status)
      throw new Error("Invalid create espece values");

    const values: string[] = [
      espece.nomScientifique,
      espece.nomCommun,
      espece.status,
    ];
    const queryText: string = `INSERT INTO HOTELDB.Espece VALUES($1, $2, $3);`;

    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  // get especes that correspond to certain caracteristics
  public async filterEspeces(
    nomScientifique: string,
    especeNomCommun: string,
    status: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const searchTerms: string[] = [];
    if (nomScientifique.length > 0)
      searchTerms.push(`nomScientifique = '${nomScientifique}'`);
    if (especeNomCommun.length > 0)
      searchTerms.push(`nomCommun = '${especeNomCommun}'`);
    if (status.length > 0) searchTerms.push(`status = '${status}'`);

    let queryText = "SELECT * FROM HOTELDB.Espece";
    if (searchTerms.length > 0)
      queryText += " WHERE " + searchTerms.join(" AND ");
    queryText += ";";

    const res = await client.query(queryText);
    client.release();
    return res;
  }

  // get the espece nomCommuns and numbers so so that the user can only select an existing espece
  public async getEspeceNomCommunsByNos(): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query(
      "SELECT nomScientifique, nomCommun FROM HOTELDB.Espece;"
    );
    client.release();
    return res;
  }

  // modify nomCommun or status of a espece
  public async updateEspece(espece: Espece): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];

    if (espece.nomCommun.length > 0)
      toUpdateValues.push(`nomCommun = '${espece.nomCommun}'`);
    if (espece.status.length > 0)
      toUpdateValues.push(`status = '${espece.status}'`);

    if (
      !espece.nomScientifique ||
      espece.nomScientifique.length === 0 ||
      toUpdateValues.length === 0
    )
      throw new Error("Invalid espece update query");

    const query = `UPDATE HOTELDB.Espece SET ${toUpdateValues.join(
      ", "
    )} WHERE nomScientifique = '${espece.nomScientifique}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteEspece(nomScientifique: string): Promise<pg.QueryResult> {
    if (nomScientifique.length === 0) throw new Error("Invalid delete query");

    const client = await this.pool.connect();
    const query = `DELETE FROM HOTELDB.Espece WHERE nomScientifique = '${nomScientifique}';`;

    const res = await client.query(query);
    client.release();
    return res;
  }

  // ======= ROOMS =======
  public async createRoom(room: Room): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!room.roomnb || !room.nomScientifique || !room.type || !room.price)
      throw new Error("Invalid create room values");

    const values: string[] = [
      room.roomnb,
      room.nomScientifique,
      room.type,
      room.price.toString(),
    ];
    const queryText: string = `INSERT INTO HOTELDB.ROOM VALUES($1, $2, $3, $4);`;

    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  public async filterRooms(
    nomScientifique: string,
    roomNb: string = "",
    roomType: string = "",
    price: number = -1
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!nomScientifique || nomScientifique.length === 0)
      throw new Error("Invalid filterRooms request");

    let searchTerms = [];
    searchTerms.push(`nomScientifique = '${nomScientifique}'`);

    if (roomNb.length > 0)
      searchTerms.push(`nomScientifique = '${nomScientifique}'`);
    if (roomType.length > 0) searchTerms.push(`type = '${roomType}'`);
    if (price >= 0) searchTerms.push(`price = ${price}`);

    let queryText = `SELECT * FROM HOTELDB.Room WHERE ${searchTerms.join(
      " AND "
    )};`;
    const res = await client.query(queryText);
    client.release();
    return res;
  }

  public async updateRoom(room: Room): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];
    if (room.price >= 0) toUpdateValues.push(`price = ${room.price}`);
    if (room.type.length > 0) toUpdateValues.push(`type = '${room.type}'`);

    if (
      !room.nomScientifique ||
      room.nomScientifique.length === 0 ||
      !room.roomnb ||
      room.roomnb.length === 0 ||
      toUpdateValues.length === 0
    )
      throw new Error("Invalid room update query");

    const query = `UPDATE HOTELDB.Room SET ${toUpdateValues.join(
      ", "
    )} WHERE nomScientifique = '${room.nomScientifique}' AND roomNb = '${
      room.roomnb
    }';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteRoom(
    nomScientifique: string,
    roomNb: string
  ): Promise<pg.QueryResult> {
    if (nomScientifique.length === 0)
      throw new Error("Invalid room delete query");
    const client = await this.pool.connect();

    const query = `DELETE FROM HOTELDB.Room WHERE nomScientifique = '${nomScientifique}' AND roomNb = '${roomNb}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  // ======= GUEST =======
  public async createGuest(guest: Guest): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    if (
      !guest.guestnb ||
      !guest.nas ||
      !guest.nomCommun ||
      !guest.gender ||
      !guest.status
    )
      throw new Error("Invalid create room values");

    if (!(guest.gender in Gender))
      throw new Error("Unknown guest gender passed");

    const values: string[] = [
      guest.guestnb,
      guest.nas,
      guest.nomCommun,
      guest.gender,
      guest.status,
    ];
    const queryText: string = `INSERT INTO HOTELDB.Guest VALUES($1, $2, $3, $4, $5);`;
    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  public async getGuests(
    nomScientifique: string,
    roomNb: string
  ): Promise<pg.QueryResult> {
    if (!nomScientifique || nomScientifique.length === 0)
      throw new Error("Invalid guest espece no");

    const client = await this.pool.connect();
    const queryExtension = roomNb ? ` AND b.roomNb = '${roomNb}'` : "";
    const query: string = `SELECT * FROM HOTELDB.Guest g JOIN HOTELDB.Booking b ON b.guestNb = g.guestNb WHERE b.nomScientifique = '${nomScientifique}'${queryExtension};`;

    const res = await client.query(query);
    client.release();
    return res;
  }

  // ======= BOOKING =======
  public async createBooking(
    nomScientifique: string,
    guestNo: string,
    dateFrom: Date,
    dateTo: Date,
    roomNb: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const values: string[] = [
      nomScientifique,
      guestNo,
      dateFrom.toString(),
      dateTo.toString(),
      roomNb,
    ];
    const queryText: string = `INSERT INTO HOTELDB.ROOM VALUES($1,$2,$3,$4,$5);`;

    const res = await client.query(queryText, values);
    client.release();
    return res;
  }
}
