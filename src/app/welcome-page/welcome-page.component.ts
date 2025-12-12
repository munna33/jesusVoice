import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {

  constructor(private router: Router) {

  }
  launchApp(appType: string) {
    sessionStorage.setItem('appType', appType);
    this.router.navigateByUrl('/bible-study/login');
  }
}
