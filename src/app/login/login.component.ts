import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsermanagementService } from '../services/usermanagement.service';
import { TranslateService } from '@ngx-translate/core';
declare let gtag: Function;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{
  fullName: string = '';
  regID: string = '';
  loader: boolean = false;
  appType: string ='';
  constructor(private router: Router,
    private userService: UsermanagementService, private translate: TranslateService
  ) {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);
  }
  ngOnInit() {
    this.appType = localStorage.getItem('appType') as string;
    if(localStorage.getItem('user') && this.appType) {
      const user: any = JSON.parse(localStorage.getItem('user') as any)
      this.router.navigateByUrl('/bible-study/dashboard', {state: user})
    } else {
      if(localStorage.getItem('appType')) {
        this.router.navigateByUrl('/bible-study/login')
      } else {
        sessionStorage.removeItem('appType');
        this.router.navigateByUrl('/bible-study/')
      }
    }
  }
  login() {
    this.loader = true;
    const payload = {
      name: this.fullName,
      regID: this.regID,
      appType: localStorage.getItem('appType')
    }
    this.userService.login(payload).subscribe((data:any) => {
      if(data && data['user']) {
        localStorage.setItem('user', JSON.stringify(data['user']));
        this.router.navigateByUrl('/bible-study/dashboard', {state: data.user})
      }
      this.loader =  false;
    })
    
  }
  goBack() {
    sessionStorage.removeItem('appType');
    window.history.back();
  }
}
