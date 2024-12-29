import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationHistoryService {

    private previousUrl: string | null = null;
    private currentUrl: string | null = null;

    constructor(private router: Router) {
      // Initialize `currentUrl` with the current route on service instantiation
      this.currentUrl = this.router.url;

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // Set `previousUrl` to the current URL before updating `currentUrl`
          this.previousUrl = this.currentUrl;
          this.currentUrl = event.urlAfterRedirects;
        }
      });
    }

    public getPreviousUrl(): string | null {
      return this.previousUrl;
    }

}
