import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as ENV } from 'src/environments/environment';
import * as CONFIG from '../config/config';
declare let gtag: Function;
@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {

  constructor(private httpClient: HttpClient) { }
  baseUrl = ENV.BASE_URL;
  login(userData: any) {
    const url = this.baseUrl + '/login/'+CONFIG.config.LOGIN_SHEET;
    return this.httpClient.post(url, userData);
  }
   public sendEvent(eventName: string, eventParams: { [key: string]: any }): void {
    gtag('event', eventName, eventParams);
  }

  public setUserId(userId: string): void {
    gtag('set', { 'user_id': userId });
  }

  public setUserProperties(properties: { [key: string]: any }): void {
    gtag('set', 'user_properties', properties);
  }
  getYoutubeVideos() {
    const url = this.baseUrl + '/youtube/latestVideos'
    return this.httpClient.get(url);
  }
}
