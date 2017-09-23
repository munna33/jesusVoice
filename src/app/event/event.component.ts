import { Component, OnInit } from '@angular/core';
import { GetEventServiceService } from '../get-event-service.service';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
users: Array<any>;
  constructor(private _dataService: GetEventServiceService) { }

  ngOnInit() {
     this._dataService.getEvents()
        .subscribe(res => this.users = res);
        console.log(this.users);
  }

}
