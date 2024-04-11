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

  public constructor(
    private communicationService: CommunicationService,
    private notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    this.getEspeceoiseaus();
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
      nomcommun: this.newEspeceoiseauNomcommun.nativeElement.innerText,
      statutspeces: this.newEspeceoiseauStatutspeces.nativeElement.innerText,
      nomscientifiquecomsommer:
        this.newNomscientifiquecomsommer.nativeElement.innerText || null,
    };

    this.communicationService.insertEspeceoiseau(especeoiseau).subscribe({
      next: (res: number) => {
        if (res > 0) {
          this.communicationService.filter("update");
          this.notificationService.showBanner(
            new NotificationContent(
              especeoiseau.nomscientifique + "a ete ajoute",
              NotificationType.Success,
              4000
            )
          );
          this.refresh();
        } else if (res === -1) {
          let erreur: string = "Attention!";
          if (especeoiseau.nomscientifique === "") {
            erreur = erreur.concat(", nomscientifique est vide");
          }
          if (especeoiseau.nomcommun === "") {
            erreur = erreur.concat(", nomcommun est vide");
          }
          if (especeoiseau.statutspeces === "") {
            erreur = erreur.concat(", statut est vide");
          }

          const existeDeja: boolean = this.especeoiseaux.some(
            (e) => e.nomscientifique === especeoiseau.nomscientifique
          );
          if (existeDeja) {
            erreur = erreur.concat(", le nom scientifique est deja utiliser");
          }

          if (erreur === "Attention!") {
            erreur = erreur.concat(", le serveur a echouer");
          }
          this.notificationService.showBanner(
            new NotificationContent(erreur, NotificationType.Error, 4000)
          );
        }
      },
    });
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
            (espece) =>
              espece.nomscientifiquecomsommer === nomscientifique
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
    this.communicationService
      .updateEspeceoiseau(this.especeoiseaux[i])
      .subscribe({
        next: (res: number) => {
         if (res>0) {
        this.notificationService.showBanner(
          new NotificationContent(
            "Modification faite avec succes!",
            NotificationType.Success,
            4000
          )
        );
        this.refresh();
      } if (res===-1) {
      this.notificationService.showBanner(
      new NotificationContent(
        "Erreur serveur lors de la modification de l'espèce.",
        NotificationType.Error,
        4000
      )
    );
      }}}
  )};
  }
