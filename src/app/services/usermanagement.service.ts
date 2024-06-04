import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {

  constructor(private httpClient: HttpClient) { }
  baseUrl = 'http://localhost:5001';
  login(userData: any) {
    const url = this.baseUrl + '/login/13pyzQLmswhWhKIsyaYHZLTkev4FbJgfv-BM3XVlAK8I';
    return this.httpClient.post(url, userData);
  }
}
