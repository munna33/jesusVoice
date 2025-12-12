import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PrayerRequestComponent } from '../prayer-request/prayer-request.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
isCollapsed = true;
  modalRef?: BsModalRef;
  showSuccessToast: boolean = false;
  successMessage: string = '';
  images = [
    'https://via.placeholder.com/300x200',
    'https://via.placeholder.com/300x200',
    'https://via.placeholder.com/300x200'
  ];

  prayer = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private modalService: BsModalService,private router: Router) {}

  showPrayerRequest() {
    // Here you can handle the prayer submission, like sending it to backend


    this.modalRef = this.modalService.show(PrayerRequestComponent, {
      initialState: {
      onConfirm: (message) => {
        // handle confirmation logic here
        
      },
      onCancel: (message) => {
      }
      }
    });
  this.modalRef?.content.confirm.subscribe((value: any) => {
    console.log('Confirmed value from PrayerRequestComponent:', value);
    // You can handle the emitted value here
    this.successMessage = value;
    this.showSuccessToast = true;
    this.modalRef?.hide();
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 5000);
  });

    this.prayer = { name: '', email: '', message: '' };
  }

  // confirmationTemplate!: TemplateRef<any>;

  // openModal(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template);
  // }
  launchApp(appType: string) {
    sessionStorage.setItem('appType', appType);
    this.router.navigateByUrl('/bible-study/login');
  }
}
