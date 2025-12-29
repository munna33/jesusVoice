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
    // const url = this.baseUrl + '/admin/login';
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
  uploadFile(file: File, parentCollection: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('parentCollection', parentCollection);
    const url = this.baseUrl + '/admin/upload';
    return this.httpClient.post(url, formData);
  }
  getAllUsers() {
    const url = this.baseUrl + '/admin/getAllUsers';
    return this.httpClient.get(url);
  }
  getAllCollections() {
    const url = this.baseUrl + '/admin/getAllCollections';
    return this.httpClient.get(url);
  }
  prayerRequest(prayerData: any) {
    const url = this.baseUrl + '/admin/prayerRequest';
    return this.httpClient.post(url, prayerData);
  }
  registerUser(userData: any) {
    userData.sheetId = CONFIG.config.GOOGLE_SHEETS_B6.REGISTRATIONS;
    const url = this.baseUrl + '/admin/registerUser';
    return this.httpClient.post(url, userData);
  }
  getRegistrationID(mobileNumber: string) {
    const url = this.baseUrl + '/admin/getUserByNumber?mobileNumber=' + mobileNumber;
    return this.httpClient.get(url);
  }
}
