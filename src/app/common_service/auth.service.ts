import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { DeviceDetectorService } from 'ngx-device-detector';
declare var $: any;
@Injectable({ providedIn: 'root'})
export class AuthService {  
   public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
deviceInfo = null;
    constructor(private deviceService: DeviceDetectorService,private http: HttpClient, private config: ConfigService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
public getUserPlatform(){
	this.deviceInfo = this.deviceService.getDeviceInfo();
	//console.log(this.deviceInfo);
  const userBrowser=this.deviceService.getDeviceInfo().browser;
  const userOS=this.deviceService.getDeviceInfo().os;
  const os_version=this.deviceService.getDeviceInfo().os_version;
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
          "userBrowser":userBrowser,
          "os_version":os_version,
         "user_id":localStorage.getItem('Userid')
      };
}
sessionChk() {
    	 let params=this.getUserPlatform();
   
        return this.http.post<any>(this.config.backendUrl+'sessionchk', {params})
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                
                if (user.status==false) {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
                }

                return user;
            }));
    }
    login(email: string, password: string) {
    	 let params=this.getUserPlatform();
   
        return this.http.post<any>(this.config.backendUrl+'login', {email,password,params})
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                
                if (user && user.data.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser',JSON.stringify(user.data));
                    this.currentUserSubject.next(user.data);
                }

                return user;
            }));
    }
    verifyOTP(otp: string, id: string) {
        return this.http.post<any>(this.config.backendUrl+'verify_otp', { otp, id })
            // .pipe(map(user => {
            //     // login successful if there's a jwt token in the response
            //     if (user && user.data.token) {
            //         // store user details and jwt token in local storage to keep user logged in between page refreshes
            //         localStorage.setItem('currentUser', JSON.stringify(user));
            //         this.currentUserSubject.next(user);
            //     }

            //     return user;
            // }));
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}