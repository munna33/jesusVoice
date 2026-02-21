import { Component } from '@angular/core';
import { UsermanagementService } from '../services/usermanagement.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  youtubeList: any =[];
  slides = [
      {image: 'assets/images/bg1.jpeg', text: 'First'},
      {image: 'assets/images/bg1.jpeg',text: 'Second'},
      {image: 'assets/images/bg1.jpeg',text: 'Third'}
   ];
   noWrapSlides = false;
   showIndicator = true;
  constructor(private userService: UsermanagementService) {

  }


  goBack() {
    window.history.back();
  }

}
