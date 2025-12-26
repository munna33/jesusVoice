import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsermanagementService } from '../services/usermanagement.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent {
  fullName: string = '';
  churchName: string = '';
  contactNo: string = '';
  address: string = '';
  occupation: string = '';
  invitation: string = '';
  participationStatus: string = '';
  registrationID: string = '';
  personName: string = '';
  @ViewChild('registerForm') registerForm!: NgForm;
  loader = false;
  isUserRegistered = false;
  whatsAppLink = 'https://chat.whatsapp.com/GO1dX2F6CCK4QNfK9Xwlsh';
  constructor(private service: UsermanagementService) { }

  register(form: NgForm) {
    if (form.invalid) {
      // mark controls as touched to show validation messages
      form.control.markAllAsTouched();
      return;
    }

    this.loader = true;
    const userData = {
      fullName: this.fullName,
      churchName: this.churchName,
      contactNo: this.contactNo,
      address: this.address,
      occupation: this.occupation,
      invitation: this.personName ? this.personName : this.invitation,
      participationStatus: this.participationStatus
    };
    this.service.registerUser(userData).subscribe(
      (response: any) => {
        this.loader = false;
        this.isUserRegistered = true;
        this.registrationID = response['registrationID'];
        console.log('User registered successfully', response);
        form.resetForm();
      },
      error => {
        this.loader = false;
        console.error('Error registering user', error);
      }
    );
  }
  copyLink(regID: string) {
  navigator.clipboard.writeText(regID)
    .then(() => alert('Link copied!'));
}
}
