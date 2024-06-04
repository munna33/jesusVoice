import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsermanagementService } from '../services/usermanagement.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{
  fullName: string = '';
  regID: string = '';
  loader: boolean = false;
  constructor(private router: Router,
    private userService: UsermanagementService
  ) {

  }
  ngOnInit() {
    if(sessionStorage.getItem('user')) {
      const user: any = JSON.parse(sessionStorage.getItem('user') as any)
      this.router.navigateByUrl('/dashboard', {state: user})
    }
  }
  login() {
    this.loader = true;
    const payload = {
      name: this.fullName,
      regID: this.regID
    }
    this.userService.login(payload).subscribe((data:any) => {
      console.log('data', data)
      if(data && data['user']) {
        sessionStorage.setItem('user', JSON.stringify(data['user']));
        this.router.navigateByUrl('/dashboard', {state: data.user})
      }
      this.loader =  false;
    })
    
  }
}
