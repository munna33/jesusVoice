import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ResultService } from '../services/result.service';
import { config } from '../config/config';
@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.scss']
})
export class ModalPopupComponent {
  public onClose = new Subject();
  @Input() title: string  = 'Your Submission Details';
  @Input() data: any;
  @Input() formData: any;
  questionData: any;
  appType: any = '';
  loader: boolean = false;
  communityURL: string ='https://www.youtube.com/@voiceofjesusbec/community';

  constructor(private _bsModalRef: BsModalRef, private resultService: ResultService) { }

  public ngOnInit(): void {
    this.appType = localStorage.getItem('appType') as string;
  }

  public onConfirm(): void {
      this.onClose.next(true);
      this._bsModalRef.hide();
  }

  public onCancel(): void {
      this.onClose.next(false);
      this._bsModalRef.hide();
  }
  getQuestion(dayData: any) {
    this.loader = true;
    this.resultService.getDailyQuizQuestion(dayData?.Day, config.GOOGLE_SHEETS_B6.DAILY_QUIZ).subscribe((res: any) => {
      this.loader = false;
      if(res) {
        this.questionData = res;
      }
    })
    // if(!this.formData || this.formData?.length == 0) {
    //   this.formData = sessionStorage.getItem('formData') ? JSON.parse(sessionStorage.getItem('formData') || '') : this.formData
    // }
    // const docName = this.appType === 'OLD_NEW' ? 'BS5ON_'+this.data.Day : 'BS5N_'+this.data.Day;
    // const id = this.formData.find((item : any) => item.name === docName )?.id
    // this.resultService.getQuestion(id).subscribe(data => {
    //   this.loader = false;
    //   if(data) {
    //     this.questionData = data;
    //   } 
    // })

  }
  
}
