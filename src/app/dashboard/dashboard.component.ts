import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { ResultService } from '../services/result.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalPopupComponent } from '../modal-popup/modal-popup.component';

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
  open: boolean = true;
  disabled: boolean = true;
  userDetails: any = {};
  rankDetails: any[] = [];
  scoreDetails: any[] = [];
  formsData: any[] = [];
  loader: boolean = false;
  constructor(
    private router: Router,
    private resultService: ResultService,
    private modalService: BsModalService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state) {
      this.userDetails = this.router.getCurrentNavigation()?.extras.state;
      console.log('user', this.userDetails);
    }
  }
  ngOnInit() {
    this.loader = true;
    this.resultService.getAllScore().subscribe((data) => {
      // this.rankDetails = this.formatScoreData(data)
      this.rankDetails = this.getRanks(data);
      this.getYourScore(this.userDetails.RegID);
      this.loader = false;
    });
    this.resultService.getForms().subscribe((data: any) => {
      this.formsData = data;
      console.log('forms data', this.formsData)
      this.loader = false;
    })
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
    this.router.navigateByUrl('/quiz');
  }
  getYourScore(id: any) {
    const yourData = this.rankDetails.find(
      (item) => item.registrationID === id
    );
    this.userDetails = {
      ...this.userDetails,
      rank: yourData.rank,
      score: yourData.score,
      totalScore: yourData.totalScore,
      noOfDays: yourData.data.length,
      totalDays: yourData.noOfDays,
    };
    sessionStorage.setItem('user', JSON.stringify(this.userDetails));
    this.scoreDetails = yourData.data;
    console.log(this.scoreDetails);
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
    console.log('rank data', data);
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
      console.log('results', result);
  })
  }
  gotRanks() {
    this.router.navigateByUrl('/ranks', {state:  this.rankDetails})
  }
}
