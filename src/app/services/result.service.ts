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
  getFinalOnlineQuiz(sheetId:any, appType: string) {
    const url = this.baseUrl + '/getOnlineFinalQuiz/'+ sheetId+'?appType='+appType;
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
  trackSubmit(requestObj: any) {
    const url = this.baseUrl + '/admin/track';
    return this.httpClient.post(url, requestObj)
  }
  // trackSubmit(sheetId: any, requestObj: any) {
  //   const url = this.baseUrl + '/quiz/track/'+ sheetId;
  //   return this.httpClient.post(url, requestObj)
  // }
  getTrackingDetails(payload: any) {
     const url = this.baseUrl + '/admin/getQuizTracker';
    return this.httpClient.post(url, payload)
  }
  // getTrackingDetails(sheetId: any) {
  //    const url = this.baseUrl + '/quiz/track/getDetails/'+ sheetId;
  //   return this.httpClient.get(url, )
  // }
  getOnlineQuizRanksDetails(sheetId: any) {
 const url = this.baseUrl + '/getOnlineQuiz/score/'+sheetId;
// const url = '../assets/data/data.json';
    return this.httpClient.get(url);
  }
  getPuzzleRankDetails(postData: any) {
     const url = this.baseUrl + '/admin/getPuzzleScore';
    return this.httpClient.post(url,postData);
  }
  getProctoring(postData: any) {
     const url = this.baseUrl + '/admin/api/proctor/frame';
    return this.httpClient.post(url,postData);
  }
  trackVoilation(postData: any) {
     const url = this.baseUrl + '/admin/api/proctor/violation';
    return this.httpClient.post(url,postData);
  }
  sendResults(postData: any) {
     const url = this.baseUrl + '/whatsapp/send-whatsapp';
    return this.httpClient.post(url,postData);
  }
  // getPuzzleRankDetails(sheetId: any) {
  //    const url = this.baseUrl + '/getPuzzle/score/'+sheetId;
  //   return this.httpClient.get(url);
  // }
  getFinalExamResults(sheetId: any, appType?: string) {
     const url = this.baseUrl + '/getFinalOnlineExamScore/'+sheetId+'?appType='+appType;
     return this.httpClient.get(url);
  }
  getBibleSchedule(sheetId: any) {
    // const url = this.baseUrl + '/bibleStudy/schedule/'+sheetId;
    const url = '/assets/data/bible-schedule.json';
    return this.httpClient.get(url);
  }
  getDailyQuizQuestion(payload: any, sheetId: string) {
    const url = this.baseUrl + '/bibleStudy/dailyQuiz/'+sheetId+'?day='+ payload;
    return this.httpClient.get(url,payload)
  }
  saveDailyQuizQuestion(payload: any) {
     const url = this.baseUrl + '/admin/saveDailyQuizData';
     return this.httpClient.post(url, payload)
  }
   getDailyQuizQuestionResults() {
    const url = this.baseUrl + '/admin/getDailyQuizScore';
    return this.httpClient.get(url)
  }
}
