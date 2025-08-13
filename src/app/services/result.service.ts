import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as ENV } from 'src/environments/environment';
import * as CONFIG from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private httpClient: HttpClient) { }
  baseUrl = ENV.BASE_URL;
  getAllScore(sheetId:any) {
    const url = this.baseUrl + '/score/'+sheetId;
    return this.httpClient.get(url);
  }

  getQuestion(formID: any) {
    const url = this.baseUrl + '/doc/'+ formID;
    return this.httpClient.get(url)
  }
  getForms() {
    const url = this.baseUrl + '/forms';
    return this.httpClient.get(url);
  }
  // getLastMonthScore(){
  //   const url = this.baseUrl + '/getLastMonthData/'+CONFIG.config.LOGIN_SHEET;
  //   return this.httpClient.get(url);
  // }
  getOnlineQuiz(sheetId:any) {
    const url = this.baseUrl + '/getOnlineQuiz/'+ sheetId;
    return this.httpClient.get(url)
  }
  getOnlineQuizDetails(sheetId: any) {
    const url = this.baseUrl + '/quizDetails/'+ sheetId;
    return this.httpClient.get(url)
  }
  submitQuiz(sheetId: any, requestObj: any) {
    const url = this.baseUrl + '/submitQuiz/'+ sheetId;
    return this.httpClient.post(url, requestObj)
  }
  trackSubmit(sheetId: any, requestObj: any) {
    const url = this.baseUrl + '/quiz/track/'+ sheetId;
    return this.httpClient.post(url, requestObj)
  }
  getTrackingDetails(sheetId: any) {
     const url = this.baseUrl + '/quiz/track/getDetails/'+ sheetId;
    return this.httpClient.get(url, )
  }
  getOnlineQuizRanksDetails(sheetId: any) {
 const url = this.baseUrl + '/getOnlineQuiz/score/'+sheetId;
// const url = '../assets/data/data.json';
    return this.httpClient.get(url);
  }
  getPuzzleRankDetails(sheetId: any) {
     const url = this.baseUrl + '/getPuzzle/score/'+sheetId;
    return this.httpClient.get(url);
  }
  
}
