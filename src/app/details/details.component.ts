import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
//import {OwlCarousel} from 'ngx-owl-carousel';
import { PostService } from 'src/app/post.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from 'src/app/common_service/cart.service';
import { variable } from '@angular/compiler/src/output/output_ast';
import { CrudService } from 'src/app/common_service/crud.service';
import { PageService } from 'src/app/common_service/page.service';
import { DataService } from 'src/app/common_service/data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})


export class DetailsComponent implements OnInit, AfterViewInit {
  type: any;
  userid = 0;
  tracks: any = [];
  product: any = {
    "productImage": "",
    "artistname": "",
    "name": "",
    "total_playes": "",
    "follower": "",
    "fans": "",
    "players": "",
    "BPM": ""
  };
  selected_product: any = {
    "artist_image": "",
    "price": 0
  };
  licenses: any;
  product_id: any; url; details; currency; attrib;
  products: any[];
  comments = [];
  data = [];
  page: any = 1;
  totalPage: any = 1;
  rcatid;
  videoList = [];
  youtubeLinks = [];
  relatedTracks = [];
  @ViewChild('selector') private elementName;
  selected_product_download: any;
  selected_product_playlist: any;
  selected_product_share: any;

  updatePlaylistForm: FormGroup;
  createPlaylistForm: FormGroup;
  downloadForm: FormGroup;

  loading = false;
  submitted = false;
  df_success = false;
  csubmitted = false;
  cpf_success = false;
  upf_success = false;
  isChecked: boolean = false;
  selectedPlaylist: FormArray;
  artists: any = [];
  albums: any = [];
  services: any = [];
  soundskits: any = [];
  playLists: any = [];
  playlistTitle: any[];
  constructor(private route: ActivatedRoute,
    private router: Router, private http: HttpClient,
    public CartService: CartService,
    private postService: PostService,
    public dataService: DataService,
    private CrudService: CrudService,
    private pageSerice: PageService,
    private cookieService: CookieService,
    public sanitizer: DomSanitizer,
    private formBuilder: FormBuilder) {

    this.url = this.route.snapshot.paramMap.get('url');
    this.currency = postService.currency();
    //  this.rcatid=38;
  }
  deleteComment(com, i) {
    this.CrudService.add({
      "id": com.id
    }
      , 'deleteTheComment').subscribe(res => {
        if (res.status) {
          this.comments.splice(i, 1);
        } else {
          this.postService.snakeMessage(res.msg, '');
        }
      });

  }
  postComment(comment, data_id) {
    if (comment) {

      this.CrudService.add({
        "user_id": localStorage.getItem('Userid') || 0,
        "data_id": data_id,
        "date_for": 0,
        "comment": comment
      }
        , 'commentOnthis').subscribe(res => {
          this.comments.unshift(res.data);
          $('#commentBox').val('');
          this.postService.snakeMessage(res.msg, '');
        });
    } else {
      this.postService.snakeMessage('Plz type a comment', '');
    }
  }

  add_to_cart(qty: any, product: any) {
    var item = {
      "product_id": product.id,
      "qty": qty,
      "license": 0
    };
    this.CartService.addToCart(item);
  }
  add_to_cart2(qty: any, product: any, lncs) {
    var item = {
      "product_id": product.id,
      "qty": qty,
      "license": lncs
    };
    this.CartService.addToCart(item);
	$('#myModalprocess1').modal('hide');
  }
  onOptionsSelected(value: string, i: any) {

    this.http
      .get('http://localhost/grocery/webservices/product_attrib_view/' + value)
      .subscribe(data => {

        // Read the result field from the JSON response.   
        this.attrib = data['data'];
        //console.log(this.attrib);
        this.details.getPrice.fld_product_cutting_price = this.attrib.fld_product_cutting_price;
        this.details.getPrice.fld_prd_price = this.attrib.fld_prd_price;

        this.products[i].getPrice.fld_product_cutting_price = this.attrib.fld_product_cutting_price;
        this.products[i].getPrice.fld_prd_price = this.attrib.fld_prd_price;


      })
  }
  ngAfterViewInit() {


    setTimeout(function () {
      $('.product-list').trigger("destroy.owl.carousel");
      $('.product-list').trigger("refresh.owl.carousel");

      /** OWL CAROUSEL**/
      $(".owl-carousel").each(function (index, el) {
        var config = $(this).data();
        config.navText = ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']; config.slideSpeed = "300"; config.paginationSpeed = "500";

        if ($(this).hasClass('owl-style2')) {
          config.animateOut = "fadeOut";
          config.animateIn = "fadeIn";
        }
        $(this).owlCarousel(config);
      });
      $(".owl-carousel").owlCarousel({
        autoplay: true,
        autoplayTimeout: 6000,
        autoplayHoverPause: true
      });



    }, 6000);


  }

  open_close_modal(open_modal_id, close_modal_id, qty, prd) {

    if (close_modal_id != 0) {
      $('#myModalprocess' + close_modal_id).modal('hide');
    }
    if (open_modal_id != 0) {
      this.selected_product = prd;
      var params = {
        "trackId": prd.id
      };

      this.CrudService.add(params, 'track_licenses').subscribe(data => {
        this.licenses = data.data;
        if (data.success) {
          setTimeout(() => {
            $('#myModalprocess' + open_modal_id).modal('toggle');
          }, 200);
          
        } else {
          this.postService.snakeMessage(data.msg, '');
        }
      });


    }
  }
  getMoreComments() {
    if (this.totalPage >= this.page) {
      this.CrudService.add({
        "user_id": localStorage.getItem('Userid') || 0,
        "objectId": this.product_id,
        "objectType": 0,
        "page": this.page
      }
        , 'getObjectComment').subscribe(res => {
          this.totalPage = res.total_page;
          this.data = this.data.concat(res.data);
          this.dataService.commonData.next(this.data);
        });
    }
  }
  getMoreVideos() {
    if (this.totalPage >= this.page) {
      this.CrudService.add({
        "prd_id": this.product_id
      }
        , 'getvideo').subscribe(res => {
          if (res && res.status) {
            this.videoList = res.data;
            this.videoList.forEach(element => {
              this.youtubeLinks.push(this.sanitizer.bypassSecurityTrustResourceUrl(element.youtubelink))
            });
          }
        });
    }
  }

  getRelatedBeats() {
    if (this.totalPage >= this.page) {
      this.CrudService.add({
        product_id: this.product_id,
        user_id: localStorage.getItem('Userid') || 0
      }
        , 'relatedtracks').subscribe(res => {
          if (res && res.status) {
            this.relatedTracks = res.data;
          }
        });
    }
  }

  ngOnInit() {

    this.dataService.commonData.subscribe(commonData => {
      this.comments = commonData;
    });

    this.dataService.commonObject.subscribe(commonObject => {
      this.product = commonObject;
    });

    $('.commentsDiv').on('scroll', function () {
      if ($('.commentsDiv').scrollTop() +
        $('.commentsDiv').innerHeight() >=
        $('.commentsDiv')[0].scrollHeight) {
        this.page += 1;
        this.getMoreComments();
      }
    }.bind(this));


    this.url = this.route.snapshot.params.name;
    this.userid = this.route.snapshot.params.id;
    this.type = this.route.snapshot.params.type;

    this.CrudService.list({ "url": this.url, "user_id": this.userid, "customer_id": localStorage.getItem('Userid') || 0, }, 'track').subscribe(res => {
      if (res.status) {
        var rs = res.data;
        this.product_id = rs.id;
        this.dataService.commonObject.next(rs);
        this.getMoreComments();
        this.getMoreVideos();
        this.getRelatedBeats();
      } else {

      }
    });

   
    this.downloadForm = this.formBuilder.group({
      email: ['', Validators.required]
  });
this.createPlaylistForm = this.formBuilder.group({
      playlistName: ['', Validators.required],
      selectedTrackId: ['', Validators.required]
  });
/*this.updatePlaylistForm = this.formBuilder.group({
      selectedPlaylist: ['', Validators.required]
  });*/
 this.updatePlaylistForm = this.formBuilder.group({
      selectedPlaylist: this.formBuilder.array([], [Validators.required]),
      selectedTrackId: ['']
    });
  this.get_playlist();
  }
  open_close_modal_share(open_modal_id, close_modal_id, qty, prd) {

    this.selected_product_share = prd;
    setTimeout(() => {
      $('#myModalshare' + open_modal_id).modal('toggle');
    }, 200);
    
  }
  open_close_modal_download(open_modal_id, close_modal_id, qty, prd) {

    this.selected_product_download = prd;
    setTimeout(() => {
      $('#myModalDownload' + open_modal_id).modal('toggle');
    }, 200);
    
  }

  open_close_modal_playlist(open_modal_id, close_modal_id, qty, prd) {

    this.selected_product_playlist = prd;
    setTimeout(() => {
      $('#myModalPlaylist' + open_modal_id).modal('toggle');
    }, 300);

  }
  get df() { return this.downloadForm.controls; }
  get cpf() { return this.createPlaylistForm.controls; }
  get upf() { return this.updatePlaylistForm.controls; }

  downloaderEmail(product, i) {

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
      , 'downloaderEmail').subscribe(res => {
        if (res.status) {
          //this.products[i].isIamLiking=!data.isIamLiking;
          this.df_success = true;
          this.downloadForm.reset();
          this.downloadFile(product, i);

        }
        this.postService.snakeMessage(res.msg, '');
      });
  }

  followapi(product, i) {
    this.CrudService.add({
      "user_id": localStorage.getItem('Userid') || 0,
      "following_id": product.artist_id,
      "method": !product.isIamFollowing
    }
      , 'followUnfollow').subscribe(res => {
        if (res.status) {
          this.downloadFile(product, i);
        }
        this.postService.snakeMessage(res.msg, '');
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

  createPlaylist(product) {
    this.csubmitted = true;
    this.cpf_success = false;

    if (this.createPlaylistForm.invalid) {
      return;
    }
    this.loading = true;

    this.CrudService.add({
      "Userid": localStorage.getItem('Userid'),
      "flag": 1,
      "tracks": product.id,
      "name": this.cpf.playlistName.value
    }
      , 'addUpdatePlaylist').subscribe(res => {
        if (res.status) {
          //this.products[i].isIamLiking=!data.isIamLiking;
          this.cpf_success = true;
          this.createPlaylistForm.reset();
		  this.get_playlist();
        }
        this.postService.snakeMessage(res.msg, '');
      });
  }

  updatePlaylist(product) {
    this.submitted = true;
    this.upf_success = false;
    this.loading = true;

    var dataPlay = this.updatePlaylistForm.value.selectedPlaylist;
    for (let n = 0; n < dataPlay.length; n++) {
      console.log(dataPlay[n]);
      $("#checkbox" + dataPlay[n]).prop("checked", false);
      this.CrudService.add({
        "Userid": localStorage.getItem('Userid'),
        "flag": 2,
        "tracks": product.id,
        "playlistId": dataPlay[n]
      }
        , 'addUpdatePlaylist').subscribe(res => {
          let i: number = 0;
          this.selectedPlaylist.controls.forEach((item: FormControl) => {
            if (item.value == dataPlay[n]) {
              this.selectedPlaylist.removeAt(i);
            }
            i++;
          });
          if (dataPlay.length - 1 == n) {
            if (res.status) {
              //this.products[i].isIamLiking=!data.isIamLiking;
              this.upf_success = true;
            }
            this.postService.snakeMessage(res.msg, '');
          }
        });
    }
  }
  downloadFile(data, i) {
    let url1 = '';
    let FileName = '';
    let FileType = '';
    let path = 'public/uploads/music/';
    let user_id = localStorage.getItem('Userid');

    if (user_id == '') {
      if (data.guest_downloads == 1) {
        /*Allow Anonymous Guest Downloads*/
        FileType = 'audio/mp3; charset=utf-8';
        url1 = path + data.audio;
        FileName = data.audio;
        this.downloadFiles(url1, FileType, FileName, data.id);
      }
    } else {

      if (data.download_options == 1) {
        /*Yes, untagged (MP3 Version - 320kbps)*/
        FileType = 'audio/mp3; charset=utf-8';

        this.CrudService.list({ "trackId": data.id, "downloadType": data.download_options, "fileType": 'mp3' }, 'getMusicGallery').subscribe(res => {
          if (res.status) {
            //url1=res.path+res.data.image;
            url1 = path + res.data.image;
            FileName = res.data.image;
            this.downloadFiles(url1, FileType, FileName, data.id);
          }
        });
      } else if (data.download_options == 2) {
        /*Yes, with voice tag (MP3 Version)*/
        FileType = 'application/x-zip-compressed; charset=utf-8';

        this.CrudService.list({ "trackId": data.id, "downloadType": data.download_options, "fileType": 'zip' }, 'getMusicGallery').subscribe(res => {
          if (res.status) {
            //url1=res.path+res.data.image;
            url1 = path + res.data.image;
            FileName = res.data.image;
            this.downloadFiles(url1, FileType, FileName, data.id);
          }
        });

      } else if (data.download_options == 3) {
        /*Yes, untagged (MP3 Version - 320kbps)*/
        FileType = 'audio/mp3; charset=utf-8';

        this.CrudService.list({ "trackId": data.id, "downloadType": data.download_options, "fileType": 'mp3' }, 'getMusicGallery').subscribe(res => {

          if (res.status) {
            //url1=res.path+res.data.image;
            url1 = path + res.data.image;
            FileName = res.data.image;
            this.downloadFiles(url1, FileType, FileName, data.id);
          }
        });
      }
    }

  }

  downloadFiles(url1, downloadType, FileName, TrackId) {

    /*this.CrudService.getTrackUrl(url1).subscribe(response => {
        let blob:any = new Blob([response], { type: downloadType });
        const url = window.URL.createObjectURL(blob);
        fileSaver.saveAs(blob, FileName);
      }), error => console.log('Error downloading the file'),
           () => console.info('File downloaded successfully');*/

    let params = {
      "user_id": localStorage.getItem('Userid'),
      "track_id": TrackId,
      "url": url1
    };
    this.CrudService.add(params, 'downloadEmailTrack').subscribe(data => {
      this.postService.snakeMessage(data['message'], '');
    });
  }
  likeunLike(data, i) {
    this.CrudService.add({
      "user_id": localStorage.getItem('Userid'),
      "like_id": data.id,
      "likeWhat": 0,
      "method": !data.isIamLiking
    }
      , 'likeUnlike').subscribe(res => {
        if (res.status) {
          this.relatedTracks[i].isIamLiking = !data.isIamLiking;

        }
        this.postService.snakeMessage(res.msg, '');
      });
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
    console.log("this.selectedPlaylist=",this.selectedPlaylist);
	}
  goToTrack() {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
}
