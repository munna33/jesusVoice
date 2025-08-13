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
  ngOnInit() {
    this.userService.getYoutubeVideos().subscribe(data => {
      if(data) {
        this.youtubeList = this.formatYouTubeData(data);
      }
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
    console.log('result', result)
    return result;
  }
  goBack() {
    window.history.back();
  }
  trackVideoClick(title: any) {
    this.userService.sendEvent('YoutubeClick',{
      title
    })
  }
}
