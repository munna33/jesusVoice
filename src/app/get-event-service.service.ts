import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GetEventServiceService {
  result:any;
  constructor(private _http: Http) { }
 getEvents(){
    return this._http.get("/api/eventList")
      .map(this.getData);
 }
 getData(res){
   this.result = res.json();
   console.log(this.result+" "+res) ;
   return this.result;
 }
}
