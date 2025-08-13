import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bible-study-ui';
  appType: string = ''
  constructor() {
    this.appType = sessionStorage.getItem('appType')as string;
  }
}
