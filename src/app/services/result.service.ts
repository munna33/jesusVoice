import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private httpClient: HttpClient) { }
  baseUrl = 'http://localhost:5001';
  getAllScore() {
    const url = this.baseUrl + '/score/13pyzQLmswhWhKIsyaYHZLTkev4FbJgfv-BM3XVlAK8I';
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
}
