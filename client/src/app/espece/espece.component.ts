import { Component, ElementRef, ViewChild } from "@angular/core";
import { Espece } from "../../../../common/tables/Espece";
import { CommunicationService } from "../communication.service";

@Component({
  selector: "app-espece",
  templateUrl: "./espece.component.html",
  styleUrls: ["./espece.component.css"],
})
export class EspeceComponent {
  @ViewChild("newEspeceNb") newEspeceNb: ElementRef;
  @ViewChild("newEspeceName") newEspeceName: ElementRef;
  @ViewChild("newEspeceCity") newEspeceCity: ElementRef;

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
      especenb: this.newEspeceNb.nativeElement.innerText,
      name: this.newEspeceName.nativeElement.innerText,
      city: this.newEspeceCity.nativeElement.innerText,
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
    this.newEspeceNb.nativeElement.innerText = "";
    this.newEspeceName.nativeElement.innerText = "";
    this.newEspeceCity.nativeElement.innerText = "";
  }

  public deleteEspece(especeNb: string) {
    this.communicationService.deleteEspece(especeNb).subscribe((res: any) => {
      this.refresh();
    });
  }

  public changeEspeceName(event: any, i: number) {
    const editField = event.target.textContent;
    this.especes[i].name = editField;
  }

  public changeEspeceCity(event: any, i: number) {
    const editField = event.target.textContent;
    this.especes[i].city = editField;
  }

  public updateEspece(i: number) {
    this.communicationService
      .updateEspece(this.especes[i])
      .subscribe((res: any) => {
        this.refresh();
      });
  }
}
