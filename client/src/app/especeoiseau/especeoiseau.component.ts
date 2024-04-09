import { Component, ElementRef, ViewChild } from "@angular/core";
import { Especeoiseau } from "../../../../common/tables/Especeoiseau";
import { CommunicationService } from "../communication.service";

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

  public especeoiseaux: Especeoiseau[] = [];
  public duplicateError: boolean = false;

  public constructor(private communicationService: CommunicationService) {}

  public ngOnInit(): void {
    this.getEspeceoiseaus();
  }

  public getEspeceoiseaus(): void {
    this.communicationService
      .getEspeceoiseaus()
      .subscribe((especeoiseaux: Especeoiseau[]) => {
        this.especeoiseaux = especeoiseaux;
      });
  }

  public insertEspeceoiseau(): void {
    const especeoiseau: any = {
      nomscientifique: this.newNomscientifique.nativeElement.innerText,
      nomcommun: this.newEspeceoiseauNomcommun.nativeElement.innerText,
      statutspeces: this.newEspeceoiseauStatutspeces.nativeElement.innerText,
    };

    this.communicationService
      .insertEspeceoiseau(especeoiseau)
      .subscribe((res: number) => {
        if (res > 0) {
          this.communicationService.filter("update");
        }
        this.refresh();
        this.duplicateError = res === -1;
      });
  }

  private refresh() {
    this.getEspeceoiseaus();
    this.newNomscientifique.nativeElement.innerText = "";
    this.newEspeceoiseauNomcommun.nativeElement.innerText = "";
    this.newEspeceoiseauStatutspeces.nativeElement.innerText = "";
  }

  public deleteEspeceoiseau(nomscientifique: string) {
    this.communicationService
      .deleteEspeceoiseau(nomscientifique)
      .subscribe((res: any) => {
        this.refresh();
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

  public updateEspeceoiseau(i: number) {
    this.communicationService
      .updateEspeceoiseau(this.especeoiseaux[i])
      .subscribe((res: any) => {
        this.refresh();
      });
  }
}
