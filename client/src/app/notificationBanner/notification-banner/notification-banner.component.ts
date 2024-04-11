import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationContent } from 'src/app/notifications/notification-type';
import { NotificationService } from 'src/app/notifications/notification.service';

@Component({
  selector: 'app-notification-banner',
  template: `
    <div *ngIf="notification" class="notification-banner">
      {{ notification.message }}
    </div>
  `,
  styleUrls: ['./notification-banner.component.css']
})
export class NotificationBannerComponent implements OnDestroy {
  notification: NotificationContent | null = null;
  private subscription: Subscription;
  private hideTimeout: any;

  constructor(private notificationService: NotificationService) {
    this.subscription = this.notificationService.notificationState$.subscribe(
      (notification) => {
        // Clear any existing timeout to ensure we don't have multiple
        clearTimeout(this.hideTimeout);

        this.notification = notification;

        if (notification && notification.durationMs) {
          // Set a timeout to hide the banner after the duration
          this.hideTimeout = setTimeout(() => this.hideBanner(), notification.durationMs);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    clearTimeout(this.hideTimeout);
  }

  hideBanner() {
    this.notification = null; // This effectively hides the banner
  }
}