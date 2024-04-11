import { Injectable } from "@angular/core";
import { NotificationContent } from "./notification-type";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  notificationState$: Observable<NotificationContent | null>;
  private notificationSubject = new Subject<NotificationContent | null>();

  constructor() {
    this.notificationState$ = this.notificationSubject.asObservable();
  }

  showBanner(content: NotificationContent) {
    console.log("show banner est appeler avec "+ content.message);
    this.notificationSubject.next(content);
  }

  hideBanner() {
    console.log("hide banner est appele");
    this.notificationSubject.next(null);
  }
}
