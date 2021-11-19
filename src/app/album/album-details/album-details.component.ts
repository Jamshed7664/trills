
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,UrlSerializer, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray} from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import {DataService} from 'src/app/common_service/data.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { PostService } from 'src/app/post.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Headers } from '@angular/http';
import { CartService } from 'src/app/common_service/cart.service';
import { FollowService } from 'src/app/common_service/follow.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
  import { Observable } from 'rxjs/Observable';
  import 'rxjs/add/operator/map';
  import 'rxjs/add/operator/debounceTime';
  import 'rxjs/add/operator/distinctUntilChanged';
  import 'rxjs/add/operator/switchMap';
  
  import * as fileSaver from 'file-saver';
  

declare var $: any;
@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.css']
})
export class AlbumDetailsComponent implements OnInit {

    albumId=0;
    //view_type=0;
	view_type;
	current_path: any = '';
    tracks:any=[];
    album:any;
    playlistTitle:any[];
	selected_product:any;
    selected_product_share:any;
	selected_product_download:any;
	selected_product_playlist:any;
	selected_album_msg:any;
	licenses:any;
    currency:any;
	
	fans=[];
	data_fan=[];
	page_fan:any=1;
	totalPage_fan:any=1;
	
	comments=[];
	data=[];
	page:any=1;
	totalPage:any=1;
	
	createMessageForm: FormGroup;
	updatePlaylistForm: FormGroup;
	createPlaylistForm: FormGroup;
	downloadForm: FormGroup;
	loading = false;
	submitted = false;
	df_success=false;
	csubmitted = false;
	cpf_success=false;
	upf_success=false;
	cmsubmitted = false;
	cmf_success=false;
	isChecked: boolean = false;
	selectedPlaylist: FormArray;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
	private serializer: UrlSerializer,
    private router: Router,
    public CartService: CartService,
	public dataService:DataService,
	private FollowService: FollowService,	
    private postService: PostService,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService:CrudService,
    private config: ConfigService,
    private http: Http  ) {
		this.router.events.subscribe((event: Event) => {
		  if (event instanceof NavigationEnd) {
			const queryParams = {};
			const tree = this.router.createUrlTree([], { queryParams });
			this.current_path = serializer.serialize(tree);
			this.apicall();
		  }
		});
      this.currency = this.postService.currency();
  }
  
  likeUnlikeAlbum(followingData){
      
	     //this.FollowService.followingUnfollowing(followingData);  
		this.CrudService.add({
                "user_id": localStorage.getItem('Userid') || 0,
                /*"following_id": followingData.artist_id,*/
				"following_id": followingData.product_id,
				"method": !followingData.isIamFollowing
                }
          ,'album_likeUnlike').subscribe(res => {
            if(res.status){
              this.album.likeCount+=(followingData.isIamFollowing)?-1:1;
              this.album.isIamFollowing=!followingData.isIamFollowing;
              
            }
            this.postService.snakeMessage(res.msg,'');
          });
  }
  
   likeunLike(data,i){
    this.CrudService.add({
      "user_id": localStorage.getItem('Userid'),
      "like_id": data.id,
      "likeWhat": 0,
      "method": !data.isIamLiking
      }
,'likeUnlike').subscribe(res => {
  if(res.status){
    this.album.tracks[i].isIamLiking=!data.isIamLiking;
    
  }
  this.postService.snakeMessage(res.msg,'');
});
  }
  
    downloadFile(data,i){
		let url1='';
		let FileName='';
		let FileType='';
		let path='public/uploads/music/';
		let user_id=localStorage.getItem('Userid');
		
		if(!user_id)
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
			this.postService.snakeMessage(data['message'],'');
		});
	}
	
	// convenience getter for easy access to form fields
    get df() { return this.downloadForm.controls; }
	get cpf() { return this.createPlaylistForm.controls; }
	get upf() { return this.updatePlaylistForm.controls; }
	get cmf() { return this.createMessageForm.controls; }
	
	downloaderEmail(product,i){
		
		this.submitted = true;
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
			this.postService.snakeMessage(res.msg,'');
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
            this.postService.snakeMessage(res.msg,'');
          });
	}
	
	get_playlist(){
		let  params={
		  "user_id":localStorage.getItem('Userid'),
		  "feature_type":0
		};
		this.CrudService.add(params,'playlist').subscribe(data => {
		  this.playlistTitle =data['data'];
		 //console.log(this.list.length);
		});
  
	}
	createPlaylist(product)
	{
		this.csubmitted = true;
		this.cpf_success = false;
		
		if (this.createPlaylistForm.invalid) {
            return;
        }
		this.loading = true;
		
		this.CrudService.add({
			  "Userid":localStorage.getItem('Userid'), 
			  "flag":1,
			  "tracks":product.id,
			  "name":this.cpf.playlistName.value 
		  }
		,'addUpdatePlaylist').subscribe(res => {
			if(res.status){
				//this.products[i].isIamLiking=!data.isIamLiking;
				this.cpf_success = true;
				this.createPlaylistForm.reset();
				this.get_playlist();
			}
			this.postService.snakeMessage(res.msg,'');
		});
	}
	
	updatePlaylist(product)
	{
		this.submitted = true;
		this.upf_success = false;
		this.loading = true;
		
		var dataPlay=this.updatePlaylistForm.value.selectedPlaylist;
		
		for (let n = 0; n < dataPlay.length; n++) {
			$("#checkbox"+dataPlay[n]).prop("checked", false);
			this.CrudService.add({
				  "Userid":localStorage.getItem('Userid'), 
				  "flag":2,
				  "tracks":product.id,
				  "playlistId":dataPlay[n]
			  }
			,'addUpdatePlaylist').subscribe(res => {
				 let i: number = 0;
				  this.selectedPlaylist.controls.forEach((item: FormControl) => {
					if (item.value == dataPlay[n]) {
					  this.selectedPlaylist.removeAt(i);
					}
					i++;
				  });
				if(dataPlay.length-1==n)
				{
					if(res.status){
						this.upf_success = true;
					}
					this.postService.snakeMessage(res.msg,'');
				}
			});
		}
	}
	
	onCheckboxChange(e) {
		
		this.selectedPlaylist = this.updatePlaylistForm.get('selectedPlaylist') as FormArray;
		
		if (e.target.checked) {
		  this.selectedPlaylist.push(new FormControl(e.target.value));
		} else {
		  let i: number = 0;
		  this.selectedPlaylist.controls.forEach((item: FormControl) => {
			if (item.value == e.target.value) {
			  this.selectedPlaylist.removeAt(i);
			  return;
			}
			i++;
		  });
		}
	}
	
	deleteComment(com,i){
       this.CrudService.add({
          "id": com.id
          }
      ,'deleteTheComment').subscribe(res => {
      if(res.status){
      this.comments.splice(i,1);
      }else{
      this.postService.snakeMessage(res.msg,'');
      }
      });
   }
	
	createMessage(album){
		
		this.cmsubmitted = true;
		this.cmf_success = false;
		
		if (this.createMessageForm.invalid) {
            return;
        }
		this.loading = true;
		
		this.CrudService.add({
			  "Userid":localStorage.getItem('Userid'), 
			  "flag":'album',
			  "receiveUser":album.artist_id,
			  "product_id":album.product_id,
			  "message":this.cmf.messageBox.value 
		  }
		,'addMessage').subscribe(res => {
			if(res.status){
				//this.products[i].isIamLiking=!data.isIamLiking;
				this.cmf_success = true;
				this.createMessageForm.reset();
			}
			this.postService.snakeMessage(res.msg,'');
		});
	}
	
	open_close_modal_share(open_modal_id,close_modal_id,qty,prd){
    
		this.selected_product_share=prd;
		setTimeout(() => {
			$('#myModalshare'+open_modal_id).modal('toggle');
		}, 200);
		
	}
	open_close_modal_download(open_modal_id,close_modal_id,qty,prd){
    
		this.selected_product_download=prd;
		setTimeout(() => {
			$('#myModalDownload'+open_modal_id).modal('toggle');
		}, 200)
	}
	open_close_modal_playlist(open_modal_id,close_modal_id,qty,prd){
    
		this.selected_product_playlist=prd;
		setTimeout(() => {
			$('#myModalPlaylist'+open_modal_id).modal('toggle');
		}, 200);
		
	}
	open_close_modal_message(open_modal_id,close_modal_id,qty,album){
    
		this.selected_album_msg=album;
		setTimeout(() => {
			$('#myModalMessage'+open_modal_id).modal('toggle');
		}, 200);
		
	}
  
  postComment(comment,data_id){
    if(comment){

      this.CrudService.add({
        "user_id": localStorage.getItem('Userid') || 0,
        "data_id": data_id ,
        "date_for":1,
        "comment": comment
        }
  ,'commentOnthis').subscribe(res => {
      this.comments.unshift(res.data);
      $('#commentBox').val('');
      this.postService.snakeMessage(res.msg,'');
  });
    }else{
      this.postService.snakeMessage('Plz type a comment','');
    }
   }
  
   
  add_to_cart(qty: any, product: any) {
    var item = {
      "product_id": product.id,
      "qty": qty,
      "license":0
    };
    this.CartService.addToCart(item);
  }
  add_to_cart2(qty: any, product: any,lncs) {
    var item = {
      "product_id": product.id,
      "qty": qty,
      "license":lncs
    };
    this.CartService.addToCart(item);
	$('#myModalprocess1').modal('hide');
  }

   
  
  open_close_modal(open_modal_id,close_modal_id,qty,prd){
    
    if(close_modal_id!=0){
      $('#myModalprocess'+close_modal_id).modal('hide');
    }
    if(open_modal_id!=0){
      this.selected_product=prd;
      var params = {
        "trackId": prd.id
      };
    
      this.CrudService.add(params, 'track_licenses').subscribe(data => {
        this.licenses=data.data;
        if (data.success) {
			setTimeout(() => {
				$('#myModalprocess'+open_modal_id).modal('toggle');
			}, 200);
          
        }else{
          this.postService.snakeMessage(data.msg,'');
        }
      });

      
    }
}

apicall()
{
	let customer_id=localStorage.getItem('Userid') || 0;
	
    this.albumId=this.route.snapshot.params.id;
    this.view_type=this.route.snapshot.params.type;
      this.CrudService.list({"albumId":this.albumId,"customer_id" :customer_id}, 'getAlbum').subscribe(res => {
          if (res.status) {
          var rs=res.data;
          this.album=rs;
		  

          } else {

          }
      });
}

getMoreComments(){
     if(this.totalPage >= this.page){
          this.CrudService.add({
            "user_id": localStorage.getItem('Userid') || 0,
            "objectId":this.albumId,
            "objectType": 1,
            "page":this.page
          }
      ,'getObjectComment').subscribe(res => {
            this.totalPage=res.total_page;
            this.data = this.data.concat(res.data);
            this.dataService.commonData.next(this.data);  
      });
     }  
 }
 getMoreFans(){
     if(this.totalPage_fan >= this.page_fan){
          this.CrudService.add({
            "user_id": localStorage.getItem('Userid') || 0,
            "objectId":this.albumId,
            "page":this.page
          }
      ,'getObjectFan').subscribe(res => {
            this.totalPage_fan=res.total_page;
            this.data_fan = this.data.concat(res.data);
            this.dataService.commonData.next(this.data_fan);  
      });
     }  
 }

  ngOnInit(): void {
       
	
	this.dataService.commonData.subscribe(commonData => {
        this.comments=commonData;
      });
	  
	this.dataService.commonData.subscribe(commonData => {
        this.fans=commonData;
      });
	
	this.downloadForm = this.formBuilder.group({
		email: ['', Validators.required]
	});
	this.createMessageForm = this.formBuilder.group({
		messageBox: ['', Validators.required]
	});
	this.createPlaylistForm = this.formBuilder.group({
		playlistName: ['', Validators.required]
	});
	/*this.updatePlaylistForm = this.formBuilder.group({
		selectedPlaylist: ['', Validators.required]
	});*/
	
	this.updatePlaylistForm = this.formBuilder.group({
	  selectedPlaylist: this.formBuilder.array([], [Validators.required])
	});
	
	this.get_playlist();
	this.getMoreComments();
	this.getMoreFans();
  }
  
  playTrack(tracks, index) {
    if(tracks.length>0) {
      this.CartService.setAllTracks(tracks,'tracks', index)
    }
  }

}
