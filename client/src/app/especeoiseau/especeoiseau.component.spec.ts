import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EspeceoiseauComponent } from "./especeoiseau.component";
import { NotificationService } from "../notifications/notification.service";

describe("EspeceoiseauComponent", () => {
  let component: EspeceoiseauComponent;
  let fixture: ComponentFixture<EspeceoiseauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EspeceoiseauComponent],
      providers: [NotificationService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspeceoiseauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
