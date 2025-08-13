import { Component } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss']
})
export class LeaderBoardComponent {

constructor(
  private _location: Location
) {

}
goBack() {
    this._location.back();
  }
}
