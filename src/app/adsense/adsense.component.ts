import { Component, AfterViewInit } from '@angular/core';
import { config } from '../config/config';

@Component({
  selector: 'app-adsense',
  templateUrl: './adsense.component.html',
  styleUrls: ['./adsense.component.scss']
})
export class AdsenseComponent implements AfterViewInit{
addSenseId = config.ADSENSE;
ngAfterViewInit(): void {
    setTimeout(() => {
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.error('Adsense error', e);
      }
    }, 500); // delay is IMPORTANT
  }
}
