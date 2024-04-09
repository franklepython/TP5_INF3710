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
    // ex http://localhost:3000/database/espece?especeNb=3&name=LeGrandEspece&city=laval
    router.get("/especes", (req: Request, res: Response, _: NextFunction) => {
      var especeNb = req.params.especeNb ? req.params.especeNb : "";
      var especeName = req.params.name ? req.params.name : "";
      var especeCity = req.params.city ? req.params.city : "";

      this.databaseService
        .filterEspeces(especeNb, especeName, especeCity)
        .then((result: pg.QueryResult) => {
          const especes: Espece[] = result.rows.map((espece: Espece) => ({
            especenb: espece.especenb,
            name: espece.name,
            city: espece.city,
          }));
          res.json(especes);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.get(
      "/especes/especeNb",
      (req: Request, res: Response, _: NextFunction) => {
        this.databaseService
          .getEspeceNamesByNos()
          .then((result: pg.QueryResult) => {
            const especesNbsNames = result.rows.map((espece: EspecePK) => ({
              especenb: espece.especenb,
              name: espece.name,
            }));
            res.json(especesNbsNames);
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
          especenb: req.body.especenb,
          name: req.body.name,
          city: req.body.city,
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
      "/especes/delete/:especeNb",
      (req: Request, res: Response, _: NextFunction) => {
        const especeNb: string = req.params.especeNb;
        this.databaseService
          .deleteEspece(especeNb)
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
          especenb: req.body.especenb,
          name: req.body.name ? req.body.name : "",
          city: req.body.city ? req.body.city : "",
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
      const especeNb = req.query.especeNb ? req.query.especeNb : "";
      const roomNb = req.query.roomNb ? req.query.roomNb : "";
      const roomType = req.query.type ? req.query.type : "";
      const roomPrice = req.query.price
        ? parseFloat(req.query.price as string)
        : -1;

      this.databaseService
        .filterRooms(
          especeNb as string,
          roomNb as string,
          roomType as string,
          roomPrice
        )
        .then((result: pg.QueryResult) => {
          const rooms: Room[] = result.rows.map((room: Room) => ({
            especenb: room.especenb,
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
          especenb: req.body.especenb,
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
          especenb: req.body.especenb,
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
      "/rooms/delete/:especeNb/:roomNb",
      (req: Request, res: Response, _: NextFunction) => {
        const especeNb: string = req.params.especeNb;
        const roomNb: string = req.params.roomNb;

        this.databaseService
          .deleteRoom(especeNb, roomNb)
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
          name: req.body.name,
          gender: req.body.gender,
          city: req.body.city,
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
      "/guests/:especeNb/:roomNb",
      (req: Request, res: Response, _: NextFunction) => {
        const especeNb: string = req.params.especeNb;
        const roomNb: string = req.params.roomNb;

        this.databaseService
          .getGuests(especeNb, roomNb)
          .then((result: pg.QueryResult) => {
            const guests: Guest[] = result.rows.map((guest: any) => ({
              guestnb: guest.guestnb,
              nas: guest.nas,
              name: guest.name,
              gender: guest.gender,
              city: guest.city,
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
      "/tables/:tableName",
      (req: Request, res: Response, next: NextFunction) => {
        this.databaseService
          .getAllFromTable(req.params.tableName)
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
