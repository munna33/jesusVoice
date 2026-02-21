import { Component, TemplateRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PrayerRequestComponent } from '../prayer-request/prayer-request.component';
import { RegistrationidModalComponent } from '../registrationid-modal/registrationid-modal.component';
import { ResultService } from '../services/result.service';
import { config } from '../config/config';
import { UsermanagementService } from '../services/usermanagement.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
   youtubeList: any =[];
   contentLoaded = false;
   addSenseID = config.ADSENSE;
   toggleCollapse: boolean = true;
   toggleCollapse2: boolean = false;
   toggleCollapse3: boolean = false;
   toggleCollapse4: boolean = false;
  slides = [
      {image: 'assets/images/bg1.jpeg', text: 'First'},
      {image: 'assets/images/bg1.jpeg',text: 'Second'},
      {image: 'assets/images/bg1.jpeg',text: 'Third'}
   ];
   noWrapSlides = false;
   showIndicator = true;
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

  constructor(private modalService: BsModalService,private router: Router, private resultService: ResultService,private userService: UsermanagementService,
    private translate: TranslateService
  ) {
    const savedLang = localStorage.getItem('lang') || 'en';
    if(savedLang) {
      this.translate.setDefaultLang(savedLang);
      this.translate.use(savedLang);
    } else {
    translate.setDefaultLang('en');
    localStorage.setItem('lang', 'en');
    }
  }
  switchLang(lang: string) {
  this.translate.use(lang);
  localStorage.setItem('lang', lang);
}
  ngOnInit() {
    this.resultService.getBibleSchedule(config.GOOGLE_SHEETS_B6.SCHEDULE).subscribe((data: any) => {
      sessionStorage.setItem('bibleSchedule', JSON.stringify(data));
      setTimeout(() => {
        this.contentLoaded = true;
      }, 1000);
    });
     this.userService.getYoutubeVideos().subscribe((data: any) => {
      if(data) {
        this.youtubeList = this.formatYouTubeData(data);
      }
    })
  }
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
    localStorage.setItem('appType', appType);
    this.router.navigateByUrl('/bible-study/login');
  }
  gotoUserRegistration() {
    this.router.navigateByUrl('/register');
  }
  goToSchedule() {
    this.router.navigateByUrl('/bible-study/bible-schedule');
  }
  getUserRegID() {
    // this.router.navigateByUrl('/get-registration-id');
    this.modalRef = this.modalService.show(RegistrationidModalComponent);
  }
  trackVideoClick(title: any) {
    this.userService.sendEvent('YoutubeClick',{
      title
    })
  }
  formatYouTubeData(data: any) {
  const result = data.map((item: any) => {
      return {
        ...item,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url
      }
    })
    return result;
  }
}
