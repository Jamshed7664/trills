import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, Subscriber,throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class PostService {
	submitted = false;
	info;
constructor(private deviceService: DeviceDetectorService, private config: ConfigService,private http: HttpClient,public snackBar: MatSnackBar) { }

public getUserPlatform(){
  const userBrowser=this.deviceService.getDeviceInfo().browser;
  const userOS=this.deviceService.getDeviceInfo().os;
      var userDevice='';
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
      const isDesktopDevice = this.deviceService.isDesktop();
      if(isMobile){
        userDevice='Mobile';
      }else if(isTablet){
        userDevice='Tablet';
      }
      else if(isDesktopDevice){
        userDevice='Desktop';
      }else{
        userDevice='Unknown';
      }
      return {
          "userDevice":userDevice,
          "userOS":userOS,
          "userBrowser":userBrowser
      };
}
getPageData(start,limit){
	const  params={
      "start":start,
       "limit":limit,
    };
     this.http.post<any>(this.config.backendUrl+'pages', {params})
            .pipe(first())
            .subscribe( data => {
                // login successful if there's a jwt token in the response
                
               // if (userstatus==true) {
                   
              //  }

                return data['data'];
            });
   /* this.http
    .post(this.config.backendUrl+'pages',{params})
    .subscribe(data => {
    	this.info=data;
    	 if(this.info.status==true){
    	 //return	this.submitted = true;
				}else{
				//return	this.submitted = false;
				}
    //	this.snakeMessage(this.info.message,'Danger');
     //data['data'];
   
    })*/
}
checkUser($event: KeyboardEvent) {
  let value = (<HTMLInputElement>event.target).value;
  const  params={
      "username":value
    };
  return  this.http
    .get(this.config.backendUrl+'userCheck',{params})
    .subscribe(data => {
    	this.info=data;
    	 if(this.info.status==true){
    	 return	this.submitted = true;
				}else{
				return	this.submitted = false;
				}
    	this.snakeMessage(this.info.message,'Danger');
  //   data['data'];
   
    })
}



snakeMessage(message,action='') {
    let extraClasses;let duration;
   if(action ==='OK') {
     extraClasses = ['snakebar-background-red'];
     duration =10000;
   } else {
     extraClasses = ['snakebar-background-green'];
     duration =2000;
    }
    this.snackBar.open(message,action, {
     duration:duration,
    panelClass:extraClasses
    });
}
  public handleError (error: HttpErrorResponse | any) {
    this.snackBar.open('Error message: '+error.error.error, 'action', {
     duration: 3000,
    });
    return throwError(error);
  }

 todayDate() {
  let ndate = "Rs.";
  return ndate;
}

page= new BehaviorSubject('');
currency() {
  let ndate = '$ ';
  return ndate;
}
title = new BehaviorSubject('Initial Title');

setTitle(title: string) {
    this.title.next(title);
  }
pageInfo(com_obj,pagedata) {
  com_obj.title.setTitle(pagedata.page_title);
 com_obj.meta.updateTag({name:'keywords',content:pagedata.meta_data.Keywords});
 com_obj.meta.updateTag({name:'description',content:pagedata.meta_data.description});
}

addUser(name: string, profileImage: File): Observable<any> {
  var formData: any = new FormData();
  formData.append("name", name);
  formData.append("avatar", profileImage);

  return this.http.post('http://localhost:4000/api/create-user', formData, {
    reportProgress: true,
    observe: 'events'
  }).pipe(
    catchError(this.errorMgmt)
  )
}

errorMgmt(error: HttpErrorResponse) {
  let errorMessage = '';
  if (error.error instanceof ErrorEvent) {
    // Get client-side error
    errorMessage = error.error.message;
  } else {
    // Get server-side error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  console.log(errorMessage);
  return throwError(errorMessage);
}



}