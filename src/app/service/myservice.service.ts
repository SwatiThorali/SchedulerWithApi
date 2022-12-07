import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { R3SelectorScopeMode } from '@angular/compiler';
import { schedulermodel } from '../schedulermodel';
@Injectable({
  providedIn: 'root'
})
export class myserviceService {
    readonly rootURL = 'https://localhost:7033/api';

     headers = { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
        'Authorization': '',
      }

      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
        })
      };
  
  constructor(private http: HttpClient) { }

  getSchedule() {
    return this.http.get(this.rootURL + '/Schedules', this.httpOptions);
  }

  getUsers() {
    return this.http.get(this.rootURL + '/Schedules/GetUsers', this.httpOptions);
  }

  postSchedule(record: any) {
    console.log(record);
    
    //   record.StartTime.setHours(record.StartTime.getHours() + 5);
    //  record.StartTime.setMinutes(record.StartTime.getMinutes() + 30);
    //   record.EndTime.setHours(record.EndTime.getHours() + 5);
    //   record.EndTime.setMinutes(record.EndTime.getMinutes() + 30);
    console.log("bbbbbbb          ",this.rootURL + '/Schedules/sched', record , this.httpOptions);
     return this.http.post(this.rootURL + '/Schedules/sched', record , this.httpOptions);
  }

  deleteSchedule(id : any) {
    return this.http.delete(this.rootURL + '/Schedules/'+ id , this.httpOptions);
  }

  updateSchedule(record: any) {
    //  record.StartTime.setHours(record.StartTime.getHours() + 5);
    //  record.StartTime.setMinutes(record.StartTime.getMinutes() + 30);
    //  record.EndTime.setHours(record.EndTime.getHours() + 5);
    //  record.EndTime.setMinutes(record.EndTime.getMinutes() + 30);
   console.log(this.rootURL + '/Schedules/edit');
   
   return this.http.put(this.rootURL + '/Schedules/edit',  record , this.httpOptions);
  }
}