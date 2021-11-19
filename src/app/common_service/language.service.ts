import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {


  constructor() {

   }

  selectedLang= new BehaviorSubject('en');
  page= new BehaviorSubject('');
}
