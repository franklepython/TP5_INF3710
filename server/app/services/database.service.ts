import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { Especeoiseau } from "../../../common/tables/Especeoiseau";

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
    tableName: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query(
      `SELECT * FROM ornithologue_bd.${tableName};`
    );
    client.release();
    return res;
  }

  // ======= HOTEL =======
  public async createEspeceoiseau(
    especeoiseau: Especeoiseau
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (
      !especeoiseau.nomscientifique ||
      !especeoiseau.nomcommun ||
      !especeoiseau.statutspeces
    )
      throw new Error("Invalid create especeoiseau values");

    const values: string[] = [
      especeoiseau.nomscientifique,
      especeoiseau.nomcommun,
      especeoiseau.statutspeces,
    ];
    const queryText: string = `INSERT INTO ornithologue_bd.Especeoiseau VALUES($1, $2, $3);`;

    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  // get especeoiseaux that correspond to certain caracteristics
  public async filterEspeceoiseaus(
    nomscientifique: string,
    especeoiseauNomcommun: string,
    statutspeces: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const searchTerms: string[] = [];
    if (nomscientifique.length > 0)
      searchTerms.push(`nomscientifique = '${nomscientifique}'`);
    if (especeoiseauNomcommun.length > 0)
      searchTerms.push(`nomcommun = '${especeoiseauNomcommun}'`);
    if (statutspeces.length > 0)
      searchTerms.push(`statutspeces = '${statutspeces}'`);

    let queryText = "SELECT * FROM ornithologue_bd.Especeoiseau";
    if (searchTerms.length > 0)
      queryText += " WHERE " + searchTerms.join(" AND ");
    queryText += ";";

    const res = await client.query(queryText);
    client.release();
    return res;
  }

  // get the especeoiseau nomcommuns and numbers so so that the user can only select an existing especeoiseau
  public async getEspeceoiseauNomcommunsByNos(): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query(
      "SELECT nomscientifique, nomcommun FROM ornithologue_bd.Especeoiseau;"
    );
    client.release();
    return res;
  }

  // modify nomcommun or statutspeces of a especeoiseau
  public async updateEspeceoiseau(
    especeoiseau: Especeoiseau
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];

    if (especeoiseau.nomcommun.length > 0)
      toUpdateValues.push(`nomcommun = '${especeoiseau.nomcommun}'`);
    if (especeoiseau.statutspeces.length > 0)
      toUpdateValues.push(`statutspeces = '${especeoiseau.statutspeces}'`);

    if (
      !especeoiseau.nomscientifique ||
      especeoiseau.nomscientifique.length === 0 ||
      toUpdateValues.length === 0
    )
      throw new Error("Invalid especeoiseau update query");

    const query = `UPDATE ornithologue_bd.Especeoiseau SET ${toUpdateValues.join(
      ", "
    )} WHERE nomscientifique = '${especeoiseau.nomscientifique}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteEspeceoiseau(
    nomscientifique: string
  ): Promise<pg.QueryResult> {
    if (nomscientifique.length === 0) throw new Error("Invalid delete query");

    const client = await this.pool.connect();
    const query = `DELETE FROM ornithologue_bd.Especeoiseau WHERE nomscientifique = '${nomscientifique}';`;

    const res = await client.query(query);
    client.release();
    return res;
  }
}
