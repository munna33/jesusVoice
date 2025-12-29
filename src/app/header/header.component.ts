import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isUserLoggedIn: boolean = false;
  constructor(private router: Router) {
    this.isUserLoggedIn = JSON.parse(sessionStorage.getItem('user') as string) ? true : false;
  }
  logout() {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('rankDetails')
    sessionStorage.removeItem('yourScoreDetails')
    sessionStorage.removeItem('totalDays')
    sessionStorage.removeItem('quizChapters')
    sessionStorage.removeItem('appType')
    sessionStorage.removeItem('onlineQuizRanks')
    sessionStorage.removeItem('onlineQuizRanksDetails')
    sessionStorage.removeItem('puzzleRanks')
    sessionStorage.removeItem('onlineFinalQuizRanksDetails')
    sessionStorage.removeItem('quizFinalChapters')
    sessionStorage.removeItem('formData')
    this.router.navigateByUrl('/')
  }
}
