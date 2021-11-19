

import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class ConfigService {
  backendUrl="https://aptechbangalore.com/trillbackend/api/";
  backendDomainUrl="https://aptechbangalore.com/trillbackend/";
  //backendUrl="http://localhost/grocery/webservices/";
  razorpay={
      key_id: 'rzp_test_0YIeGJsgDNpNjk',
      key_secret: '7LhXrekD6WhxSITm6qOJQcZG',
  };
  social_key={
    google: '54104912998-0q49pk98crukcasftf873mkttj3ubd8e.apps.googleusercontent.com',
    key_secret: '7LhXrekD6WhxSITm6qOJQcZG',
};
}
