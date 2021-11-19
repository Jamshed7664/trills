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
  fields: any;controls:any[];track_loops:any;disabled = false;form01: FormGroup;results:any;
  Droplist2:any;Droplist3:any;Droplist4:any;Droplist5:any;

  options = new FormArray([]);
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
  this.options = this.formBuilder.array([]);
 
  }



  ngOnInit(): void {
    let  query_params={};
    let apisCallData=[
      { 
        "params":{type:1},
       "url":"generMoodKey"
      },
     { 
    "params":{type:2},
    "url":"generMoodKey"
     },
     {
    "params":{type:3},
    "url":"generMoodKey"
     },
    {
   "params":{type:4},
   "url":"generMoodKey"
     },
    {
  "params":{type:5},
  "url":"generMoodKey"
    }
   ];


   this.CrudService.handleMutipleCallAPI(apisCallData).subscribe(data => {
     this.Droplist =data[0].data;
     this.Droplist2 =data[1].data;
     this.Droplist3 =data[2].data;
     this.Droplist4 =data[3].data;
     this.Droplist5 =data[4].data;
   });


    this.form01_zip = this.formBuilder.group({
      track_stems_url: '', //text
      track_stems_pswurl: '', //text
     
    });
    this.form01 = this.formBuilder.group({
      video_link: ['', Validators.required], //text
      video_title: ['', Validators.required],
      video_description: ['', Validators.required], 
    });

    let  prm={"prd_id":this.route.snapshot.paramMap.get('url'),"type":"1"};
    this.CrudService.add(prm,'getMusic').
    subscribe(data => {
         this.allmusicuploaded=data['data'];
         //this.profileimg =data['data'];
         //this.imgpath=data.imgpath;
    }
    );
    
    this.CrudService.add(prm,'getGalleryImage').
    subscribe(data => {
         this.alluploaded=data['data'];
         //this.profileimg =data['data'];
         //this.imgpath=data.imgpath;
    }
    )
   // this.tagtitle = false;
   this.fields = {
    //isRequired: true,
  //  type: {
   // options: this.track_loops
       options: [
         {
           title: '',
           source: ''
         }
         /*,
         {
          title: '',
           source: ''
        }*/
       ]
    //}
  };

 /* let  videourl={
    "youtubeurl":'https://www.youtube.com/watch?v=za4Q_7gYyS4'
   
  };
  this.CrudService.add(videourl,'videoImport').subscribe(data => {
    this.videoinfo=data['data'];
  this.form01.patchValue({
  
  });
});*/
  
 /* this.form01 = this.formBuilder.group({
    id: '',
    name: ['', [Validators.required]],
    phone: ['', [Validators.required,Validators.minLength(10)]],
    email: ['', [Validators.required,Validators.email]],
    address: ['', [Validators.required]]
    });*/
 
  this.DataForm = this.formBuilder.group({
     
   // title: this.formBuilder.array([this.formBuilder.group({title:''})]),
    //source: this.formBuilder.array([]),
    tagtitle:'',
    name: ['', [Validators.required,Validators.minLength(6), Validators.maxLength(50)]],
    track_type: ['',[Validators.required]],
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
    id:'',
    feature_type:'',
    options: this.formBuilder.array([])
    });
    this.patch()
      this.CrudService.list('','trackType').subscribe(data => {
        this.tracktypelist =data['data'];
      // console.log(data['data']);
      });
      let  url={
        "url":this.route.snapshot.paramMap.get('url'),
        "user_id":localStorage.getItem('Userid')
      };

          this.CrudService.add(url,'getTrack').subscribe(data => {
            if (data.status==false) {
              this.PostService.snakeMessage(data.message,'Danger');
              this.router.navigate(['/tracks/my-tracks']);
            }
            this.info=data['data'];
            this.id=this.info.id;
           this.image=this.info.image;
           this.track_stems_rarzip=this.info.track_stems_rarzip;
           //this.track_loops=this.info.track_loops;
           this.options=this.info.track_loops,
              this.form01_zip.setValue(
                  {
                    
                    track_stems_pswurl: '',
                    track_stems_url: data.data.track_stems_url,
                });
    
           
                this.DataForm.setValue(
                    {
                      id: this.info.id,
                    name: this.info.name,
                    release_date: this.info.release_date,
                    not_for_sale: this.info.not_for_sale,
                    tagtitle:'',
                    track_type: data.data.track_type,
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
                    options:this.info.track_loops,

                    
                   // feature_type1:1,
                  //  not_for_sale: this.DataForm.not_for_sale
                  }
                   );
                   
                  
           // this.info =data['data'];
            
          });
         

          const control = <FormArray>this.DataForm.get('options');
         this.fields.options.forEach(x => {
         control.push(this.patchValues(x.label, x.value))
         })
        
          this.getTags(this.route.snapshot.paramMap.get('url'));   

          this.getVideo(this.route.snapshot.paramMap.get('url'));   

         // this.rows = this.formBuilder.array([]);

          this.options = this.formBuilder.array([]);

          
//console.log(this.rows);  
/*this.fields.type.options.forEach(x => {
      control.push(this.patchValues(x.title, x.source))
    })*/
  }
  /*****************************Add More**********************************/
  onAddRow() {
    const control = <FormArray>this.DataForm.controls['options'];
   // control.push()
   this.fields.options.forEach(x => {
    control.push(this.patchValues(x.title, x.source))
  })
  }
  onRemoveRow(rowIndex:number){
    const fa = (this.DataForm.get('options')as FormArray);
    fa.removeAt(rowIndex);
   // this.fields.options.removeAt(rowIndex);
   // this.rows.removeAt(rowIndex);
  }
  onAddRow1() {
    this.patch();
    //this.rows.push(this.createItemFormGroup());
  }
  patch() {
    // const control = <FormArray>this.DataForm.get('type.options');
    const control = <FormArray>this.DataForm.get('options');
    this.fields.options.forEach(x => {
      control.push(this.patchValues(x.title,x.source))
    })
  }

  patchValues(title, source) {
    return this.formBuilder.group({
      title: [title],
      source: [source]
    })
  }
/*****************************ADD MORE END*************************************/
  get f() { return this.DataForm.controls; }
  onSubmit(event) {
 // console.log(this.DataForm.value);
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
                //this.alertService.success(data.message, true);
                this.PostService.snakeMessage(data.message,'success');   
              }
              else if (data.status==false) {
                this.PostService.snakeMessage(data.message,'success');   
               //   this.alertService.error(data.message);
              }

            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
}
/*************END Form Submit**************/

/*********Add More functionality***********/
onAddRow_old() {
  this.rows.push(this.createItemFormGroup());
}

onRemoveRow11(rowIndex:number){
  this.rows.removeAt(rowIndex);
}

createItemFormGroup(): FormGroup {
  return this.formBuilder.group({
    title: null,
    source: null
   
  });
}

 /**************Tags Section *******************/
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
  /**Other section ****/
 
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

  /**************Video Section *******************/
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
saveImage(){
 
  let  params={   
    "image":this.croppedImage,
    "prd_id":this.route.snapshot.paramMap.get('url'),
    "user_id":localStorage.getItem('Userid'),
    "type":"1"
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

  selectGallery(id,type){
    let  params={   
      "id":id,
      "flag":type,
      "prd_id":this.route.snapshot.paramMap.get('url'),
      "user_id":localStorage.getItem('Userid'),
      "type":"1"
    };
    
        this.CrudService.add(params,'GalleryImagedelete')
            .pipe(first())
            .subscribe(
                data => {
    
                  if (data.status==true) {
                    this.alertService.success(data.message, true);
                    $('#uploadArtWork').modal('hide');
                   // this.image=data.image;
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

/**********Music Upload********* */
validateFile(name: String) {
  var ext = name.substring(name.lastIndexOf('.') + 1);
  if (ext.toLowerCase() == 'mp3' || ext.toLowerCase() == 'wav') {
      return true;
  }
  else {
      return false;
  }
}

fileChangeEventSteam(event: any) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    var fileTypes = ['rar', 'zip']; 
     if (!this.validateFile(event.target.files[0].name)) {
      this.PostService.snakeMessage('Invalid file type. Files accepted: .zip, .rar','Danger');
      //console.log('Selected file format is not supported');
       return false;
   }


    reader.readAsDataURL(event.target.files[0]); // read file as data url
    var extension = event.target.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
    isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types

    this.steamURL = event.target.files[0].name;
      // console.log(filename);
    reader.onload = (event) => { // called once readAsDataURL is completed
    this.url1 = event.target.result;
    }
  }
}
saveSteam() {
  
var track_stems_url = $("#track_stems_url").val();
var track_stems_pswurl =$("#track_stems_pswurl").val();
      let  params={   
        "image":this.url1,
        "steamURL":this.steamURL,
        "id":this.route.snapshot.paramMap.get('url'),
        "user_id":localStorage.getItem('Userid'),
        "track_stems_url":track_stems_url,
        "track_stems_pswurl":track_stems_pswurl
      };
      
          this.CrudService.add(params,'updateSteam')
              .pipe(first())
              .subscribe(
                  data => {
      
                    if (data.status==true) {
                      this.alertService.success(data.message, true);
                     // this.image=data.image;
                     
                     $('#exampleModal').modal('hide');
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
fileChangeEventMusic(event) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    var fileTypes = ['mp3', 'WAV']; 
    if (!this.validateFile(event.target.files[0].name)) {
      this.PostService.snakeMessage('Invalid file type. Files accepted: .MP3, .WAV','Danger');
      console.log('Selected file format is not supported');
      $('#mediaWork').modal('hide');
      return false;
  }
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    var extension = event.target.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
    isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types

    var filename = event.target.files[0].name;
      // console.log(filename);
    reader.onload = (event) => { // called once readAsDataURL is completed
    this.url1 = event.target.result;

      let  params={   
        "image":this.url1,
        "filename":filename,
        "extension":extension,
        "prd_id":this.route.snapshot.paramMap.get('url'),
        "user_id":localStorage.getItem('Userid'),
        "type":"1"
      };
      
          this.CrudService.add(params,'addmusicGallery')
              .pipe(first())
              .subscribe(
                  data => {
      
                    if (data.status==true) {
                      this.alertService.success(data.message, true);
                     // this.image=data.image;
                     
                     $('#mediaWork').modal('hide');
                    }
                    else if (data.status==false) {
                        this.alertService.error(data.message);
                    }
      
                  },
                  error => {
                      this.alertService.error(error);
                      this.loading = false;
                  });
     // console.log(this.url1);
    }
  }
}

}
