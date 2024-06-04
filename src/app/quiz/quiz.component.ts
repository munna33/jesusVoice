import { Component } from '@angular/core';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent {
  subscribeTimer = 0;
  timeLeft: number = 20;
  interval: any;
  // timeLeft = 10;
  constructor() {
    this.startTimer();
  }
  

startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.nextQuestion();
        this.timeLeft = 20;
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
  nextQuestion() {
    alert('next question triggered')
  }
  ngOnDestroy() {
    this.pauseTimer();
  }
}
