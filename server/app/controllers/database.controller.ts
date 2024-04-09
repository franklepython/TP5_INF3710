import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as pg from "pg";

import { Espece } from "../../../common/tables/Espece";
import { EspecePK } from "../../../common/tables/EspecePK";
import { Room } from "../../../common/tables/Room";
import { Guest } from "../../../common/tables/Guest";

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
    // ex http://localhost:3000/database/espece?nomScientifique=3&nomCommun=LeGrandEspece&status=laval
    router.get("/especes", (req: Request, res: Response, _: NextFunction) => {
      var nomScientifique = req.params.nomScientifique
        ? req.params.nomScientifique
        : "";
      var especeNomCommun = req.params.nomCommun ? req.params.nomCommun : "";
      var especeStatus = req.params.status ? req.params.status : "";

      this.databaseService
        .filterEspeces(nomScientifique, especeNomCommun, especeStatus)
        .then((result: pg.QueryResult) => {
          const especes: Espece[] = result.rows.map((espece: Espece) => ({
            nomScientifique: espece.nomScientifique,
            nomCommun: espece.nomCommun,
            status: espece.status,
          }));
          res.json(especes);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.get(
      "/especes/nomScientifique",
      (req: Request, res: Response, _: NextFunction) => {
        this.databaseService
          .getEspeceNomCommunsByNos()
          .then((result: pg.QueryResult) => {
            const especesNbsNomCommuns = result.rows.map(
              (espece: EspecePK) => ({
                nomScientifique: espece.nomScientifique,
                nomCommun: espece.nomCommun,
              })
            );
            res.json(especesNbsNomCommuns);
          })

          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    router.post(
      "/especes/insert",
      (req: Request, res: Response, _: NextFunction) => {
        const espece: Espece = {
          nomScientifique: req.body.nomScientifique,
          nomCommun: req.body.nomCommun,
          status: req.body.status,
        };

        this.databaseService
          .createEspece(espece)
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
      "/especes/delete/:nomScientifique",
      (req: Request, res: Response, _: NextFunction) => {
        const nomScientifique: string = req.params.nomScientifique;
        this.databaseService
          .deleteEspece(nomScientifique)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    router.put(
      "/especes/update",
      (req: Request, res: Response, _: NextFunction) => {
        const espece: Espece = {
          nomScientifique: req.body.nomScientifique,
          nomCommun: req.body.nomCommun ? req.body.nomCommun : "",
          status: req.body.status ? req.body.status : "",
        };

        this.databaseService
          .updateEspece(espece)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    // ======= ROOMS ROUTES =======
    router.get("/rooms", (req: Request, res: Response, _: NextFunction) => {
      const nomScientifique = req.query.nomScientifique
        ? req.query.nomScientifique
        : "";
      const roomNb = req.query.roomNb ? req.query.roomNb : "";
      const roomType = req.query.type ? req.query.type : "";
      const roomPrice = req.query.price
        ? parseFloat(req.query.price as string)
        : -1;

      this.databaseService
        .filterRooms(
          nomScientifique as string,
          roomNb as string,
          roomType as string,
          roomPrice
        )
        .then((result: pg.QueryResult) => {
          const rooms: Room[] = result.rows.map((room: Room) => ({
            nomScientifique: room.nomScientifique,
            roomnb: room.roomnb,
            type: room.type,
            price: parseFloat(room.price.toString()),
          }));

          res.json(rooms);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.post(
      "/rooms/insert",
      (req: Request, res: Response, _: NextFunction) => {
        const room: Room = {
          nomScientifique: req.body.nomScientifique,
          roomnb: req.body.roomnb,
          type: req.body.type,
          price: parseFloat(req.body.price),
        };

        this.databaseService
          .createRoom(room)
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
      "/rooms/update",
      (req: Request, res: Response, _: NextFunction) => {
        const room: Room = {
          nomScientifique: req.body.nomScientifique,
          roomnb: req.body.roomnb,
          type: req.body.type,
          price: parseFloat(req.body.price),
        };

        this.databaseService
          .updateRoom(room)
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
      "/rooms/delete/:nomScientifique/:roomNb",
      (req: Request, res: Response, _: NextFunction) => {
        const nomScientifique: string = req.params.nomScientifique;
        const roomNb: string = req.params.roomNb;

        this.databaseService
          .deleteRoom(nomScientifique, roomNb)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
            res.json(-1);
          });
      }
    );

    // ======= GUEST ROUTES =======
    router.post(
      "/guests/insert",
      (req: Request, res: Response, _: NextFunction) => {
        const guest: Guest = {
          guestnb: req.body.guestnb,
          nas: req.body.nas,
          nomCommun: req.body.nomCommun,
          gender: req.body.gender,
          status: req.body.status,
        };

        this.databaseService
          .createGuest(guest)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
            res.json(-1);
          });
      }
    );

    router.get(
      "/guests/:nomScientifique/:roomNb",
      (req: Request, res: Response, _: NextFunction) => {
        const nomScientifique: string = req.params.nomScientifique;
        const roomNb: string = req.params.roomNb;

        this.databaseService
          .getGuests(nomScientifique, roomNb)
          .then((result: pg.QueryResult) => {
            const guests: Guest[] = result.rows.map((guest: any) => ({
              guestnb: guest.guestnb,
              nas: guest.nas,
              nomCommun: guest.nomCommun,
              gender: guest.gender,
              status: guest.status,
            }));
            res.json(guests);
          })
          .catch((e: Error) => {
            console.error(e.stack);
            res.json(-1);
          });
      }
    );

    // ======= GENERAL ROUTES =======
    router.get(
      "/tables/:tableNomCommun",
      (req: Request, res: Response, next: NextFunction) => {
        this.databaseService
          .getAllFromTable(req.params.tableNomCommun)
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
