import { Component } from '@angular/core';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent {
  quizFor: string = '';
  question: string ='';
  options: string='';
  answer: string='';
  marks: number=0;
  questionNumber: number = 1;
  questionList: any[] = [];
  addQuestion() {
    const questionObj = {
      number: this.questionNumber,
      question: this.question,
      options: this.options,
      answer: this.answer,
      marks: this.marks
    }
    if(this.questionList.length >= 0 && this.questionList.length <= 5) {
      this.questionList.push(questionObj)
      this.question = this.options = this.answer = '';
      this.questionNumber = this.questionNumber + 1;
      this.marks = 0;
    }
  }
  submit() {

  }
}
