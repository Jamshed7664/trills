import { Component,Input, OnInit, Output,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { PostService  } from '../post.service';
import {CookieService} from 'ngx-cookie-service';  
import { AuthService } from 'src/app/common_service/auth.service';
import {BehaviorSubject, Observable, Subject, Subscriber} from 'rxjs';
import{CartService} from 'src/app/common_service/cart.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { first } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

    alluploaded:any[];url1;stemslist;
    currentUser: User;progress: number;allimages;imgpath;
    constructor(
    private PostService:PostService,
    //private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
   // private alertService: AlertService,
    public CrudService:CrudService,
    private config: ConfigService
    ) {
        this.authService.currentUser.subscribe(x => this.currentUser = x);
    }

  ngOnInit(): void {
    let apisCallData=[
     { 
      "params":{"user_id":localStorage.getItem('Userid'),"type":"1"},
     "url":"getGalleryImage"
    },
    ];
     this.CrudService.handleMutipleCallAPI(apisCallData).subscribe(data => {
      this.imgpath=data[0].imgpath;
      this.allimages=data[0].data;
    });
 
  }
  selectGallery(id,type){
    let  params={   
      "id":id,
      "flag":type,
      "prd_id":"",
      "user_id":'',
      "type":"1"
    };
    
        this.CrudService.add(params,'GalleryImagedelete')
            .pipe(first())
            .subscribe(
                data => {
    
                  if (data.status==true) {
                 //   this.alertService.success(data.message, true);
                    $('#uploadArtWork').modal('hide');
                   
                    this.CrudService.add(params,'getGalleryImage').
                    subscribe(data => {
                         this.allimages=data['data'];
                       
                    }
                    )
                    this.PostService.snakeMessage(data.message,'OK');
                  }
                  else if (data.status==false) {
                    //  this.alertService.error(data.message);
                  }
    
                },
                error => {
                   
                    this.PostService.snakeMessage(error,'OK');
                });
  }
}
