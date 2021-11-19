import { ConfigService } from './ConfigService.service';
import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import * as fileSaver from 'file-saver';

import { Observable ,forkJoin } from 'rxjs';
import 'rxjs/add/observable/forkJoin'
@Injectable()
export class CrudService {
  customerToken:any;
  customer:any;
  authToken: any;
  user: any;
  isDev:any;
  Droplist:any;countries:any;
  constructor(
      private http: Http,
	  private httpclient: HttpClient,
	  private sanitizer: DomSanitizer,
      private config: ConfigService
      ) {
      this.isDev = false;
      }
	  
	
	getTrackUrl(url): any{			 
		const data=this.config.backendDomainUrl+url;
		return this.httpclient.get(data, { responseType: 'blob' });
	}
  
    add(data,url) : Observable <any>{
    return this.http.post(this.config.backendUrl+url, data)
    .pipe(map(res => {
      if(res) {
        return res.json()
      } else {
        return null
      }
      
    }));
  }
  
  generMood(value:any){
    let  params={
      "type":value
    };
     this.add(params,'generMoodKey').subscribe(data => {
   let Droplist = data['data'];
 /*  var str ='';
   Droplist.forEach(function (value) {
  str +='<option> fhbfhfh</option>';
});*/
//console.log(str); 
 

 // str;
       /*var log = [];
angular.forEach(Droplist, function(value, key) {
    this.push(key + ': ' + value);
 }, log);*/
       
    /*var str ='';
      Droplist.forEach(function (row) {
        str +='<option> fhbfhfh</option>';
      }); 
      
      return str;*/
      // str +='</select>';
    // console.log(data['data']);
    });
  }
  /*generMood(value:any){
    const  params={
      
      "type":value
    };
 

    return   this.http
    .get(this.config.backendUrl+'generMoodKey',{params})
    .subscribe(data => {
      //console.log(data['data']);
       this.Droplist = data['data'];
    })
    
    
   }*/
  list(data,url) : Observable <any>{
    const params = data;
    return this.http.get(this.config.backendUrl+url,{params})
            .pipe(map(res =>{
              if(res) {
                return res.json()
              } else {
                return null
              }
            } ));
  }

  delete(url) : Observable <any>{
    return this.http.delete(this.config.backendUrl+url)
    .pipe(map(res => res.json()));
  }
  update(data,url) : Observable <any>{
    return this.http.patch(this.config.backendUrl+url, data)
    .pipe(map(res => res.json()));
  }
  withOutImage(data,url) : Observable <any>{
    return this.http.patch(this.config.backendUrl+url, data)
    .pipe(map(res => res.json()));
  }
  handleMutipleCallAPI( inputObject ) : Observable <any>{
  let observableBatch = [];
    inputObject.forEach((data,key ) => {
    const params = data.params;
      observableBatch.push( this.http.get(this.config.backendUrl+data.url,{params}).pipe(map(res => res.json())) );
  });
  return Observable.forkJoin(observableBatch);
}

cretaeLyrics(object:any){
  let url ='createLyrics'
  return this.http.post(this.config.backendUrl+url,object)
  .pipe(map(res => res.json()));
}

updatelyrics(object:any){
  let url ='updateLyrics'
  return this.http.post(this.config.backendUrl+url,object)
  .pipe(map(res => res.json()));
}
getLyrics(object:any){
  const params = object;
  let url ='getLyrics'
  return this.http.get(this.config.backendUrl+url,{params})
  .pipe(map(res =>{
    if(res) {
      return res.json()
    } else {
      return null
    }
  } ));
}
}
export class data{
  data:any
}