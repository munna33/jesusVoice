import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-managment',
  templateUrl: './quiz-managment.component.html',
  styleUrls: ['./quiz-managment.component.scss']
})
export class QuizManagmentComponent {
  showAddQuiz: boolean =false;
  constructor() {

  }

  addQuiz() {
    this.showAddQuiz = true;
  }
}
