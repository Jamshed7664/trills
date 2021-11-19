import { Component, OnInit,ViewChild } from '@angular/core';
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

 declare var $: any;

@Component({
  selector: 'app-trackedit',
  templateUrl: './trackedit.component.html',
  styleUrls: ['./trackedit.component.css']
})
export class TrackeditComponent implements OnInit {

  imageChangedEvent: any = '';
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
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  address:any='';Droplist:any;
  form: FormGroup;
  progress: number = 0;
  DataForm: FormGroup;socialForm: FormGroup;address_book_from: FormGroup;
  loading = false;
  submitted = false;
  url;tags:any[];baseurl;
  tracktypelist:any;
  newDynamic: any = {};   alluploaded:any[];
 
  itemForm: FormGroup;id:any;image:any;
  rows: FormArray;isShow = false;videos:any[];
  
  
  constructor( 
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
  this.rows = this.formBuilder.array([]);
}

fileChangeEvent(event: any): void {
  this.imageChangedEvent = event;
  $('#uploadArtWork').modal('hide');
  $('#CropPhoto').modal('show');
}
imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = event.base64;
}
imageLoaded() {
  // show cropper
}
cropperReady() {
  // cropper ready
}
loadImageFailed() {
  // show message
}

changeSection(param1,param2){
  this.currentModal=param1;
  this.currentModalTitle=param2;


  this.CrudService.list('','getGalleryImage').
  subscribe(data => {
   
       this.alluploaded=data['data'];
  }
  )




}
onChange(file: File) {
  if (file) {
    this.fileName = file.name;
    this.file = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = event => {
      this.imageUrl = reader.result;
        $('#uploadArtWork').modal('hide');
        $('#CropPhoto').modal('show');
    };
  }
}
  ngOnInit(): void {
   // this.tagtitle = false;
    this.DataForm = this.formBuilder.group({
     
      title: this.formBuilder.array([this.formBuilder.group({title:''})]),
      source: this.formBuilder.array([]),
      tagtitle:'',
      name: ['', [Validators.required,Validators.minLength(6), Validators.maxLength(50)]],
      track_type: '',
      release_date: '',
      not_for_sale: '',
      private_discount: '',
      bulk_discounts: '',
      price: '',
      WAVprice: '',
      download_options: '',
      require_downloaders: '',
      subgenre: '',
      secondary_mood:'',
      BPM: '',
      track_key:'',
      description:'',
      primary_genre:'',
      primary_mood:'',
    // title:'',
      //source:'',
      id:'',
      feature_type:'',
      //feature_type1:''
      });

      this.CrudService.list('','trackType').subscribe(data => {
           
        this.tracktypelist =data['data'];
      // console.log(data['data']);
      });

      let  url={
        "url":this.route.snapshot.paramMap.get('url')
      };

      
          this.CrudService.add(url,'getTrack').subscribe(data => {

            this.info=data['data'];
            this.id=this.info.id;
           this.image=this.info.image;
                this.DataForm.setValue(
                    {
                      id: this.info.id,
                    name: this.info.name,
                    release_date: this.info.release_date,
                    not_for_sale: this.info.not_for_sale,
                    tagtitle:'',
                    track_type: this.info.track_type,
                    private_discount: this.info.private,
                    bulk_discounts: this.info.bulk_discounts,
                    price: this.info.price,
                    WAVprice: this.info.WAVprice,
                    download_options: this.info.download_options,
                    require_downloaders: this.info.require_downloaders,
                    subgenre: this.info.subgenre,
                    secondary_mood:this.info.secondary_mood,
                    BPM: this.info.BPM,
                    track_key:this.info.track_key,
                    description:this.info.description,
                    primary_genre:this.info.primary_genre,
                    primary_mood:this.info.primary_mood,
                    //title:'',
                    //source:'',
                    feature_type:'',
                   // feature_type1:1,
                  //  not_for_sale: this.DataForm.not_for_sale
                  }
                   );

           // this.info =data['data'];
            
          });

         
          let  params={
            "type":5
          };
          this.CrudService.add(params,'generMoodKey').subscribe(data => {
            this.Droplist =data['data'];
           //console.log(this.list.length);
          });
          this.getTags(this.route.snapshot.paramMap.get('url'));   

          this.getVideo(this.route.snapshot.paramMap.get('url'));   

          this.rows = this.formBuilder.array([]);



          
//console.log(this.rows);
  }
  get f() { return this.DataForm.controls; }
  onSubmit(event) {
  console.log(this.DataForm.value);
 // onSubmit() {
  // console.log(this.DataForm.controls['title'].value);
  if( event.submitter.name == "draft" )
  { //console.log('draft');
  var feature_type=0;
}
  else if( event.submitter.name == "save")
  { //console.log('save');
var feature_type=1;

}
    this.submitted = true;

    // stop here if form is invalid
    if (this.DataForm.invalid) {
        return;
    }
var prm=this.DataForm.value;

prm.id=this.route.snapshot.paramMap.get('url');
prm.feature_type=feature_type;

    this.loading = true;
    this.CrudService.add(prm,'Updatetrack')
        .pipe(first())
        .subscribe(
            data => {

              if (data.status==true) {
                this.alertService.success(data.message, true);
               
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
get skills() : FormArray {
  return this.DataForm.get("skills") as FormArray
}
newSkill(): FormGroup {
  return this.formBuilder.group({
    skill: '',
    exp: '',
  })
}

addSkills() {
  this.skills.push(this.newSkill());
}

removeSkill(i:number) {
  this.skills.removeAt(i);
}

onAddRow() {
  this.rows.push(this.createItemFormGroup());
}

onRemoveRow(rowIndex:number){
  this.rows.removeAt(rowIndex);
}

createItemFormGroup(): FormGroup {
  return this.formBuilder.group({
    name: null,
    description: null,
    qty: null
  });
}
createTrack(){
   
  let  query_params={
    "user_id":localStorage.getItem('Userid')
  };
   this.CrudService.add(query_params,'createtrack').subscribe(data => {
      if (data.status==true) {
        this.router.navigate(['/tracks/edit/'+data.id]);
             // $('html, body').animate({scrollTop:500},'50');
      } else {
     this.PostService.snakeMessage(data.message,'Danger');
      }

 });

}

delete(id){
  //console.log(id);
 // if (confirm("Want to delete confirm")) {
    let  params={
      
      "id":id
    };
     this.CrudService.add(params,'deleteTags').subscribe(data => {
        if (data.status==true) {
          this.getTags(data.id);
         
        this.PostService.snakeMessage(data.message,'success');
        } else {
        this.PostService.snakeMessage(data.message,'Danger');
        }

   });
  //}
}

getTags(id){
  //console.log(id);
  let  params={
    "prd_id":id
  };
  this.CrudService.add(params,'gettags').subscribe(data => {
    this.tags =data['data'];
   //console.log(this.list.length);
  });

}

createTags(prd_id) {
 

  var title = ((document.getElementById("tagtitle") as HTMLInputElement).value);
  //console.log(title);
 
 let  params={
  "prd_id":prd_id,
  "title":title
};
 this.CrudService.add(params,'CreateTags').subscribe(data => {
    if (data.status==true) {
      this.getTags(prd_id);
     
    this.PostService.snakeMessage(data.message,'success');
    } else {
    this.PostService.snakeMessage(data.message,'Danger');
    }

});
  console.log();
  }
  
 
  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  copyMessage(val: string){
    console.log(val);
    this.PostService.snakeMessage('URL copied to clipboard.','success');
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.innerText = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  /**************Video Section */
saveVideo(){
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
                  this.alertService.success(data.message, true);
                  this.getVideo(data.id);
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
getVideo(id){
  //console.log(id);
  let  params={
    "prd_id":id
  };
  this.CrudService.add(params,'getvideo').subscribe(data => {
    this.videos =data['data'];
  
  });

}
deleteVideo(id){
  //console.log(id);
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
/**************Gallery Image Section */
saveImage(){
 
  let  params={   
    "image":this.croppedImage,
    "prd_id":this.route.snapshot.paramMap.get('url')
  };
  
   
      this.CrudService.add(params,'imageGallery')
          .pipe(first())
          .subscribe(
              data => {
  
                if (data.status==true) {
                  this.alertService.success(data.message, true);
                  this.image=data.image;
                  $('#CropPhoto').modal('hide');
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
selectGallery(id){

  let  params={   
    "id":id,
    "flag":0
  };
  
   
      this.CrudService.add(params,'GalleryImagedelete')
          .pipe(first())
          .subscribe(
              data => {
  
                if (data.status==true) {
                  this.alertService.success(data.message, true);
                  this.image=data.image;
                  $('#uploadArtWork').modal('hide');
                  this.image=data.image;
                }
                else if (data.status==false) {
                  //  this.alertService.error(data.message);
                }
  
              },
              error => {
                  this.alertService.error(error);
                 // this.loading = false;
              });
}
}
