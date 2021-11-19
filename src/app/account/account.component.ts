import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { CartService } from 'src/app/common_service/cart.service';
import { User } from '../_models/user';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { PostService } from '../post.service';

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { GooglePlaceDirective } from "node_modules/ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";

import { MatSnackBar } from "@angular/material/snack-bar";
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

import * as fileSaver from 'file-saver';

declare var $: any;
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  options = [];
  page: any = 1;
  embeddedUrl: any = '';
  totalPage: any = 1;
  orders: any = [];
  buyer_orders:any=[];
  msgs: any = [];
  currentUser: User;
  selected_product_download:any;
  downloadForm: FormGroup;
  df_submitted = false;
  df_success=false;

  @ViewChild('placesRef', { static: true }) placesRef: GooglePlaceDirective;

  public handleAddressChange(address: any) {

    var location = address.formatted_address;
    //var location=address.address_components;
    console.log(address);
    this.DataForm.patchValue(
      {
        location: location,
      });
  }

  file: File;
  fileName: string = "No file selected";
  imageUrl: string | ArrayBuffer = "https://bulma.io/images/placeholders/480x480.png";

  userData; info; profileimg; alluploaded: any[];
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  imageChangedEvent: any = '';
  croppedImage: any = ''; address: any = '';
  form: FormGroup;
  coupons: any[];
  playlistTitle: any[];
  playlist: any[]; playlistpage: any; playlisttotalRec: any;
  favoritelist:any[];
  historylist:any[];
  selected_product: any;
  selected_product_licenses: any;
  progress: number = 0;
  user_id: any = 0;
  imgpath1;
  embeddedlogo; alluploadedLogo: any[];
  embeddedcoloroptions: string[] = ["white", "black", "gold"];
  EmbeddedSettingDataForm: FormGroup;
  DataForm: FormGroup;
  socialForm: FormGroup; address_book_from: FormGroup;
  loading = false;
  submitted = false; //onSubmitsocial= false;
  api_calling = false;
  state_data: any;
  city_data: any;
  address_data: any;
  address_mode: any = false;
  address_id: any = 0;
  currentModal: any = 0; sessionlist: any;
  currentModalTitle: any = 'My device'; image: any;
  imgpath; isShow = false;
  constructor(
    public snackBar: MatSnackBar,
    private PostService: PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService: CrudService,
	public CartService: CartService, 
    private config: ConfigService) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    this.form = this.formBuilder.group({
      avatar: [null]
    })
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  open_close_modal(open_modal_id, close_modal_id, qty, prd) {

	this.CrudService.add({
      "user_id": localStorage.getItem('Userid'),
	  "order_id": prd.id,
    }, 'buyer_myorder_detail').subscribe(orderResp => {
      this.selected_product = orderResp.data;

    });

    /*this.selected_product = prd;*/
    $('#myModalprocess' + open_modal_id).modal('toggle');
  }

  open_close_modal_license(open_modal_id, close_modal_id, prd_id, license_id) {

	this.CrudService.add({
      "customer_id": localStorage.getItem('Userid'),
	  "track_id": prd_id,
      "license": license_id
    }, 'licensesDetails').subscribe(orderResp => {
      this.selected_product_licenses = orderResp.data;

    });

    $('#myModallicense' + open_modal_id).modal('toggle');
  }

  fileChangeEvent1(event: any): void {
    this.imageChangedEvent = event;
    $('#uploadEmbedLogo').modal('hide');
    $('#CropEmbedLogo').modal('show');
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
  changeSection(param1, param2) {
    this.currentModal = param1;
    this.currentModalTitle = param2;


    this.CrudService.list('', 'getGalleryImage').
      subscribe(data => {

        this.alluploaded = data['data'];
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

  getMoreComments() {
    this.user_id = localStorage.getItem('Userid');
    if (this.totalPage >= this.page) {
      this.CrudService.add({
        "user_id": this.user_id,
        "msgFor": 0,
        "objectType": 0,
        "page": this.page
      }
        , 'mychats').subscribe(res => {
          this.totalPage = res.total_page;
          this.msgs = this.msgs.concat(res.data);
        });
    }
  }

  postChatMsg(comment, data_id) {
    if (comment) {
      this.CrudService.add({
        "fromUser": localStorage.getItem('Userid') || 0,
        "toUser": data_id,
        "msgFor": 0,
        "msg": comment
      }
        , 'sendMsg').subscribe(res => {
          this.msgs.shift(res.data);
          $('#commentBox').val('');
          this.PostService.snakeMessage(res.msg, '');
        });
    } else {
      this.PostService.snakeMessage('Please type a comment', '');
    }
  }
  ngOnInit(): void {

    var ccx = this.route.snapshot.queryParamMap.get("g");
    if (ccx == 'embed') {
      $('.account').trigger('click');
      setTimeout(function () { $('.embeddedSetting').trigger('click'); }, 1000);
    }
    var ss = '<iframe width="560" height="315" src="' + window.location.origin + '/trilliconsAngular1/embed?uid=' + localStorage.getItem('Userid') + '" ></iframe>';
    this.embeddedUrl = ss;

    $('.chatsDiv').on('scroll', function () {
      if ($('.chatsDiv').scrollTop() < 5) {
        this.page += 1;
        this.getMoreComments();
      }
    }.bind(this));

    this.getMoreComments();

    this.CrudService.add({
      "user_id": localStorage.getItem('Userid'),
    }, 'myorder').subscribe(orderResp => {
      this.orders = orderResp.data;

    });

	this.CrudService.add({
      "user_id": localStorage.getItem('Userid'),
    }, 'buyer_myorder').subscribe(orderResp => {
      this.buyer_orders = orderResp.data;

    });
    this.get_coupons();
    this.get_playlist_track();
    this.get_playlist();
	this.get_favourite_track();
	this.get_history_track();
    this.get_address();
    this.loginSession();
    this.EmbeddedSettingDataForm = this.formBuilder.group({
      background_color: '',
      font_color: '',
      button_color: '',
      google_analytics: '',
      facebook_pixles: ''
    });

    this.DataForm = this.formBuilder.group({
      name: '',
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      biography: ['', [Validators.required]]
    });

    this.socialForm = this.formBuilder.group({
      facebook_link: '',
      twitter_link: '',
      insta_link: '',
      soundcloud: '',
      youtube: '',
      twitch: ''
    });

    let params = {
      "Userid": localStorage.getItem('Userid'),
    };

    this.CrudService.add(params, 'getEmbedSetting').subscribe(data => {
      if (data && data.status) {
        this.info = data['data'];
      this.embeddedlogo = this.info.embeddedlogo
      this.alluploadedLogo = data['data'];

      /*this.EmbeddedSettingDataForm.setValue(
       {
         background_color:this.info.background_color,
     font_color: this.info.font_color,
         button_color: this.info.button_color,
     google_analytics: this.info.google_analytics,
         facebook_pixles: this.info.facebook_pixles
        
     });*/
      this.EmbeddedSettingDataForm.patchValue(this.info);
      }
    });
    this.CrudService.add(params, 'profile').subscribe(data => {
      if(data && data.status) {
        this.info = data['data'];
      this.profileimg = this.info.profileimg

      this.DataForm.setValue(
        {
          first_name: this.info.first_name,
          last_name: this.info.last_name,
          name: this.info.name,
          location: this.info.location,
          biography: this.info.biography
          //biography: data.data[0].biography

        });
      this.socialForm.setValue(
        {
          facebook_link: this.info.facebook_link,
          twitter_link: this.info.twitter_link,
          insta_link: this.info.insta_link,
          soundcloud: this.info.soundcloud,
          youtube: this.info.youtube,
          twitch: this.info.twitch

        });
      }
    });

    ////////////////Address Form//////////////
    this.address_book_from = this.formBuilder.group({
      id: '',
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9_-]{10}")]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]]
    });
    ////////////////End Address Form//////////////

    let prm = { "user_id": localStorage.getItem('Userid'), "type": "0" };
    this.CrudService.add(prm, 'getGalleryImage').
      subscribe(data => {
        this.alluploaded = data['data'];
        //this.profileimg =data['data'];
        this.imgpath = data.imgpath;
      }
      )

  }


  get f() { return this.DataForm.controls; }

  onSubmit() {
    console.log(this.DataForm.controls['location'].value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.DataForm.invalid) {
      return;
    }
    var prm = this.DataForm.value;
    prm.Userid = localStorage.getItem('Userid');
    this.loading = true;
    this.CrudService.add(prm, 'updateProfile')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            //   this.alertService.success(data.message, true);
            this.PostService.snakeMessage(data.message, 'OK');
          }
          else if (data.status == false) {
            this.PostService.snakeMessage(data.message, 'OK');
            // this.alertService.error(data.message);
          }

        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }


  get f1() { return this.socialForm.controls; }
  onSubmitsocial() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.socialForm.invalid) {
      return;
    }
    var prm = this.socialForm.value;
    prm.Userid = localStorage.getItem('Userid');
    this.loading = true;
    this.CrudService.add(prm, 'updatesocial')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            this.PostService.snakeMessage(data.message, 'OK');
            //this.alertService.success(data.message, true);

          }
          else if (data.status == false) {
            this.PostService.snakeMessage(data.message, 'OK');
            //  this.alertService.error(data.message);
          }

        },
        error => {
          this.PostService.snakeMessage(error, 'OK');
          // this.alertService.error(error);
          this.loading = false;
        });
  }


  ////////////////////////Logout USER//////////////////
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get_coupons(searchValue = '') {
    let params = {
      "user_id": localStorage.getItem('Userid'),
      "search_coupon": searchValue
    };
    this.CrudService.add(params, 'coupons').subscribe(data => {
      this.coupons = data['data'];

    });
  }



  get_playlist() {
    let params = {
      "user_id": localStorage.getItem('Userid'),
      "feature_type": 0
    };
    this.CrudService.add(params, 'playlist').subscribe(data => {
      this.playlistTitle = data['data'];
      //console.log(this.list.length);
    });

  }

  get_playlist_track(playlistId = 0, searchValue = '') {
    let params = {
      "user_id": localStorage.getItem('Userid'),
      "playlistId": playlistId,
      "search_track": searchValue,
      "feature_type": 0
    };
    this.CrudService.add(params, 'playlist_track').subscribe(data => {
      this.playlist = data['data'];
      //console.log(this.list.length);
    });

  }

  getPlaylistPage(page: number) {
    this.playlistpage = page;

  }

  getPlaylistTrack(playlistId: number, searchValue: string): void {
    this.get_playlist_track(playlistId, searchValue);

  }

  deletePlaylist(playlist) {

    if (confirm('Do you really want to delete this')) {
      var params = {
        "id": playlist.id
      };
      this.CrudService.list(params, 'deleteprod').subscribe(data => {
        if (data.status) {
          const index: number = this.playlistTitle.indexOf(playlist);
          if (index !== -1) {
            this.playlistTitle.splice(index, 1);
          }
          console.log(playlist);
        }
      });
    }


  }

	get_favourite_track(searchValue = '') {
    let params = {
      "user_id": localStorage.getItem('Userid'),
	  "search_track": searchValue,
    };
    this.CrudService.add(params, 'liketrackhistory').subscribe(data => {
      this.favoritelist = data['data'];
      //console.log(this.list.length);
    });

  }
	getFavouriteTrack(searchValue: string): void {
    this.get_favourite_track(searchValue);

  }

	get_history_track(searchValue = '') {
    let params = {
      "user_id": localStorage.getItem('Userid'),
	  "search_track": searchValue,
    };
    this.CrudService.add(params, 'trackhistory').subscribe(data => {
      this.historylist = data['data'];
      //console.log(this.list.length);
    });

  }
	getHistoryTrack(searchValue: string): void {
    this.get_history_track(searchValue);

  }

	open_close_modal_download(open_modal_id,close_modal_id,qty,prd){
    
    this.selected_product_download=prd;
    setTimeout(() => {
      $('#myModalDownload'+open_modal_id).modal('toggle');
    }, 200);

  }

	downloadFile(data,i){
		let url1='';
		let FileName='';
		let FileType='';
		let path='public/uploads/music/';
		let user_id=localStorage.getItem('Userid');
		
		if(user_id=='')
		{
			if(data.guest_downloads==1)
			{
				/*Allow Anonymous Guest Downloads*/
				FileType='audio/mp3; charset=utf-8';
				url1=path+data.audio;
				FileName=data.audio;
				this.downloadFiles(url1,FileType,FileName,data.id);
			}
		}else{
			
			if(data.download_options==1){
				/*Yes, untagged (MP3 Version - 320kbps)*/
				FileType='audio/mp3; charset=utf-8';
				
				this.CrudService.list({"trackId":data.id,"downloadType" :data.download_options,"fileType" :'mp3'}, 'getMusicGallery').subscribe(res => {
					if (res.status) {
						//url1=res.path+res.data.image;
						url1=path+res.data.image;
						FileName=res.data.image;
						this.downloadFiles(url1,FileType,FileName,data.id);
					} 
				});
			}else if(data.download_options==2){
				/*Yes, with voice tag (MP3 Version)*/
				FileType='application/x-zip-compressed; charset=utf-8';
				
				this.CrudService.list({"trackId":data.id,"downloadType" :data.download_options,"fileType" :'zip'}, 'getMusicGallery').subscribe(res => {
					if (res.status) {
						//url1=res.path+res.data.image;
						url1=path+res.data.image;
						FileName=res.data.image;
						this.downloadFiles(url1,FileType,FileName,data.id);
					} 
				});
				
			}else if(data.download_options==3){ 
				/*Yes, untagged (MP3 Version - 320kbps)*/
				FileType='audio/mp3; charset=utf-8';
				
				this.CrudService.list({"trackId":data.id,"downloadType" :data.download_options,"fileType" :'mp3'}, 'getMusicGallery').subscribe(res => {
					
					if (res.status) {
						//url1=res.path+res.data.image;
						url1=path+res.data.image;
						FileName=res.data.image;
						this.downloadFiles(url1,FileType,FileName,data.id);
					} 
				});
			}
		}
		
	}
	
	downloadFiles(url1,downloadType,FileName,TrackId){
		
		/*this.CrudService.getTrackUrl(url1).subscribe(response => {
				let blob:any = new Blob([response], { type: downloadType });
				const url = window.URL.createObjectURL(blob);
				fileSaver.saveAs(blob, FileName);
			}), error => console.log('Error downloading the file'),
					 () => console.info('File downloaded successfully');*/
					
		let  params={
		  "user_id":localStorage.getItem('Userid'),
		  "track_id":TrackId,
		  "url":url1
		};
		this.CrudService.add(params,'downloadEmailTrack').subscribe(data => {
			this.PostService.snakeMessage(data['message'],'');
		});
	}

		/* Order download Files */
	OrderdownloadFile(data,i){
		let url1='';
		let FileName='';
		let FileType='';
		let path='public/uploads/music/';
		let user_id=localStorage.getItem('Userid');
		console.log("down",data)
		if(user_id=='')
		{
			if(data.guest_downloads==1)
			{
				/*Allow Anonymous Guest Downloads*/
				FileType='audio/mp3; charset=utf-8';
				url1=path+data.audio;
				FileName=data.audio;
				this.OrderdownloadFiles(url1,FileType,FileName,data.id);
			}
		}else{
			
			if(data.download_options==1){
				/*Yes, untagged (MP3 Version - 320kbps)*/
				FileType='audio/mp3; charset=utf-8';
				
				this.CrudService.list({"trackId":data.id,"downloadType" :data.download_options,"fileType" :'mp3'}, 'getMusicGallery').subscribe(res => {
					if (res.status) {
						//url1=res.path+res.data.image;
						url1=path+res.data.image;
						FileName=res.data.image;
						this.OrderdownloadFiles(url1,FileType,FileName,data.id);
					} 
				});
			}else if(data.download_options==2){
				/*Yes, with voice tag (MP3 Version)*/
				FileType='application/x-zip-compressed; charset=utf-8';
				
				this.CrudService.list({"trackId":data.id,"downloadType" :data.download_options,"fileType" :'zip'}, 'getMusicGallery').subscribe(res => {
					if (res.status) {
						//url1=res.path+res.data.image;
						url1=path+res.data.image;
						FileName=res.data.image;
						this.OrderdownloadFiles(url1,FileType,FileName,data.id);
					} 
				});
				
			}else if(data.download_options==3){ 
				/*Yes, untagged (MP3 Version - 320kbps)*/
				FileType='audio/mp3; charset=utf-8';
				
				this.CrudService.list({"trackId":data.id,"downloadType" :data.download_options,"fileType" :'mp3'}, 'getMusicGallery').subscribe(res => {
					
					if (res.status) {
						//url1=res.path+res.data.image;
						url1=path+res.data.image;
						FileName=res.data.image;
						this.OrderdownloadFiles(url1,FileType,FileName,data.id);
					} 
				});
			}
		}
		
	}
	
	OrderdownloadFiles(url1,downloadType,FileName,TrackId){
		
		this.CrudService.getTrackUrl(url1).subscribe(response => {
				let blob:any = new Blob([response], { type: downloadType });
				const url = window.URL.createObjectURL(blob);
				fileSaver.saveAs(blob, FileName);
			}), error => console.log('Error downloading the file'),
					 () => console.info('File downloaded successfully');
					
		/*let  params={
		  "user_id":localStorage.getItem('Userid'),
		  "track_id":TrackId,
		  "url":url1
		};
		this.CrudService.add(params,'downloadEmailTrack').subscribe(data => {
			this.PostService.snakeMessage(data['message'],'');
		});*/
	}
		/* Order download Files Ends */

	 get df() { return this.downloadForm.controls; }
	
	downloaderEmail(product,i){
		
		this.df_submitted = true;
		this.df_success = false;
		
		if (this.downloadForm.invalid) {
            return;
        }
		this.loading = true;
		
		this.CrudService.add({
			  "product_id": product.id,
			  "email": this.df.email.value 
		  }
		,'downloaderEmail').subscribe(res => {
			if(res.status){
				//this.products[i].isIamLiking=!data.isIamLiking;
				this.df_success = true;
				this.downloadForm.reset();
				this.downloadFile(product,i);
			
			}
			this.PostService.snakeMessage(res.msg,'');
		});
	}
	followapi(product,i)
	{
		this.CrudService.add({
                "user_id": localStorage.getItem('Userid') || 0,
                "following_id": product.artist_id,
                "method": !product.isIamFollowing
                }
          ,'followUnfollow').subscribe(res => {
            if(res.status){
              this.downloadFile(product,i);
            }
            this.PostService.snakeMessage(res.msg,'');
          });
	}

  deleteCoupons(coupon) {

    if (confirm('Do you really want to delete this')) {
      var params = {
        "id": coupon.id
      };
      this.CrudService.list(params, 'deletecoupon').subscribe(data => {
        if (data.status) {
          const index: number = this.coupons.indexOf(coupon);
          if (index !== -1) {
            this.coupons.splice(index, 1);
          }
          console.log(coupon);
        }
      });
    }


  }

  ///////////////////////////////Address//////////////////////////

  get_address() {
    let params = { "Userid": localStorage.getItem('Userid') };
    this.CrudService.add(params, 'address').subscribe(data => {
      this.address = data['data'];
      // console.log(this.address);
    });

  }


  delete(id) {
    if (confirm("Want to delete confirm")) {
      let params = {
        "Userid": localStorage.getItem('Userid'),
        "id": id
      };
      this.CrudService.add(params, 'deleteAddress').subscribe(data => {
        if (data.status == true) {
          this.get_address();
          if (localStorage.getItem('user_selected_delivery_address')) {
            var select_shipping_id = localStorage.getItem('selected_address');
            if (select_shipping_id == id) {
              localStorage.removeItem("selected_address");
            }
          }

          this.PostService.snakeMessage(data.message, '');
        } else {
          this.PostService.snakeMessage(data.message, '');
        }

      });
    }
  }





  edit(id) {
    this.api_calling = false;
    this.isShow = true;
    if (confirm("Want to edit confirm")) {
      this.address_id = id;
      let query_params = {
        "user_id": localStorage.getItem('Userid'),
        "address_id": id
      };
      this.CrudService.add(query_params, 'address').subscribe(data => {
        if (data.status == true) {
          this.address_mode = true;
          // console.log(data.data[0].shipping_name);

          this.address_book_from.setValue(
            {
              id: data.data[0].id,
              name: data.data[0].shipping_name,
              phone: data.data[0].shipping_mobile,
              email: data.data[0].shipping_email,
              address: data.data[0].shipping_address
            });

          // this.PostService.snakeMessage(data.message,'success');     
          // $('html, body').animate({scrollTop:500},'50');
        } else {

          this.PostService.snakeMessage(data.message, 'ok');
        }

      });
    }
  }

  add_address(e) {
    if (e) e.preventDefault();
    if (!this.address_book_from.valid) {
      this.address_book_from.markAsTouched();
      return;
    }
    this.api_calling = true;

    var prm = this.address_book_from.value;
    prm.Userid = localStorage.getItem('Userid');
    this.CrudService.add(prm, 'addAddress').subscribe(data => {
      this.api_calling = false;
      if (data.status == true) {

        this.address_book_from.reset();
        this.get_address();
        this.PostService.snakeMessage(data.message, 'success');
      } else {
        this.PostService.snakeMessage(data.message, 'Danger');
      }

    });

  }
  update_address(e) {
    if (e) e.preventDefault();

    if (!this.address_book_from.valid) {
      this.address_book_from.markAsTouched();
      return;
    }

    this.api_calling = true;
    var prm = this.address_book_from.value;
    prm.Userid = localStorage.getItem('Userid');

    this.CrudService.add(prm, 'updateAddress').subscribe(data => {
      this.api_calling = false;
      if (data.status == true) {

        this.address_book_from.reset();
        this.get_address();
        this.address_mode = false;
        this.address_id = 0;
        this.PostService.snakeMessage(data.message, 'success');
        // this.pageSerice.snakeMessage(data.msg,'success');
        // $('html, body').animate({scrollTop:0},'50');
      } else {
        this.PostService.snakeMessage(data.message, 'Danger');
      }

    });

  }



  onSubmitembeddedSetting_api_calling() {

    this.submitted = true;

    // stop here if form is invalid
    /*if (this.EmbeddedSettingDataForm.invalid) {
        return;
    }*/

    var prm = this.EmbeddedSettingDataForm.value;
    console.log(prm);
    prm.Userid = localStorage.getItem('Userid');
    this.loading = true;
    this.CrudService.add(prm, 'EmbedSetting')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            this.PostService.snakeMessage(data.message, 'OK');
            //this.alertService.success(data.message, true);

          }
          else if (data.status == false) {
            this.PostService.snakeMessage(data.message, 'OK');
            //  this.alertService.error(data.message);
          }

        },
        error => {
          this.PostService.snakeMessage(error, 'OK');
          // this.alertService.error(error);
          this.loading = false;
        });
  }

  saveEmbedLogo() {
    let params = {
      "image": this.croppedImage,
      //"prd_id":this.route.snapshot.paramMap.get('url'),
      "user_id": localStorage.getItem('Userid'),
      "type": "0"
    };

    this.CrudService.add(params, 'EmbedLogo')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            this.PostService.snakeMessage(data.message, 'Danger');
            //   this.alertService.success(data.message, true);
            this.embeddedlogo = data.image;
            this.alluploadedLogo = data['data'];
            //this.profileimg =data['data'];
            this.imgpath1 = data.imgpath1;

            $('#CropEmbedLogo').modal('hide');
          }
          else if (data.status == false) {
            this.PostService.snakeMessage(data.message, 'Danger');
            // this.alertService.error(data.message);
          }

        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

  }

  saveImage() {

    let params = {
      "image": this.croppedImage,
      //"prd_id":this.route.snapshot.paramMap.get('url'),
      "user_id": localStorage.getItem('Userid'),
      "type": "0"
    };


    this.CrudService.add(params, 'imageGallery')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            this.PostService.snakeMessage(data.message, 'Danger');
            //   this.alertService.success(data.message, true);
            this.profileimg = data.image;
            this.alluploaded = data['data'];
            //this.profileimg =data['data'];
            this.imgpath = data.imgpath;
            $('#CropPhoto').modal('hide');
          }
          else if (data.status == false) {
            this.PostService.snakeMessage(data.message, 'Danger');
            // this.alertService.error(data.message);
          }

        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  selectGallery(id, type) {
    let params = {
      "id": id,
      "flag": type,
      "user_id": localStorage.getItem('Userid'),
      "type": "0"
    };

    this.CrudService.add(params, 'GalleryImagedelete')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            this.PostService.snakeMessage(data.message, 'Danger');
            //this.alertService.success(data.message, true);
            $('#uploadArtWork').modal('hide');
            // this.image=data.image;
            this.CrudService.add(params, 'getGalleryImage').
              subscribe(data => {
                this.alluploaded = data['data'];
                //this.profileimg =data['data'];
                this.imgpath = data.imgpath;
              }
              )
            this.profileimg = data.image;
          }
          else if (data.status == false) {
            this.PostService.snakeMessage(data.message, 'Danger');
            //  this.alertService.error(data.message);
          }

        },
        error => {
          this.alertService.error(error);
          // this.loading = false;
        });
  }
  ////////////////////////////////////Login Session//////////////////////////
  loginSession() {
    let params = { "Userid": localStorage.getItem('Userid') };
    this.CrudService.add(params, 'sessionList').subscribe(data => {
      this.sessionlist = data['data'];
    });
  }
  logoutSession(id = '') {
    let params = { "id": id, "user_id": localStorage.getItem('Userid') };
    this.CrudService.add(params, 'sessionLogout').subscribe(data => {
      this.loginSession();
    });
  }


}
