
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray} from '@angular/forms';
import { PostService } from 'src/app/post.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { variable } from '@angular/compiler/src/output/output_ast';
import { PageService } from 'src/app/common_service/page.service';
import { ActivatedRoute, UrlSerializer, UrlTree, UrlSegmentGroup, DefaultUrlSerializer, UrlSegment, Router } from '@angular/router';
import { CrudService } from 'src/app/common_service/crud.service';
import {DataService} from 'src/app/common_service/data.service';
import { BehaviorSubject, Observable, Subject, Subscriber } from 'rxjs';
import { CartService } from 'src/app/common_service/cart.service';
import {SocialService } from 'src/app/common_service/socialservice';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';

declare var $: any;

@Component({
  selector: 'app-service-list-front',
  templateUrl: './service-list-front.component.html',
  styleUrls: ['./service-list-front.component.css']
})

export class ServiceListFrontComponent implements  OnInit, AfterViewInit {
  products: any[]; currency; attrib; cart; url; type;
  videos: any[];
  service_url;
  searchType="";
  search="";
  artist:any={
      "name": "",
      "artist_id": "",
      "profile_pic": "",
      "follower": "",
      "fans": "",
      "players": "",
      "facebook_link": "",
      "twitter_link": "",
      "insta_link": "",
      "trackCount": 0,
      "isIamFollowing":0,
      "profilePic": ""
  };
  moods: any = [
    { id: 1, name: 'Quickrly',url: 'Quickrly' },
    { id: 2, name: 'Relaxed',url: 'Relaxed' },
    { id: 3, name: 'Dark',url: 'Dark' },
    { id: 4, name: 'Powerfull' ,url: 'Powerfull'},
    { id: 5, name: 'Neautral',url: 'Neautral' },
    { id: 6, name: 'Angry',url: 'Angry' },
    { id: 7, name: 'Romantic' ,url: 'Romantic'},
    { id: 8, name: 'Energetic',url: 'Energetic' },
    { id: 9, name: 'Tense',url: 'Tense' },
    { id: 10, name: 'Sad',url: 'Sad' },
    { id: 11, name: 'Scary' ,url: 'Scary'},
    { id: 12, name: 'Happy',url: 'Happy' },
    { id: 13, name: 'Dramatic',url: 'Dramatic' },
    { id: 14, name: 'Exiting',url: 'Exiting' },
    { id: 15, name: 'Majestic' ,url: 'Majestic'}
  ];
  beats: any = [
    { id: 1, name: 'Beat' ,url:'Beat'},
    { id: 2, name: 'Song' ,url:'Song'},
    { id: 3, name: 'With chorus' ,url:'With-chorus'},
    { id: 4, name: 'Vocals' ,url:'Vocals'},
    { id: 5, name: 'Top line',url:'Top-line' }
  ];
  licenses:any=[];
  selected_product:any;
  
  tracks:any=[];
    playlistTitle:any[];
	selected_product_share:any;
	selected_product_download:any;
	selected_product_playlist:any;
	
  
  categories: any = [];
  selectedCats: any = [];
  selectedTracks: any = [];
  selectedMoods: any = [];
  moreCats = false;
  moreMoods = false;
  moreBeats = false;
  called=true;
  page: any = 1;
  totalRec: any;
  sort_by: any = 1;
  current_path: any = '';
  priceChange: any = false;
  filterApplied: any = false;
  c_max_price: any = 0;
  c_min_price: any = 0;
  max_price: any = 0;
  min_price: any = 0;
  user_id:any;
  
  comments=[];
  data=[];
  totalPage:any=1;
  serviceId=0;
  
  selected_album_msg:any;
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
	
  
  constructor(private formBuilder: FormBuilder,private router: Router, private serializer: UrlSerializer,
    public CartService: CartService, 
    private CrudService: CrudService, 
    private route: ActivatedRoute,
     private http: HttpClient,
	 public sanitizer: DomSanitizer,
     public socialservice:SocialService,
	 public dataService:DataService,
    private postService: PostService,
	private pageSerice: PageService, 
    private cookieService: CookieService) {
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
  
  trans_chann(videolink):any
  {
	  return this.sanitizer.bypassSecurityTrustResourceUrl(videolink);
  }
  
    
  followUNfollow(followingData){
      
          this.CrudService.add({
                "user_id": localStorage.getItem('Userid') || 0,
                "following_id": followingData.artist_id,
                "method": !followingData.isIamFollowing
                }
          ,'followUnfollow').subscribe(res => {
            if(res.status){
              this.artist.follower+=(followingData.isIamFollowing)?-1:1;
              this.artist.isIamFollowing=!followingData.isIamFollowing;
              
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
    this.products[i].isIamLiking=!data.isIamLiking;
    
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
   
  createMessage(service){
		
		this.cmsubmitted = true;
		this.cmf_success = false;
		
		if (this.createMessageForm.invalid) {
            return;
        }
		this.loading = true;
		
		this.CrudService.add({
			  "Userid":localStorage.getItem('Userid'), 
			  "flag":'service',
			  "receiveUser":service.artist_id,
			  "product_id":service.id,
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
	$('#myModalshare'+open_modal_id).modal('toggle');
  }
  
  open_close_modal_download(open_modal_id,close_modal_id,qty,prd){
    
    this.selected_product_download=prd;
	$('#myModalDownload'+open_modal_id).modal('toggle');
  }
  open_close_modal_playlist(open_modal_id,close_modal_id,qty,prd){
    
    this.selected_product_playlist=prd;
	$('#myModalPlaylist'+open_modal_id).modal('toggle');
  }
  
	open_close_modal_message(open_modal_id,close_modal_id,qty,album){
    
    this.selected_album_msg=album;
	$('#myModalMessage'+open_modal_id).modal('toggle');
  }
  
  postComment(comment,data_id){
    if(comment){

      this.CrudService.add({
        "user_id": localStorage.getItem('Userid') || 0,
        "data_id": data_id ,
        "date_for":2,
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
  }
  getPage(page: number) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { page: page },
        queryParamsHandling: 'merge'
      });
      this.page = page;
  }
  showhideCat() {
    this.moreCats = (this.moreCats) ? false : true;
  }
  showhideMood() {
    this.moreMoods = (this.moreMoods) ? false : true;
  }
  showhideBeats() {
    this.moreBeats = (this.moreBeats) ? false : true;
  }
  selectedFilterCats(type, id) {
    if (type == 0) {
      var n = this.selectedCats.includes(id);
      return n;
    }
    if (type == 1) {
      var n = this.selectedCats.includes(id);
      if (n) {
        return 'block';
      } else {
        return 'none';
      }
    }
  }
  selectedFilterTracks(type, id) {

    if (type == 0) {
      var n = this.selectedTracks.includes(id);
      return n;
    }
    if (type == 1) {
      var n = this.selectedTracks.includes(id);
      if (n) {
        return 'block';
      } else {
        return 'none';
      }
    }
  }
  selectedFilterMoods(type, id) {

    if (type == 0) {
      var n = this.selectedMoods.includes(id);
      return n;
    }
    if (type == 1) {
      var n = this.selectedMoods.includes(id);
      if (n) {
        return 'block';
      } else {
        return 'none';
      }
    }
  }

  setpriceRange(){
    $('#slider-range').slider().bind('slidechange', function (event, ui) {
      this.priceChange = true;
      this.c_min_price = $('.slider-time').text();
      this.c_max_price = $('.slider-time2').text();
      this.page = 1;
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: { max: this.c_max_price, min: this.c_min_price ,page:1},
          queryParamsHandling: 'merge'
        });
     
    }.bind(this));
  }
  ngAfterViewInit() {

    this.getFilters();
      setTimeout(()=>{
          this.setpriceRange();
      }, 1500);
  }
  getFilters() {
    let query_params = {};
    $.extend(query_params, { "category": this.current_path });
    let apisCallData = [
      {
        "url": "prices",
        "params": query_params
      }
    ];
    this.CrudService.handleMutipleCallAPI(apisCallData).subscribe(data => {
      if (data[0].status) {
        this.min_price = data[0].data.min;
        this.max_price = data[0].data.max;
        this.route.queryParams.subscribe(params => {
          if (params.hasOwnProperty('max')) {
            this.c_max_price = params.max;
          } else {
            this.c_max_price = this.max_price;
          }
          if (params.hasOwnProperty('min')) {
            this.c_min_price = params.min;
          } else {
            this.c_min_price = this.min_price;
          }
        });
        $("#slider-range").slider({
          range: true,
          min: parseInt(this.min_price),
          max: parseInt(this.max_price),
          step: 1,
          values: [parseInt(this.c_min_price), parseInt(this.c_max_price)],
          slide: function (e, ui) {
            var hours1 = Math.floor(ui.values[0]);
            $('.slider-time').html(hours1);
            var hours2 = Math.floor(ui.values[1]);
            $('.slider-time2').html(hours2);
          }
        });
      }
    });
  }
  setParams() {
    this.route.queryParams.subscribe(params => {

          var plength=Object.keys(params).length;
          if(plength>0){
            this.filterApplied=true;
          }
      if(params.hasOwnProperty('filters')){
          var filterString=params.filters;
          var filters_array = filterString.split(",");
          filters_array.forEach((val,index)=>{
                var n = val.search("cat");
                    if(n==0){
                      var str=val.replace('cat','')
                        this.selectedCats.push( (str) );
                      }
                var a = val.search("mood");
                  if(a==0){
                    var str=val.replace('mood','')
                      this.selectedMoods.push((str) );
                  }
            var v = val.search("trackType");
                if(v==0){
                  var str=val.replace('trackType','')
                    this.selectedTracks.push((str) );
                  }
          });
      }
      if (params.hasOwnProperty('sort_by')) {
        this.sort_by = params.sort_by;
      }
      if (params.hasOwnProperty('page')) {
        this.page = params.page;
      }
      if (params.hasOwnProperty('max')) {
        this.c_max_price = params.max;
        this.priceChange = true;
      } else {
        this.c_max_price = this.max_price;
      }
      if (params.hasOwnProperty('min')) {
        this.c_min_price = params.min;
        this.priceChange = true;
      } else {
        this.c_min_price = this.min_price;
      }
    });
  }
  
  getMoreComments(){
     if(this.totalPage >= this.page){
          this.CrudService.add({
            "user_id": localStorage.getItem('Userid') || 0,
            "objectId":this.serviceId,
            "objectType": 2,
            "page":this.page
          }
      ,'getObjectComment').subscribe(res => {
            this.totalPage=res.total_page;
            this.data = this.data.concat(res.data);
            this.dataService.commonData.next(this.data);  
      });
     }  
 }
  ngOnInit(): void {

    this.setParams();
    // this.apicall();
	
	this.dataService.commonData.subscribe(commonData => {
        this.comments=commonData;
    });
	  
    this.CartService.navData.subscribe(navData => {
      this.categories = navData;
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
	
	
	
	
  }
  sortBy(deviceValue) {
    this.page=1;
    this.sort_by = deviceValue;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { sort_by: deviceValue },
        queryParamsHandling: 'merge'
      });
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
            $('#myModalprocess'+open_modal_id).modal('toggle');
          }else{
            this.postService.snakeMessage(data.msg,'');
          }
        });

        
      }
  }

  send(e,url){
    console.log(e);
    console.log(url);
        this.page=1;
        var params={page:1};
      var facilitiesid = new Array();
      $( "input[name='checkbox[]']:checked" ).each( function()
      {
        facilitiesid.push( $(this).attr('id') );
      });

        if(facilitiesid.length>0){
          $.extend(params,{"filters":facilitiesid.toString()});
        }else{
          $.extend(params,{"filters":null});
        }
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: params,
          queryParamsHandling: 'merge'
        });
  }
  clearall() {
       
    $('.price-input').prop('checked',false);
    this.sort_by = 1;
    this.page = 1;
    this.priceChange = false;
    this.filterApplied = false;
    this.c_max_price = '';
    this.c_min_price = '';
    var $slider = $("#slider-range");
    $slider.slider("values", 0, this.min_price);
    $slider.slider("values", 1, this.max_price);
    this.router.navigate(
      [],
      {
        relativeTo: this.route
      });
  }
  
  apicall() {
      this.user_id=this.route.snapshot.params.id;
    this.type=this.route.snapshot.params.type;
	this.service_url=this.route.snapshot.params.name;
    var params = {
      "page": 1,
      "sort_by": 1,
      "type": this.type,
	  "url": this.service_url,
      "customer_id" :localStorage.getItem('Userid') || 0
    };

    if (this.user_id) {
      let user = {
        "user_id": this.user_id
      };
      $.extend(params, user);
    }
  
    this.CrudService.list(params, 'servicess').subscribe(data => {
		
      this.artist=data.artist;
      this.products = data.data;
	  this.videos = data.video;
      this.totalRec=data.count;
	  this.serviceId=data.artist.id;
	   
      if (data.status) {
      
      } else {
      }
    });
	
	this.get_playlist();
	this.getMoreComments();
  }
}
