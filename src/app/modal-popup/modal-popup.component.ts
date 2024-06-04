import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ResultService } from '../services/result.service';
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

  constructor(private _bsModalRef: BsModalRef, private resultService: ResultService) { }

  public ngOnInit(): void {
  }

  public onConfirm(): void {
      this.onClose.next(true);
      this._bsModalRef.hide();
  }

  public onCancel(): void {
      this.onClose.next(false);
      this._bsModalRef.hide();
  }
  getQuestion() {
    const id = this.formData.find((item : any) => item.name === 'BS180_'+this.data.Day )?.id
    console.log('id',id)
    this.resultService.getQuestion(id).subscribe(data => {
      if(data) {
        this.questionData = data;
      } 
    })
  }
}
