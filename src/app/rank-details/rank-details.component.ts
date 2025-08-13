import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResultService } from '../services/result.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-rank-details',
  templateUrl: './rank-details.component.html',
  styleUrls: ['./rank-details.component.scss']
})
export class RankDetailsComponent {
  rankDetails: any;
  userDetails: any = {}; 
  constructor(
    private router: Router,
    private resultService: ResultService,
    private _location: Location
  ) {
    
  }
  ngOnInit() {
     this.userDetails = JSON.parse(sessionStorage.getItem('user') as string)
if (this.router.getCurrentNavigation()?.extras?.state) {
      this.rankDetails = this.router.getCurrentNavigation()?.extras.state
    } else {
      this.rankDetails = JSON.parse(sessionStorage.getItem('rankDetails') as string)
    }
  }
  goBack() {
    this._location.back();
  }

}
