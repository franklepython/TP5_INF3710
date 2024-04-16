import { Component, ElementRef, ViewChild } from "@angular/core";
import { Especeoiseau } from "../../../../common/tables/Especeoiseau";
import { CommunicationService } from "../communication.service";
import { NotificationService } from "../notifications/notification.service";
import {
  NotificationContent,
  NotificationType,
} from "../notifications/notification-type";

@Component({
  selector: "app-especeoiseau",
  templateUrl: "./especeoiseau.component.html",
  styleUrls: ["./especeoiseau.component.css"],
})
export class EspeceoiseauComponent {
  @ViewChild("newNomscientifique") newNomscientifique: ElementRef;
  @ViewChild("newEspeceoiseauNomcommun") newEspeceoiseauNomcommun: ElementRef;
  @ViewChild("newEspeceoiseauStatutspeces")
  newEspeceoiseauStatutspeces: ElementRef;
  @ViewChild("newNomscientifiquecomsommer")
  newNomscientifiquecomsommer: ElementRef;

  public especeoiseaux: Especeoiseau[] = [];
  public duplicateError: boolean = false;
  public availablePredators: Especeoiseau[] = [];

  public constructor(
    private communicationService: CommunicationService,
    private notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    this.getEspeceoiseaus();
    this.getAvailablePredators();
  }

  public getEspeceoiseaus(): void {
    this.communicationService
      .getEspeceoiseaus()
      .subscribe((especeoiseaux: Especeoiseau[]) => {
        this.especeoiseaux = especeoiseaux;
        if (especeoiseaux && especeoiseaux.length > 0) {
          this.especeoiseaux = especeoiseaux;
        } else if (especeoiseaux && especeoiseaux.length === 0) {
          this.especeoiseaux = especeoiseaux;
          this.notificationService.showBanner(
            new NotificationContent(
              "Pas de panique la BD est vide",
              NotificationType.Success,
              4000
            )
          );
        } else {
          this.notificationService.showBanner(
            new NotificationContent(
              "Erreur dans le GET pour les especes",
              NotificationType.Error,
              4000
            )
          );
        }
      });
  }

  public insertEspeceoiseau(): void {
    const especeoiseau: any = {
      nomscientifique: this.newNomscientifique.nativeElement.innerText,
      nomcommun: this.newEspeceoiseauNomcommun.nativeElement.innerText || null,
      statutspeces:
        this.newEspeceoiseauStatutspeces.nativeElement.innerText || null,
      nomscientifiquecomsommer:
        this.newNomscientifiquecomsommer.nativeElement.innerText || null,
    };
    if (especeoiseau.nomscientifiquecomsommer !== null) {
      if (
        especeoiseau.nomscientifiquecomsommer!.trim() === "NULL" ||
        especeoiseau.nomscientifiquecomsommer!.trim() === ""
      ) {
        especeoiseau.nomscientifiquecomsommer = null;
      }
    }
    if (this.isValidPredator(especeoiseau.nomscientifiquecomsommer!)) {
      this.communicationService.insertEspeceoiseau(especeoiseau).subscribe({
        next: (res: number) => {
          if (res > 0) {
            this.communicationService.filter("update");
            this.notificationService.showBanner(
              new NotificationContent(
                especeoiseau.nomscientifique + " a été ajouté(e)",
                NotificationType.Success,
                4000
              )
            );
            this.refresh();
          } else if (res === -1) {
            let erreur: string = "Erreur!";
            if (especeoiseau.nomscientifique === "") {
              erreur = erreur.concat(", le nom scientifique est vide");
            }

            const existeDeja: boolean = this.especeoiseaux.some(
              (e) => e.nomscientifique === especeoiseau.nomscientifique
            );
            if (existeDeja) {
              erreur = erreur.concat(", le nom scientifique est déjà utilisé");
            }

            if (erreur === "Attention!") {
              erreur = erreur.concat(", le serveur a échoué");
            }
            this.notificationService.showBanner(
              new NotificationContent(erreur, NotificationType.Error, 4000)
            );
          }
        },
      });
    }
  }

  public isValidPredator(nomscientifiquecomsommer: string | null): boolean {
    if (nomscientifiquecomsommer === null) {
      return true;
    }
    this.getAvailablePredators();
    const isValidPred = this.especeoiseaux.some(
      (espece) => espece.nomscientifique === nomscientifiquecomsommer
    );
    if (isValidPred) {
      return true;
    } else {
      this.notificationService.showBanner(
        new NotificationContent(
          "Le prédateur " +
            nomscientifiquecomsommer +
            " ne fait pas parti des especes documentées",
          NotificationType.Error,
          4000
        )
      );
      return false;
    }
  }

  private refresh() {
    this.getEspeceoiseaus();
    this.newNomscientifique.nativeElement.innerText = "";
    this.newEspeceoiseauNomcommun.nativeElement.innerText = "";
    this.newEspeceoiseauStatutspeces.nativeElement.innerText = "";
    this.newNomscientifiquecomsommer.nativeElement.innerText = "";
  }

  public deleteEspeceoiseau(nomscientifique: string) {
    this.communicationService.deleteEspeceoiseau(nomscientifique).subscribe({
      next: (res: number) => {
        if (res > 0) {
          this.refresh();
        } else {
          const isPredator = this.especeoiseaux.some(
            (espece) => espece.nomscientifiquecomsommer === nomscientifique
          );

          if (isPredator) {
            this.notificationService.showBanner(
              new NotificationContent(
                "Suppression impossible: l'espèce est un prédateur.",
                NotificationType.Error,
                4000
              )
            );
          } else {
            this.notificationService.showBanner(
              new NotificationContent(
                "Erreur serveur lors de la suppression de l'espèce.",
                NotificationType.Error,
                4000
              )
            );
          }
        }
      },
    });
  }

  public changeEspeceoiseauNomcommun(event: any, i: number) {
    const editField = event.target.textContent;
    this.especeoiseaux[i].nomcommun = editField;
  }

  public changeEspeceoiseauStatutspeces(event: any, i: number) {
    const editField = event.target.textContent;
    this.especeoiseaux[i].statutspeces = editField;
  }

  public changeNomscientifiquecomsommer(event: any, i: number) {
    const editField = event.target.textContent;
    this.especeoiseaux[i].nomscientifiquecomsommer = editField;
  }

  public updateEspeceoiseau(i: number) {
    if (this.especeoiseaux[i].nomscientifiquecomsommer !== null) {
      if (
        this.especeoiseaux[i].nomscientifiquecomsommer!.trim() === "NULL" ||
        this.especeoiseaux[i].nomscientifiquecomsommer!.trim() === ""
      ) {
        this.especeoiseaux[i].nomscientifiquecomsommer = null;
      }
    }
    if (this.isValidPredator(this.especeoiseaux[i].nomscientifiquecomsommer!)) {
      this.communicationService
        .updateEspeceoiseau(this.especeoiseaux[i])
        .subscribe({
          next: (res: number) => {
            if (res > 0) {
              this.notificationService.showBanner(
                new NotificationContent(
                  "Modification faite avec succes!",
                  NotificationType.Success,
                  4000
                )
              );
              this.refresh();
            }
            if (res === -1) {
              this.notificationService.showBanner(
                new NotificationContent('Erreur de modification dans le serveur', NotificationType.Error, 4000)
              );
            }
          },
        });
    }
  }

  private getAvailablePredators(): void {
    this.communicationService
      .getEspeceoiseauPKs()
      .subscribe((predators: Especeoiseau[]) => {
        this.availablePredators = predators;
      });
  }
}
