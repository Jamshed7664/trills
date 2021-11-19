import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { User } from '../_models/user';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { PostService  } from '../post.service';

import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  info;form;
  constructor( 
    private PostService:PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService:CrudService,
    private config: ConfigService) {  
  if (!this.authService.currentUserValue) { 
      this.router.navigate(['/login']);
  } 
  this.form = this.formBuilder.group({
    avatar: [null]
  })
}

  ngOnInit(): void {
    let  params={
      "Userid":localStorage.getItem('Userid'),
    };
        this.CrudService.add(params,'profile').subscribe(data => {
          this.info =data['data'];
         
        });
  }

}
