import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { ResultService } from '../services/result.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalPopupComponent } from '../modal-popup/modal-popup.component';
import * as CONFIG from '../config/config';
import { config } from '../config/config';
import { UsermanagementService } from '../services/usermanagement.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {
      provide: CarouselConfig,
      useValue: { interval: false, noPause: false, showIndicators: true },
    },
  ],
})
export class DashboardComponent {
  modalRef: BsModalRef | undefined;  
  showScoreDetails: boolean = false;
  noWrapSlides = false;
  showIndicator = true;
  showQuizDetails = false;
  open: boolean = true;
  disabled: boolean = true;
  userDetails: any = {};
  rankDetails: any[] = [];
  scoreDetails: any[] = [];
  formsData: any[] = [];
  loader: boolean = false;
  totlaDays: number = 0;
  appType: string = '';
  bibleScheduleData: any;
  todaysQuestionData: any;
  selectedAnswer: any;
  showMessage: string = '';
  showQuestion: boolean = false;
  marks: string = '10/10';
  personName: string = this.userDetails?.fullName || 'Participant';
  constructor(
    private router: Router,
    private resultService: ResultService,
    private modalService: BsModalService,
    private userService: UsermanagementService,
     private translate: TranslateService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state) {
      this.userDetails = this.router.getCurrentNavigation()?.extras.state;
    }
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);
  }
  ngOnInit() {
    this.appType = localStorage.getItem('appType') as string;
    this.bibleScheduleData = sessionStorage.getItem('bibleSchedule') ? JSON.parse(sessionStorage.getItem('bibleSchedule') as string) : null;
    
      if(localStorage.getItem('user') && localStorage.getItem('appType')) {
      this.loader = true;
      let rankDetailsOfSheet:any[] = [];
      if(!this.bibleScheduleData) {
        this.loadBibleScheudle();
      }
      // if(!sessionStorage.getItem('rankDetails') && !sessionStorage.getItem('yourScoreDetails')) {
      //   // const sheets  = CONFIG.config.GOOGLE_SHEETS;
      //   const sheet = this.appType === 'OLD_NEW' ? CONFIG.config.GOOGLE_SHEETS_B5.OLD_NEW : CONFIG.config.GOOGLE_SHEETS_B5.NEW
      //     this.resultService.getAllScore(sheet).subscribe((data) => {
      //       this.rankDetails = this.getRanks(data);
      //       sessionStorage.setItem('rankDetails', JSON.stringify(this.rankDetails))
      //       this.getYourScore(this.userDetails.RegID);
      //       this.loader = false;
      //     });
      //   // })
          
      //   // })
       
      // } else {
        this.loader = false;
        this.userDetails = JSON.parse(localStorage.getItem('user') as string)
        this.userService.sendEvent('login', {
        appType: this.appType,
        regID: this.userDetails?.RegID
      })
        // this.scoreDetails = JSON.parse(sessionStorage.getItem('yourScoreDetails') as string)
        // this.rankDetails = JSON.parse(sessionStorage.getItem('rankDetails') as string)
      // }
    //  if(!sessionStorage.getItem('totalDays')) {
    //   this.resultService.getForms().subscribe((data: any) => {
    //     this.formsData = data;
    //     this.loader = false;
    //     this.totlaDays = this.formsData.length;
    //     sessionStorage.setItem('formData',JSON.stringify(this.formsData));
    //     sessionStorage.setItem('totalDays', this.totlaDays.toString())
    //   })
    //  } else {
    //   this.loader = false;
    //   this.totlaDays = parseInt(sessionStorage.getItem('totalDays') as string)
    //  }
      
    } else {
      this.router.navigateByUrl('/bible-study/login')
    }
   
  }
   async loadBibleScheudle() {
    await this.resultService.getBibleSchedule(config.GOOGLE_SHEETS_B6.SCHEDULE).subscribe((data: any) => {
      this.loader = false;
      this.bibleScheduleData = data;
      sessionStorage.setItem('bibleSchedule', JSON.stringify(data));
    });
  }
  // formatScoreData(data: any) {
  //   let result: any[] = [];
  //   if (data) {
  //     Object.values(data).forEach((item: any) => {
  //       result.push({
  //         name: item.data.fullName,
  //         yourScore: item.score,
  //         totalScore: item.score,
  //         numberOfDays: item.numberOfDays,
  //         regID: item.registrationID,
  //         rank: 0,
  //       });
  //     });
  //   }
  //   return result;
  // }
  goToQuiz() {
    this.router.navigateByUrl('/bible-study/quiz');
  }
  // getYourScore(id: any) {
  //   const yourData = this.rankDetails.find(
  //     (item) => item.registrationID.toUpperCase().trim() === id.toUpperCase().trim()
  //   );
  //   this.userDetails = {
  //     ...this.userDetails,
  //     rank: yourData?.rank,
  //     score: yourData?.score,
  //     totalScore: yourData?.totalScore,
  //     noOfDays: yourData?.noOfDays,
  //     totalDays: this.totlaDays,
  //     lastMonthScore: yourData?.lastMonthScore
  //   };
  //   sessionStorage.setItem('user', JSON.stringify(this.userDetails));
  //   this.scoreDetails = yourData?.data;
   
  //   this.scoreDetails = this.scoreDetails.sort((a: any, b: any) => {
  //     let date1 = new Date(a.Date); 
  //     let date2 = new Date(b.Date); 
  //     if (date1 > date2) { return 1; } 
  //     else if (date1 < date2) { return -1; } 
  //     else { return 0; } 
  // }); 
  // this.scoreDetails.reverse();
  // sessionStorage.setItem('yourScoreDetails', JSON.stringify(yourData?.data))
  // }
  // getRanks(data: any) {
  //   let sortArr: any = Object.entries(data).sort((a: any, b: any) => {
  //     return b[1].score - a[1].score;
  //   });
  //   let currentRank = 1;
  //   let currentScore = sortArr[0][1].score;
  //   const usersWithRanks = sortArr.map((entry: any, index: any) => {
  //     const rank =
  //       currentScore === entry[1].score ? currentRank : currentRank + 1;

  //     if (currentScore !== entry[1].score) {
  //       currentRank++;
  //       currentScore = entry[1].score;
  //     }
  //     return (data[entry[0]] = { ...data[entry[0]], rank: rank });
  //   });
  //   return Object.values(data).sort((a: any, b: any) =>
  //     a.rank < b.rank ? -1 : 1
  //   );
  // }
  openModalWithClass(data: any) {
    const config: ModalOptions = {
      initialState: {
          args: {
              title: "Your Submission Details",
              message: "",
              yesFunction: () => {  },
              noFunction: () => {  }
          },
          data,
          formData: this.formsData 
      }
  }
    this.modalRef = this.modalService.show(
      ModalPopupComponent,
      config
    );
    this.modalRef.content.onClose.subscribe((result: any) => {
  })
  }
  gotRanks() {
    this.router.navigateByUrl('/bible-study/leaderBoard', {state:  this.rankDetails})
  }
  getExamResults() {
    const config: ModalOptions = {
      initialState: {
          args: {
              title: "Your Submission Details",
              message: "",
              yesFunction: () => {  },
              noFunction: () => {  }
          },
          // data,
          formData: this.formsData 
      }
  }
  }
  launchOnlineQuiz() {
    this.router.navigateByUrl('/bible-study/online-quiz-chapters', {state:{user: this.userDetails, isFinalQuiz: false} })
  }
  // launchFinalQuiz() {
  //   this.router.navigateByUrl('/bible-study/online-quiz-chapters', {state:{user: this.userDetails, isFinalQuiz: true}})
  // }
  getTodayQuestion() {
     this.router.navigateByUrl('/bible-study/daily-quiz');
    // if(!this.showQuestion) {
    //   this.loader = true;
    //   let quizData: any = {};
    //   if(this.bibleScheduleData) {
    //     const today = new Date()
    //     const yyyy = today.getFullYear();
    //     const mm = String(today.getMonth() + 1).padStart(2, '0');
    //     const dd = String(today.getDate()).padStart(2, '0');
    //     const formattedDate = `${yyyy}-${mm}-${dd}`;
    //     quizData = this.bibleScheduleData.find((item: any) => {
    //       return item.date == formattedDate;
    //     })
    //     this.loadTodayQuestionData(quizData)
    //   } else {
    //     this.loadBibleScheudle();
    //     this.loadTodayQuestionData(quizData);
    //   }
    //   this.showQuestion = true;
    // } else {
    //   this.showQuestion = false;
    // }
    
    // return quizData;
  }
  // loadTodayQuestionData(quizData: any) {
  //   if(quizData) {
  //     this.resultService.getDailyQuizQuestion(quizData.day, CONFIG.config.GOOGLE_SHEETS_B6.DAILY_QUIZ).subscribe((data: any) => {
  //     console.log('quizData', data)
  //     this.loader = false;
  //     this.todaysQuestionData = data;
  //   })
  //  } else {
  //   this.loader = false;
  //   this.showMessage = 'No schedule found';
  //   setTimeout(() => {
  //     this.showMessage = '';
  //   }, 5000);
  //  }
  // }
  // submitAnswer() {
  //   this.loader = true;
  //   const payload = {
  //     regID: this.userDetails.RegID,
  //     answer: this.selectedAnswer,
  //     day: this.todaysQuestionData.Day,
  //     date: this.todaysQuestionData.Date,
  //     marks: this.todaysQuestionData.QType === 'mcq' ? this.todaysQuestionData.Answer == this.selectedAnswer ? 2 : 0 : 0
  //   }
  //   this.resultService.saveDailyQuizQuestion(payload).subscribe((data: any) => {
  //     this.loader = false;
  //     if(data) {
  //       this.showMessage = 'Your answer submitted successfully!';
  //       setTimeout(() => {
  //         this.showMessage = '';
  //         this.todaysQuestionData = {}
  //         this.selectedAnswer = '';
  //       }, 5000);
  //     }
  //   })
  //   // TODO: API call / emit event
  // }

  // isSubmitDisabled(): boolean {
  //   if (this.todaysQuestionData?.QType === 'mcq') {
  //     return !this.selectedAnswer;
  //   }
  //   return !this.selectedAnswer?.trim();
  // }

}
