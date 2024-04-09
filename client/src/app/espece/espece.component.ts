import { Component, ElementRef, ViewChild } from "@angular/core";
import { Espece } from "../../../../common/tables/Espece";
import { CommunicationService } from "../communication.service";

@Component({
  selector: "app-espece",
  templateUrl: "./espece.component.html",
  styleUrls: ["./espece.component.css"],
})
export class EspeceComponent {
  @ViewChild("newNomScientifique") newNomScientifique: ElementRef;
  @ViewChild("newEspeceNomCommun") newEspeceNomCommun: ElementRef;
  @ViewChild("newEspeceStatus") newEspeceStatus: ElementRef;

  public especes: Espece[] = [];
  public duplicateError: boolean = false;

  public constructor(private communicationService: CommunicationService) {}

  public ngOnInit(): void {
    this.getEspeces();
  }

  public getEspeces(): void {
    this.communicationService.getEspeces().subscribe((especes: Espece[]) => {
      this.especes = especes;
    });
  }

  public insertEspece(): void {
    const espece: any = {
      nomScientifique: this.newNomScientifique.nativeElement.innerText,
      nomCommun: this.newEspeceNomCommun.nativeElement.innerText,
      status: this.newEspeceStatus.nativeElement.innerText,
    };

    this.communicationService.insertEspece(espece).subscribe((res: number) => {
      if (res > 0) {
        this.communicationService.filter("update");
      }
      this.refresh();
      this.duplicateError = res === -1;
    });
  }

  private refresh() {
    this.getEspeces();
    this.newNomScientifique.nativeElement.innerText = "";
    this.newEspeceNomCommun.nativeElement.innerText = "";
    this.newEspeceStatus.nativeElement.innerText = "";
  }

  public deleteEspece(nomScientifique: string) {
    this.communicationService
      .deleteEspece(nomScientifique)
      .subscribe((res: any) => {
        this.refresh();
      });
  }

  public changeEspeceNomCommun(event: any, i: number) {
    const editField = event.target.textContent;
    this.especes[i].nomCommun = editField;
  }

  public changeEspeceStatus(event: any, i: number) {
    const editField = event.target.textContent;
    this.especes[i].status = editField;
  }

  public updateEspece(i: number) {
    this.communicationService
      .updateEspece(this.especes[i])
      .subscribe((res: any) => {
        this.refresh();
      });
  }
}
