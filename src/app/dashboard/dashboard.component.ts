import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { ResultService } from '../services/result.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalPopupComponent } from '../modal-popup/modal-popup.component';
import * as CONFIG from '../config/config';

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
  constructor(
    private router: Router,
    private resultService: ResultService,
    private modalService: BsModalService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state) {
      this.userDetails = this.router.getCurrentNavigation()?.extras.state;
    }
  }
  ngOnInit() {
    this.appType = sessionStorage.getItem('appType') as string;
    if(sessionStorage.getItem('user') && sessionStorage.getItem('appType')) {
      this.loader = true;
      let rankDetailsOfSheet:any[] = [];
      if(!sessionStorage.getItem('rankDetails') && !sessionStorage.getItem('yourScoreDetails')) {
        // const sheets  = CONFIG.config.GOOGLE_SHEETS;
        const sheet = this.appType === 'OLD_NEW' ? CONFIG.config.GOOGLE_SHEETS_B5.OLD_NEW : CONFIG.config.GOOGLE_SHEETS_B5.NEW
          this.resultService.getAllScore(sheet).subscribe((data) => {
            this.rankDetails = this.getRanks(data);
            sessionStorage.setItem('rankDetails', JSON.stringify(this.rankDetails))
            this.getYourScore(this.userDetails.RegID);
            this.loader = false;
          });
        // })
          
        // })
       
      } else {
        this.loader = false;
        this.userDetails = JSON.parse(sessionStorage.getItem('user') as string)
        this.scoreDetails = JSON.parse(sessionStorage.getItem('yourScoreDetails') as string)
        this.rankDetails = JSON.parse(sessionStorage.getItem('rankDetails') as string)
      }
     if(!sessionStorage.getItem('totalDays')) {
      this.resultService.getForms().subscribe((data: any) => {
        this.formsData = data;
        this.loader = false;
        this.totlaDays = this.formsData.length;
        sessionStorage.setItem('formData',JSON.stringify(this.formsData));
        sessionStorage.setItem('totalDays', this.totlaDays.toString())
      })
     } else {
      this.loader = false;
      this.totlaDays = parseInt(sessionStorage.getItem('totalDays') as string)
     }
      
    } else {
      this.router.navigateByUrl('/bible-study/login')
    }
   
  }
  formatScoreData(data: any) {
    let result: any[] = [];
    if (data) {
      Object.values(data).forEach((item: any) => {
        result.push({
          name: item.data.fullName,
          yourScore: item.score,
          totalScore: item.score,
          numberOfDays: item.numberOfDays,
          regID: item.registrationID,
          rank: 0,
        });
      });
    }
    return result;
  }
  goToQuiz() {
    this.router.navigateByUrl('/bible-study/quiz');
  }
  getYourScore(id: any) {
    const yourData = this.rankDetails.find(
      (item) => item.registrationID.toUpperCase().trim() === id.toUpperCase().trim()
    );
    this.userDetails = {
      ...this.userDetails,
      rank: yourData?.rank,
      score: yourData?.score,
      totalScore: yourData?.totalScore,
      noOfDays: yourData?.noOfDays,
      totalDays: this.totlaDays,
      lastMonthScore: yourData?.lastMonthScore
    };
    sessionStorage.setItem('user', JSON.stringify(this.userDetails));
    this.scoreDetails = yourData?.data;
   
    this.scoreDetails = this.scoreDetails.sort((a: any, b: any) => {
      let date1 = new Date(a.Date); 
      let date2 = new Date(b.Date); 
      if (date1 > date2) { return 1; } 
      else if (date1 < date2) { return -1; } 
      else { return 0; } 
  }); 
  this.scoreDetails.reverse();
  sessionStorage.setItem('yourScoreDetails', JSON.stringify(yourData?.data))
  }
  getRanks(data: any) {
    let sortArr: any = Object.entries(data).sort((a: any, b: any) => {
      return b[1].score - a[1].score;
    });
    let currentRank = 1;
    let currentScore = sortArr[0][1].score;
    const usersWithRanks = sortArr.map((entry: any, index: any) => {
      const rank =
        currentScore === entry[1].score ? currentRank : currentRank + 1;

      if (currentScore !== entry[1].score) {
        currentRank++;
        currentScore = entry[1].score;
      }
      return (data[entry[0]] = { ...data[entry[0]], rank: rank });
    });
    return Object.values(data).sort((a: any, b: any) =>
      a.rank < b.rank ? -1 : 1
    );
  }
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
  launchFinalQuiz() {
    this.router.navigateByUrl('/bible-study/online-quiz-chapters', {state:{user: this.userDetails, isFinalQuiz: true}})
  }
}
