import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CommunicationService } from "./communication.service";
import { EspeceoiseauComponent } from "./especeoiseau/especeoiseau.component";
import { NotificationService } from "./notifications/notification.service";
import { NotificationBannerComponent } from './notificationBanner/notification-banner/notification-banner.component';

@NgModule({
  declarations: [AppComponent, EspeceoiseauComponent, NotificationBannerComponent],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [CommunicationService, NotificationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
