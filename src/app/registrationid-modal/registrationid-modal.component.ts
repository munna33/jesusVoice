import { Component } from '@angular/core';
import { UsermanagementService } from '../services/usermanagement.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { config } from '../config/config';

@Component({
  selector: 'app-registrationid-modal',
  templateUrl: './registrationid-modal.component.html',
  styleUrls: ['./registrationid-modal.component.scss'],
})
export class RegistrationidModalComponent {
  mobileNumber: string = '';
  registrationID: string = '';
  users: any = [];
  errorMessage: string = '';
  whatsAppLink = config.WHATSAP_GROUP_LINK ;;
  loader = false;
  constructor(private usermanagementService: UsermanagementService, private _bsModalRef: BsModalRef) {
     this.whatsAppLink = atob(this.whatsAppLink);
  }
  getRegistrationID() {
    this.loader = true;
    // Logic to get registration ID based on mobile number
    // const encodedUrl = btoa(this.whatsAppLink);
   
    this.usermanagementService.getRegistrationID(this.mobileNumber).subscribe(
      (response: any) => {
        if(response && response.users) {
          this.users = response.users;
        }
        // Handle the response, e.g., show the registration ID to the user
        this.registrationID = this.users.registrationID;
        this.errorMessage = '';
        this.loader = false;
      },
      (error) => {
        // Handle error
        this.errorMessage =
          'Could not find registration ID for the provided mobile number.';
        this.registrationID = '';
        this.loader = false;
      }
    );
  }
  copyLink(regID: string) {
    navigator.clipboard.writeText(regID).then(() => alert('Link copied!'));
  }
  closeModal() {
   this._bsModalRef.hide();
  }
}
