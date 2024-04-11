import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as pg from "pg";

import { Especeoiseau } from "../../../common/tables/Especeoiseau";
import { EspeceoiseauPK } from "../../../common/tables/EspeceoiseauPK";

import { DatabaseService } from "../services/database.service";
import Types from "../types";

@injectable()
export class DatabaseController {
  public constructor(
    @inject(Types.DatabaseService) private databaseService: DatabaseService
  ) {}

  public get router(): Router {
    const router: Router = Router();

    // ======= HOTEL ROUTES =======
    // ex http://localhost:3000/database/especeoiseau?nomscientifique=3&nomcommun=LeGrandEspeceoiseau&statutspeces=laval
    router.get(
      "/especeoiseaux",
      (req: Request, res: Response, _: NextFunction) => {
        var nomscientifique = req.params.nomscientifique
          ? req.params.nomscientifique
          : "";
        var especeoiseauNomcommun = req.params.nomcommun
          ? req.params.nomcommun
          : "";
        var especeoiseauStatutspeces = req.params.statutspeces
          ? req.params.statutspeces
          : "";
        var nomscientifiquecomsommer = req.query.nomscientifiquecomsommer
          ? req.query.nomscientifiquecomsommer.toString()
          : "";

        this.databaseService
          .filterEspeceoiseaus(
            nomscientifique,
            especeoiseauNomcommun,
            especeoiseauStatutspeces,
            nomscientifiquecomsommer
          )
          .then((result: pg.QueryResult) => {
            const especeoiseaux: Especeoiseau[] = result.rows.map(
              (especeoiseau: Especeoiseau) => ({
                nomscientifique: especeoiseau.nomscientifique,
                nomcommun: especeoiseau.nomcommun,
                statutspeces: especeoiseau.statutspeces,
                nomscientifiquecomsommer: especeoiseau.nomscientifiquecomsommer,
              })
            );
            res.json(especeoiseaux);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    router.get(
      "/especeoiseaux/nomscientifique",
      (req: Request, res: Response, _: NextFunction) => {
        this.databaseService
          .getEspeceoiseauNomcommunsByNos()
          .then((result: pg.QueryResult) => {
            const especeoiseauxNbsNomcommuns = result.rows.map(
              (especeoiseau: EspeceoiseauPK) => ({
                nomscientifique: especeoiseau.nomscientifique,
                nomcommun: especeoiseau.nomcommun,
              })
            );
            res.json(especeoiseauxNbsNomcommuns);
          })

          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    router.post(
      "/especeoiseaux/insert",
      (req: Request, res: Response, _: NextFunction) => {
        const especeoiseau: Especeoiseau = {
          nomscientifique: req.body.nomscientifique,
          nomcommun: req.body.nomcommun,
          statutspeces: req.body.statutspeces,
          nomscientifiquecomsommer: req.body.nomscientifiquecomsommer || null,
        };

        this.databaseService
          .createEspeceoiseau(especeoiseau)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
            res.json(-1);
          });
      }
    );

    router.post(
      "/especeoiseaux/delete/:nomscientifique",
      (req: Request, res: Response, _: NextFunction) => {
        const nomscientifique: string = req.params.nomscientifique;
        this.databaseService
          .deleteEspeceoiseau(nomscientifique)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
            res.json(-1);
          });
      }
    );

    router.put(
      "/especeoiseaux/update",
      (req: Request, res: Response, _: NextFunction) => {
        const especeoiseau: Especeoiseau = {
          nomscientifique: req.body.nomscientifique,
          nomcommun: req.body.nomcommun ? req.body.nomcommun : "",
          statutspeces: req.body.statutspeces ? req.body.statutspeces : "",
          nomscientifiquecomsommer: req.body.nomscientifiquecomsommer || null,
        };

        this.databaseService
          .updateEspeceoiseau(especeoiseau)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    // ======= GENERAL ROUTES =======
    router.get(
      "/tables/:tableNomcommun",
      (req: Request, res: Response, next: NextFunction) => {
        this.databaseService
          .getAllFromTable(req.params.tableNomcommun)
          .then((result: pg.QueryResult) => {
            res.json(result.rows);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    return router;
  }
}
