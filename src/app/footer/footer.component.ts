import { Component, OnInit,ViewChild } from '@angular/core';
import { CrudService } from 'src/app/common_service/crud.service';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray} from '@angular/forms';
import { first } from 'rxjs/operators';
import { PostService  } from '../post.service';
import { Track } from 'ngx-audio-player';  
import { CartService } from 'src/app/common_service/cart.service';
import { DataService } from 'src/app/common_service/data.service';
import { ContentObserver } from '@angular/cdk/observers';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AlertService} from 'src/app/common_service/alert.service';
declare var $: any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {
      // uoload modal section  
        currentModalTitle:any='My device';
        alluploaded:any[];
        steamURL;
        galleryType='2';
        imagePath='';
        myActiveTab=0;
        imageChangedEvent: any = '';
        thumbnail_url:any;
        croppedImage: any = '';

    // uoload modal section  

      // player section 
    @ViewChild('player', { static: false }) advancedPlayer: any;
    msaapDisplayTitle = true;
    msaapDisplayPlayList = true;
    msaapPageSizeOptions = [];
    msaapDisplayVolumeControls = false;
    msaapDisplayRepeatControls = true;
    msaapDisplayArtist = true;
    msaapDisplayDuration = true;
    msaapDisablePositionSlider = false;
    singleTrack = [
      {
            title: 'Audio new ',
            url: 'https://aptechbangalore.com/trillbackend/public/uploads/music/11.mp3',
            artist: 'Audio tenth Artist',
            duration:300
      }
    ];
    playingIndex=0;
    msaapPlaylist = [];
    // player section 
  settings:any={
      "facebook_url":"",
      "twiter_url":"",
      "linkedin_url":""
  };pages:any;
  constructor(
    public CartService: CartService, 
    private PostService:PostService,
    private dataSerice:DataService,
    private CrudService:CrudService,
    private alertService: AlertService,
     private formBuilder: FormBuilder,
     private crud: CrudService) { }

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


    saveImage(){
      // this.getMyGalleryIMages();
      let  params={   
        "image":this.croppedImage,
        "user_id":localStorage.getItem('Userid') || 0,
        "type":"1"
      };
      this.CrudService.add(params,'imageGallery').subscribe(uploads => {
        if(uploads.status){
          var imagePr={
            path:this.imagePath,
            image:uploads.imagename
            };
            this.dataSerice.SelectedImageFromGallery.next(imagePr);
            this.getMyGalleryIMages();
            $('#CropPhoto').modal('hide');
      }else{
        this.alertService.error(uploads.message);
      }
      });
      }
       
    changeMytab(tab){
        this.myActiveTab=tab;
    }
    SelectImage(imageObj){
      var imagePr={
      path:this.imagePath,
      image:imageObj.image
      };
      this.dataSerice.SelectedImageFromGallery.next(imagePr);
      $('#uploadArtWork').modal('hide');
    }

getMyGalleryIMages(){
  let  prms={
    "user_id":localStorage.getItem('Userid') || 0,
    "type":this.galleryType
  };
    this.CrudService.add(prms,'getGalleryImage').subscribe(galResp => {
      if(galResp.status){
          this.alluploaded=galResp.data;
          this.imagePath=galResp.imgpath;
      }else{
        this.alertService.error(galResp.message);
      }
    });

}
      ///player
    onEnded(e){
      console.log(e);
      }
      ///player
  ngOnInit(): void {

   

    this.galleryType='1';
    this.CrudService.add('','settings').subscribe(data => {
      this.settings=data['data'];
     
    });
    this.CrudService.add('','pages').subscribe(data => {
      this.pages=data['data'];
     
    });
   
   this.getMyGalleryIMages();
    

    this.CartService.currentTrack.subscribe(data => {
      if(data){
        this.playingIndex = data.index;
        let param = {
          dataId:data.dataId,
          dataType:data.dataType
        }
        this.setSingleTrack(param);
      }
    });

    this.CartService.trackList.subscribe(data => {
      this.msaapPlaylist = []
      console.log("data=",data)
      if(data && data.length>0){
        this.playingIndex = data[0].index;
        this.msaapPlaylist = data;
      }
    });

    this.CartService.playList.subscribe(playList => {
      if(playList){
        console.log("ddd=",playList);
        this.msaapPlaylist =playList;
        // this.setSingleTrack(playList);
      }
    })
  }

         
  subcriptionForm = this.formBuilder.group({
    email: ['', [
      Validators.required
      ,Validators.email
    ]]
  });

  setSingleTrack(track) {
     this.crud.add({
        "dataId":track.dataId,
        "dataType":track.dataType
        },
       'getTrackForPlayer').subscribe(res => {
      if (res.status==true) {
            var decoded_string = atob(res.data);
             var t=JSON.parse(decoded_string);
             let obj = {
              artist:t.artistname,
              title:t.name,
              url:t.audio,
              duration:t.duration
             }
            // this.singleTrack[0].artist=t.artistname;
            // this.singleTrack[0].title=t.name;
            // this.singleTrack[0].link=t.audio;
            // this.singleTrack[0].duration=t.duration;
            this.singleTrack.push(obj)
            this.msaapPlaylist = this.singleTrack;
          console.log("this.msaapPlaylist==",this.msaapPlaylist)
      } else {
        this.PostService.snakeMessage(res.message,'OK');
      }
    });
     
  }
  subscribe(){
   // this.api_calling=true;
    const formData = new FormData();
    formData.append('email', this.subcriptionForm.controls['email'].value);
    this.crud.add(formData, 'subcription').subscribe(res => {
      //this.api_calling=false;
      if (res.status==true) {
        this.subcriptionForm.reset();
        this.PostService.snakeMessage(res.message,'OK');
      } else {
        this.PostService.snakeMessage(res.message,'OK');
      }
    });
  }
}
