import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UsermanagementService } from '../services/usermanagement.service';

export interface Prayer {
  name: string;
  contactNo: string;
  address: string;
  request: string;
}

@Component({
  selector: 'app-prayer-request',
  templateUrl: './prayer-request.component.html',
  styleUrls: ['./prayer-request.component.scss']
})
export class PrayerRequestComponent {
  @Input() isVisible: boolean = false;
  @Input() onConfirm!: (data: any) => any;
  @Input() onCancel!: (data: any) => any;
  @Output() confirm = new EventEmitter<any>();
  loading: boolean = false;
  prayer: Prayer = { name: '', contactNo: '',address: '', request: '' };

  constructor(private usermanagementService: UsermanagementService) {}
 
  submitPrayer() {
    let message = '';
    this.loading
    this.usermanagementService.prayerRequest(this.prayer).subscribe((response) => {
     message = 'Thank you for your prayer request. We will keep you in our prayers.';
    this.confirm.emit(message);
    this.loading = false;
    }, (error) => {
      message ='There was an error submitting your prayer request. Please try again later.';
    this.confirm.emit(message);
    this.loading = false;
    });
    this.prayer = { name: '', contactNo: '',address: '', request: '' };
    // Close the modal after successful submission
    this.onConfirm(message);
    
  }
}
