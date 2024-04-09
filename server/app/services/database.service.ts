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
  public async getAllFromTable(tableName: string): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query(`SELECT * FROM HOTELDB.${tableName};`);
    client.release();
    return res;
  }

  // ======= HOTEL =======
  public async createEspece(espece: Espece): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!espece.especenb || !espece.name || !espece.city)
      throw new Error("Invalid create espece values");

    const values: string[] = [espece.especenb, espece.name, espece.city];
    const queryText: string = `INSERT INTO HOTELDB.Espece VALUES($1, $2, $3);`;

    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  // get especes that correspond to certain caracteristics
  public async filterEspeces(
    especeNb: string,
    especeName: string,
    city: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const searchTerms: string[] = [];
    if (especeNb.length > 0) searchTerms.push(`especeNb = '${especeNb}'`);
    if (especeName.length > 0) searchTerms.push(`name = '${especeName}'`);
    if (city.length > 0) searchTerms.push(`city = '${city}'`);

    let queryText = "SELECT * FROM HOTELDB.Espece";
    if (searchTerms.length > 0)
      queryText += " WHERE " + searchTerms.join(" AND ");
    queryText += ";";

    const res = await client.query(queryText);
    client.release();
    return res;
  }

  // get the espece names and numbers so so that the user can only select an existing espece
  public async getEspeceNamesByNos(): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query(
      "SELECT especeNb, name FROM HOTELDB.Espece;"
    );
    client.release();
    return res;
  }

  // modify name or city of a espece
  public async updateEspece(espece: Espece): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];

    if (espece.name.length > 0) toUpdateValues.push(`name = '${espece.name}'`);
    if (espece.city.length > 0) toUpdateValues.push(`city = '${espece.city}'`);

    if (
      !espece.especenb ||
      espece.especenb.length === 0 ||
      toUpdateValues.length === 0
    )
      throw new Error("Invalid espece update query");

    const query = `UPDATE HOTELDB.Espece SET ${toUpdateValues.join(
      ", "
    )} WHERE especeNb = '${espece.especenb}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteEspece(especeNb: string): Promise<pg.QueryResult> {
    if (especeNb.length === 0) throw new Error("Invalid delete query");

    const client = await this.pool.connect();
    const query = `DELETE FROM HOTELDB.Espece WHERE especeNb = '${especeNb}';`;

    const res = await client.query(query);
    client.release();
    return res;
  }

  // ======= ROOMS =======
  public async createRoom(room: Room): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!room.roomnb || !room.especenb || !room.type || !room.price)
      throw new Error("Invalid create room values");

    const values: string[] = [
      room.roomnb,
      room.especenb,
      room.type,
      room.price.toString(),
    ];
    const queryText: string = `INSERT INTO HOTELDB.ROOM VALUES($1, $2, $3, $4);`;

    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  public async filterRooms(
    especeNb: string,
    roomNb: string = "",
    roomType: string = "",
    price: number = -1
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!especeNb || especeNb.length === 0)
      throw new Error("Invalid filterRooms request");

    let searchTerms = [];
    searchTerms.push(`especeNb = '${especeNb}'`);

    if (roomNb.length > 0) searchTerms.push(`especeNb = '${especeNb}'`);
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
      !room.especenb ||
      room.especenb.length === 0 ||
      !room.roomnb ||
      room.roomnb.length === 0 ||
      toUpdateValues.length === 0
    )
      throw new Error("Invalid room update query");

    const query = `UPDATE HOTELDB.Room SET ${toUpdateValues.join(
      ", "
    )} WHERE especeNb = '${room.especenb}' AND roomNb = '${room.roomnb}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteRoom(
    especeNb: string,
    roomNb: string
  ): Promise<pg.QueryResult> {
    if (especeNb.length === 0) throw new Error("Invalid room delete query");
    const client = await this.pool.connect();

    const query = `DELETE FROM HOTELDB.Room WHERE especeNb = '${especeNb}' AND roomNb = '${roomNb}';`;
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
      !guest.name ||
      !guest.gender ||
      !guest.city
    )
      throw new Error("Invalid create room values");

    if (!(guest.gender in Gender))
      throw new Error("Unknown guest gender passed");

    const values: string[] = [
      guest.guestnb,
      guest.nas,
      guest.name,
      guest.gender,
      guest.city,
    ];
    const queryText: string = `INSERT INTO HOTELDB.Guest VALUES($1, $2, $3, $4, $5);`;
    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  public async getGuests(
    especeNb: string,
    roomNb: string
  ): Promise<pg.QueryResult> {
    if (!especeNb || especeNb.length === 0)
      throw new Error("Invalid guest espece no");

    const client = await this.pool.connect();
    const queryExtension = roomNb ? ` AND b.roomNb = '${roomNb}'` : "";
    const query: string = `SELECT * FROM HOTELDB.Guest g JOIN HOTELDB.Booking b ON b.guestNb = g.guestNb WHERE b.especeNb = '${especeNb}'${queryExtension};`;

    const res = await client.query(query);
    client.release();
    return res;
  }

  // ======= BOOKING =======
  public async createBooking(
    especeNb: string,
    guestNo: string,
    dateFrom: Date,
    dateTo: Date,
    roomNb: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const values: string[] = [
      especeNb,
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
