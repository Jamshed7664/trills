import { Injectable } from '@angular/core';
import { AlertService } from './common_service/alert.service'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor(public alertService: AlertService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('i am interceptor');

    // request=request.clone({
      
      // setHeaders: {
      //   'Accept' : 'application/json',
      //   'Content-Type' : 'application/json',
      //   'Access-Control-Allow-Origin' : '*'
      // }
    // });
    this.alertService.sendLoading(true);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse)=>{
        return throwError(error);
      }),
      tap(event=>{
        console.log(event);
      }),
      finalize(()=>{
        this.alertService.sendLoading(false);
      })
    );
  }
}
