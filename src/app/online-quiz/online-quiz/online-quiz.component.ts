import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { NavigationStart, Router } from '@angular/router';
import { ResultService } from 'src/app/services/result.service';
import { config } from 'src/app/config/config';
@Component({
  selector: 'app-online-quiz',
  templateUrl: './online-quiz.component.html',
  styleUrls: ['./online-quiz.component.scss']
})
export class OnlineQuizComponent implements OnInit{
  showQuizDetails: boolean = false;
  confirmYourDetails: boolean = false;
  currentQuestionIndex = 0;
  timeLeft = 40;
  interval: any;
  score = 0;
  selectedAnswer: string = '';
  quizCompleted = false;
  // QUIZSHEET_ID = '1f9IKPjRL2MzrGmrPqpsvB7YM2rCjirIdZUaFtYeByAY';
  QUIZRESULT_ID = '';
  // QUIZTRACK_ID = '1_mMJYRdtu2YAaRrl699eeCBBA_CSDrJjX4S6gcXoEMY';
  userDetails: any = {};
  questionData: any = [];
  chapterName: string = '';
  yourAnswers: any = [];
  message: string ='';
  isQuizStarted: boolean = false;
  loader: boolean = false;
  finalResult: any={};
  questionNumber = 1;
  userTrackingData: any;
  trackID: string = '';
constructor(private _location: Location, 
  private router: Router,
  private resultService: ResultService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.questionData = navigation.extras.state['quizData'];
      this.userDetails = navigation.extras.state['user'];
      this.chapterName = navigation.extras.state['chapterName']
    }
   
}


ngOnInit() {
  this.trackID = sessionStorage.getItem('appType') === 'OLD_NEW' ? config.GOOGLE_SHEETS_B5.ONLINE_QUIZ_TRACKING.OLD_NEW :  config.GOOGLE_SHEETS_B5.ONLINE_QUIZ_TRACKING.NEW 
  this.QUIZRESULT_ID = sessionStorage.getItem('appType') === 'OLD_NEW' ? config.GOOGLE_SHEETS_B5.ONLINE_QUIZ_RESULTS.OLD_NEW :  config.GOOGLE_SHEETS_B5.ONLINE_QUIZ_RESULTS.NEW 
 
  window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
      // alert('Back navigation is disabled');
      // this.submitQuiz();
    };
  this.resultService.getTrackingDetails(this.trackID).subscribe(data => {
    if(data){
      this.userTrackingData = data;
    }
  })
}
startTimer(chapterName: any) {
  const req = {
   "Registration ID": this.userDetails?.RegID,
    "Name": this.userDetails?.Name,
    "Quiz ID": chapterName,
    "Attempted": true,
    "Date": new Date()
  }
  this.resultService.trackSubmit(this.trackID, req).subscribe(data => {
    console.log('tracked successfully')
  })
  this.interval = setInterval(() => {
    if (this.timeLeft > 0) {
      this.timeLeft--;
    } else {
      this.nextQuestion();
    }
  }, 1000);
}
isUserSubmitted(chapterName: string) {
  if(this.userTrackingData && this.userTrackingData[chapterName] && this.userTrackingData[chapterName].filter((item: any) => item['Registration ID'] == this.userDetails?.RegID).length > 0) {
    return true;
  }
  return false;
}
selectAnswer(option: string, question: any) {
  let selectedAnswer = {QNO: question?.QNO, yourAnswer: option, correctAnswer: question?.Answer};
  if(this.yourAnswers.length > 0) {
    this.updateYourAnswers(question, selectedAnswer);
  } else {
    this.yourAnswers.push(selectedAnswer);
  }

  this.selectedAnswer = option;
}
updateYourAnswers(question: any, selectedAnswer: any) {
    let matchCount = this.yourAnswers.filter((item:any) => item?.QNO == question?.QNO);
    if(matchCount.length > 0) {
      this.yourAnswers = this.yourAnswers.map((item: any) => {
        if(item?.QNO == question?.QNO) {
          return {
            ...item,
            yourAnswer: selectedAnswer.yourAnswer
          }
        } else {
          return item
        }
      })
    } else {
      this.yourAnswers = [...this.yourAnswers, selectedAnswer]
    }
    
}
nextQuestion() {
  this.questionNumber++;
  if (this.selectedAnswer?.trim() === this.questionData[this.currentQuestionIndex].Answer?.trim()) {
    this.score++;
  }
  this.selectedAnswer = '';
  this.timeLeft = 40;
  this.currentQuestionIndex++;
  if (this.currentQuestionIndex >= this.questionData.length) {
    clearInterval(this.interval);
    this.loader = true;
    this.submitQuiz();
   
  }
}
submitQuiz() {
  const requestObj = this.prepareTheResult();
  this.resultService.submitQuiz(this.QUIZRESULT_ID, requestObj).subscribe((data: any) => {
    if(data) {
      this.message = data?.message;
    }
    this.loader= false;
    let sessionQuestionData = sessionStorage.getItem('quizChapters') ? JSON.parse(sessionStorage.getItem('quizChapters') as any) : '';
    if(sessionQuestionData && sessionQuestionData.hasOwnProperty(this.chapterName)) {
      sessionQuestionData[this.chapterName]["Your Score"] = this.score;
      sessionQuestionData[this.chapterName]["Total Score"] = this.questionData.length;
    }
    sessionStorage.setItem('quizChapters', JSON.stringify(sessionQuestionData))
    sessionStorage.removeItem('quizChapters');
  })
  this.quizCompleted = true;
  this.isQuizStarted = false;
  this.questionNumber = 0;
}
getOptions(question: any) {
  // console.log(question.Options.split(','))
  return question.Options.split(',');
}
goToDashboard() {
  // this._location.back();
  this.router.navigateByUrl('/dashboard')
}
getYourAnswer(qno: any) {
  return this.yourAnswers.find((item:any) => item.QNO == qno)?.yourAnswer;
}
prepareTheResult() {
  let requestObj: any = {
    "Registration ID": this.userDetails?.RegID,
    "Name": this.userDetails?.Name,
    "Quiz ID": this.chapterName,
    "Your Score": this.score,
    "Total Score": this.questionData.length
  }
  this.questionData.forEach((item: any) => {
    requestObj[item.QNO] = item.QNO +':'+ this.getYourAnswer(item.QNO)
  })
  this.finalResult = requestObj;
  return requestObj;
}

sendMessage() {
  // const phoneNumber = '91'+this.userDetails?.Contact; // Use international format without '+'
  // console.log('phoneNumber', phoneNumber)
  // const message = encodeURIComponent(this.finalResult);
  // const url = `https://wa.me/${phoneNumber}?text=${message}`;
  
  // window.open(url, '_blank');
}
}
