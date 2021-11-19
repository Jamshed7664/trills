import { Component, OnInit,ViewChild,NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { User } from '../_models/user';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { PostService  } from '../post.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import * as moment from 'moment';
import { ThemePalette } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
 declare var $: any;

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {
  imageChangedEvent: any = '';thumbnail_url:any;
  croppedImage: any = '';
  file: File;
  fileName: string = "No file selected";
  imageUrl: string | ArrayBuffer = "https://bulma.io/images/placeholders/480x480.png";
  buttonType:any;
  currentModal:any=0
  currentModalTitle:any='My device';
  userData;info:any;currentUser: User;tagtitle;
  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;api_calling=false;
  uploadedFilePath: string = null;
  address:any='';Droplist:any;
  form: FormGroup;
  progress: number = 0;
  DataForm: FormGroup;socialForm: FormGroup;address_book_from: FormGroup;
  loading = false;
  submitted = false;
  url;tags:any[];baseurl;
  tracktypelist:any;
  newDynamic: any = {};   
  alluploaded:any[];steamURL;
  itemForm: FormGroup;id:any;image:any;url1;form01_zip:FormGroup;track_stems_rarzip:any;
  rows: FormArray;isShow = false;videos:any[];allmusicuploaded:any;videoinfo:any;
  fields: any;controls:any[];track_loops:any;form01: FormGroup;results:any;
  Droplist2:any;Droplist3:any;Droplist4:any;Droplist5:any;stemslist:any;searchText:any;videolink;videotitle;
  
  constructor( 
    public sanitizer: DomSanitizer,
    private PostService:PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    public CrudService:CrudService,
    private config: ConfigService) {  
     this.baseurl=location.origin;
  if (!this.authService.currentUserValue) { 
      this.router.navigate(['/login']);
  } 
  //this.options = this.formBuilder.array([]);
 
  }

  ngOnInit(): void {
    this.form01_zip = this.formBuilder.group({
      track_stems_url: '', //text
      track_stems_pswurl: '', //text
     
    });
    this.form01 = this.formBuilder.group({
      video_link: ['', Validators.required], //text
      video_title: ['', Validators.required],
      video_description: ['', Validators.required], 
    });
    this.getVideo(); 
  }
 /**************Video Section *******************/
 videoplay(title,videolink){
  this.videotitle = title;
 // this.videolink=videolink;

  this.videolink=this.sanitizer.bypassSecurityTrustResourceUrl(videolink);

//var map = new google.maps.Map(document.getElementById("map"), videolink);
    $('#videoplay').modal('show');

}
 importVideo(){
  this.api_calling=false;
  var video_link =  $('#video_link').val();
  let  videourl={
    "youtubeurl":video_link
   
  };
     this.CrudService.add(videourl,'videoImport').subscribe(data => {
        if (data.status==true) {
          this.thumbnail_url= data.data.thumbnail_url;

          this.form01.setValue(
              {
                video_link: video_link,
                video_title: data.data.title,
                video_description: data.data.description,
            });

            // this.PostService.snakeMessage(data.message,'success');     
               // $('html, body').animate({scrollTop:500},'50');
        } else {

       this.PostService.snakeMessage(data.message,'Danger');
        }

   });
  
}
saveVideo(){
if(!this.form01.valid){
  this.form01.markAsTouched();
return ;
}
this.api_calling=true;
var video_link =  $('#video_link').val();
var video_title =  $('#video_title').val();
var video_description = $("#video_description").val();



//console.log(video_link);
let  params={   
  "title":video_title,
  "link":video_link,
  "description":video_description,
  "prd_id":this.route.snapshot.paramMap.get('url')
};

 
    this.CrudService.add(params,'Createvideo')
        .pipe(first())
        .subscribe(
            data => {

              if (data.status==true) {
                this.loading = true;
                this.alertService.success(data.message, true);
                this.getVideo(data.id);
                this.form01.reset();
                this.thumbnail_url='';
                $('#myModal').modal('hide');
              }
              else if (data.status==false) {
                  this.alertService.error(data.message);
              }

            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
}
getVideo(id=''){
//console.log(id);
let  params={
 
};
this.CrudService.add(params,'getvideo').subscribe(data => {
  this.videos =data['data'];
  //this.thumbnail_url= this.videos.thumbnail_url;
});

}
deleteVideo(id){

// if (confirm("Want to delete confirm")) {
  let  params={
    
    "id":id
  };
   this.CrudService.add(params,'deletevideo').subscribe(data => {
      if (data.status==true) {
        this.getVideo(data.id);
       
      this.PostService.snakeMessage(data.message,'success');
      } else {
      this.PostService.snakeMessage(data.message,'Danger');
      }

 });
//}
}
}
