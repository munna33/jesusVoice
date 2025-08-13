import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsermanagementService } from '../services/usermanagement.service';
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
    private userService: UsermanagementService
  ) {

  }
  ngOnInit() {
    this.appType = sessionStorage.getItem('appType') as string;
    if(sessionStorage.getItem('user') && this.appType) {
      const user: any = JSON.parse(sessionStorage.getItem('user') as any)
      this.router.navigateByUrl('/dashboard', {state: user})
    } else {
      if(sessionStorage.getItem('appType')) {
        this.router.navigateByUrl('/login')
      } else {
        sessionStorage.removeItem('appType');
        this.router.navigateByUrl('/welcome')
      }
    }
  }
  login() {
    this.loader = true;
    const payload = {
      name: this.fullName,
      regID: this.regID,
      appType: sessionStorage.getItem('appType')
    }
    this.userService.login(payload).subscribe((data:any) => {
      if(data && data['user']) {
      this.userService.sendEvent('login', {
        appType: this.appType,
        regID: this.regID
      })
        sessionStorage.setItem('user', JSON.stringify(data['user']));
        this.router.navigateByUrl('/dashboard', {state: data.user})
      }
      this.loader =  false;
    })
    
  }
  goBack() {
    sessionStorage.removeItem('appType');
    window.history.back();
  }
}
