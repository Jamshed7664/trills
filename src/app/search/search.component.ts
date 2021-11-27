import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { PostService } from '../post.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { variable } from '@angular/compiler/src/output/output_ast';
import { PageService } from 'src/app/common_service/page.service';
import { ActivatedRoute, UrlSerializer, UrlTree, UrlSegmentGroup, DefaultUrlSerializer, UrlSegment, Router } from '@angular/router';
import { CrudService } from 'src/app/common_service/crud.service';
import { BehaviorSubject, Observable, Subject, Subscriber } from 'rxjs';
import { CartService } from 'src/app/common_service/cart.service';
import * as fileSaver from 'file-saver';

//import Socialshare from 'angular-socialshare';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn } from '@angular/forms';

import { Tooltip } from '@syncfusion/ej2-popups';
import { enableRipple, createElement } from '@syncfusion/ej2-base';
import { TabComponent, SelectEventArgs } from '@syncfusion/ej2-angular-navigations';

enableRipple(true);

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('owlElement') owlElement: any
  @ViewChild('element') tabInstance: TabComponent;
  products: any[]; currency; attrib; cart; url; type;
  searchType = "";
  search = "";

  artists: any = [];
  albums: any = [];
  services: any = [];
  soundskits: any = [];
  tracks: any = [];
  playLists: any = [];
  playlistTitle: any[];
  prdId: any;
  versions: Array<any> = []
  lyricform: FormGroup;
  description: any;
  versionId: any;
  intialtab: boolean = true;
  lyricId: any;

  moods: any = [
    { id: 1, name: 'Quickrly', url: 'Quickrly' },
    { id: 2, name: 'Relaxed', url: 'Relaxed' },
    { id: 3, name: 'Dark', url: 'Dark' },
    { id: 4, name: 'Powerfull', url: 'Powerfull' },
    { id: 5, name: 'Neautral', url: 'Neautral' },
    { id: 6, name: 'Angry', url: 'Angry' },
    { id: 7, name: 'Romantic', url: 'Romantic' },
    { id: 8, name: 'Energetic', url: 'Energetic' },
    { id: 9, name: 'Tense', url: 'Tense' },
    { id: 10, name: 'Sad', url: 'Sad' },
    { id: 11, name: 'Scary', url: 'Scary' },
    { id: 12, name: 'Happy', url: 'Happy' },
    { id: 13, name: 'Dramatic', url: 'Dramatic' },
    { id: 14, name: 'Exiting', url: 'Exiting' },
    { id: 15, name: 'Majestic', url: 'Majestic' }
  ];
  beats: any = [
    { id: 1, name: 'Beat', url: 'Beat' },
    { id: 2, name: 'Song', url: 'Song' },
    { id: 3, name: 'With chorus', url: 'With-chorus' },
    { id: 4, name: 'Vocals', url: 'Vocals' },
    { id: 5, name: 'Top line', url: 'Top-line' }
  ];
  licenses: any = [];
  selected_product: any;
  selected_product_share: any;
  selected_product_download: any;
  selected_product_playlist: any;
  selected_product_lyrics: any;
  categories: any = [];
  selectedCats: any = [];
  selectedTracks: any = [];
  selectedMoods: any = [];
  moreCats = false;
  moreMoods = false;
  moreBeats = false;
  called = true;
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

  constructor(private router: Router, private serializer: UrlSerializer,
    public CartService: CartService,
    private PostService: PostService,

    //public Socialshare: Socialshare,
    private formBuilder: FormBuilder,
    private CrudService: CrudService, private route: ActivatedRoute, private http: HttpClient,
    private postService: PostService, private pageSerice: PageService, private cookieService: CookieService) {
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

  // convenience getter for easy access to form fields
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
    console.log("this.createPlaylistForm=", this.createPlaylistForm)
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

  open_close_modal_lyrics(open_modal_id, close_modal_id, qty, prd) {
    this.prdId = prd.id;
    this.description = null;
    this.onGetLyrics()
    this.selected_product_lyrics = prd;
    setTimeout(() => {
      $('#myModalLyrics' + open_modal_id).modal('toggle');
    }, 300);
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

  setpriceRange() {
    $('#slider-range').slider().bind('slidechange', function (event, ui) {
      this.priceChange = true;
      this.c_min_price = $('.slider-time').text();
      this.c_max_price = $('.slider-time2').text();
      this.page = 1;
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: { max: this.c_max_price, min: this.c_min_price, page: 1 },
          queryParamsHandling: 'merge'
        });

    }.bind(this));
  }
  ngAfterViewInit() {


    jQuery(function ($) {
      $('.box-title>h5').on('click', function () {
        var $el = $(this),
          textNode = this.lastChild;
        $el.find('span').toggleClass('fa-angle-down fa-angle-right');
        textNode.nodeValue = ' Gimme ' + ($el.hasClass('showFire') ? 'Fire' : 'Water')
        $el.toggleClass('showFire');
      });
    });


    this.getFilters();
    setTimeout(() => {
      this.setpriceRange();
      this.setCarosaul();
    }, 1500);
  }
  getFilters() {
    let query_params = {};
    $.extend(query_params, { "category": this.current_path, "type": this.type });
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

      var plength = Object.keys(params).length;
      if (plength > 0) {
        this.filterApplied = true;
      }
      if (params.hasOwnProperty('filters')) {
        var filterString = params.filters;
        var filters_array = filterString.split(",");
        filters_array.forEach((val, index) => {
          var n = val.search("cat");
          if (n == 0) {
            var str = val.replace('cat', '')
            this.selectedCats.push((str));
          }
          var a = val.search("mood");
          if (a == 0) {
            var str = val.replace('mood', '')
            this.selectedMoods.push((str));
          }
          var v = val.search("trackType");
          if (v == 0) {
            var str = val.replace('trackType', '')
            this.selectedTracks.push((str));
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

  moods_api() {
    let apisCallData = [
      {
        "params": { type: 1 },
        "url": "generMoodKey"
      },
      {
        "params": { type: 2 },
        "url": "generMoodKey"
      },
      {
        "params": { type: 3 },
        "url": "generMoodKey"
      },
      {
        "params": { type: 4 },
        "url": "generMoodKey"
      },
      {
        "params": { type: 5 },
        "url": "generMoodKey"
      }
    ];


    this.CrudService.handleMutipleCallAPI(apisCallData).subscribe(data => {
      /*this.Droplist = data[0].data;
      this.Droplist2 = data[1].data;*/
      this.moods = (data[2].data).concat(data[3].data);
      /*this.Droplist4 = data[3].data;
      this.Droplist5 = data[4].data;*/
    });

    this.CrudService.list('', 'trackType').subscribe(data => {
      console.log("beats", data['data']);
      this.beats = data['data'];
      // console.log(data['data']);
    });
  }

  ngOnInit(): void {
    this.initiateLyricForm()

    this.setParams();

    this.moods_api();
    // this.apicall();
    this.CartService.navData.subscribe(navData => {
      this.categories = navData;
    });

    this.downloadForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
    this.createPlaylistForm = this.formBuilder.group({
      playlistName: ['', Validators.required],
      selectedTrackId: ['']
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

  likeunLike(data, i) {
    this.CrudService.add({
      "user_id": localStorage.getItem('Userid'),
      "like_id": data.id,
      "likeWhat": 0,
      "method": !data.isIamLiking
    }
      , 'likeUnlike').subscribe(res => {
        if (res.status) {
          this.products[i].isIamLiking = !data.isIamLiking;

        }
        this.postService.snakeMessage(res.msg, '');
      });
  }
  sortBy(deviceValue) {
    this.page = 1;
    this.sort_by = deviceValue;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { sort_by: deviceValue },
        queryParamsHandling: 'merge'
      });
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



  send(e, url) {
    console.log(e);
    console.log(url);
    this.page = 1;
    var params = { page: 1 };
    var facilitiesid = new Array();
    $("input[name='checkbox[]']:checked").each(function () {
      facilitiesid.push($(this).attr('id'));
    });

    if (facilitiesid.length > 0) {
      $.extend(params, { "filters": facilitiesid.toString() });
    } else {
      $.extend(params, { "filters": null });
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
    $('.price-input').prop('checked', false);
    this.sort_by = 1;
    this.page = 1;
    this.priceChange = false;
    this.filterApplied = false;
    this.c_max_price = '';
    this.c_min_price = '';
    var $slider = $("#slider-range");
    $slider.slider("values", 0, this.min_price);
    $slider.slider("values", 1, this.max_price);

    var params = {
      type: this.searchType
    }
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: params
      });


  }
  removeFilter(filter) {
    var params = {};
    switch (filter) {
      case 'search':
        this.search = null;
        this.CartService.searchText.next('');
        params = { q: null };
        break;
    }

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: params,
        queryParamsHandling: 'merge'
      });

  }
  apicall() {

    this.called = true;
    var params = {
      "page": this.page,
      "user_id": localStorage.getItem('Userid'),
      "limit": 10,
      "sort_by": this.sort_by
    };
    if (this.priceChange) {
      let prices = {
        "min": this.c_min_price,
        "max": this.c_max_price
      };
      $.extend(params, prices);
    }

    this.route.queryParams.subscribe(params1 => {
      if (params1.hasOwnProperty('filters')) {
        $.extend(params, { "filters": params1.filters });
      }
      if (params1.hasOwnProperty('type')) {
        $.extend(params, { "type": params1.type });
        this.searchType = params1.type;
      } else {
        $.extend(params, { "type": 'all' });
        this.searchType = 'all';

      }
      if (params1.hasOwnProperty('q')) {
        if ((params1.q.length) > 0) {
          this.search = params1.q;
          $.extend(params, { "q": params1.q });
          this.CartService.searchText.next(params1.q);
        }

      }
    });
    this.CartService.searchType.next(this.searchType);
    if (this.searchType == 'all') {
      this.CrudService.list(params, 'allList').subscribe(res => {
        this.artists = res.data.artist;
        this.albums = res.data.albums;
        this.playLists = res.data.playLists;
        this.tracks = res.data.tracks;
        this.soundskits = res.data.sounds;
        this.services = res.data.services;



      });
    } else if (this.searchType == 'musicians') {
      this.CrudService.list(params, 'allArtist').subscribe(data => {
        this.products = data.data;
        this.totalRec = data.count;
      });
    } else {
      this.CrudService.list(params, 'tracks').subscribe(data => {
        this.products = data.data;
        this.totalRec = data.count;
      });

    }

  }
  setCarosaul() {
    $('#playlistsSlider').owlCarousel('destroy');
    $('#tracksSlider').owlCarousel('destroy');
    $('#albumsSlider').owlCarousel('destroy');
    $('#artistImage').owlCarousel('destroy');
    $('#soundskitSlider').owlCarousel('destroy');
    $('#serviceSlider').owlCarousel('destroy');

    $('#serviceSlider').owlCarousel({
      loop: false,
      autoplay: false,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      margin: 20,
      navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
      responsiveClass: true,
      responsive: {
        0: {
          items: 2,
          nav: true
        },
        600: {
          items: 4,
          nav: true
        },
        1000: {
          items: 6,
          nav: true,
          loop: false
        }
      }
    });
    $('#soundskitSlider').owlCarousel({
      loop: false,
      autoplay: false,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      margin: 20,
      navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
      responsiveClass: true,
      responsive: {
        0: {
          items: 2,
          nav: true
        },
        600: {
          items: 4,
          nav: true
        },
        1000: {
          items: 6,
          nav: true,
          loop: false
        }
      }
    });
    $('#artistImage').owlCarousel({
      loop: false,
      autoplay: false,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      margin: 20,
      navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
      responsiveClass: true,
      responsive: {
        0: {
          items: 2,
          nav: true
        },
        600: {
          items: 4,
          nav: true
        },
        1000: {
          items: 6,
          nav: true,
          loop: false
        }
      }
    });

    $('#albumsSlider').owlCarousel({
      loop: false,
      autoplay: false,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      margin: 20,
      navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
      responsiveClass: true,
      responsive: {
        0: {
          items: 2,
          nav: true
        },
        600: {
          items: 4,
          nav: true
        },
        1000: {
          items: 6,
          nav: true,
          loop: false
        }
      }
    });

    $('#tracksSlider').owlCarousel({
      loop: false,
      autoplay: false,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      margin: 20,
      navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
      responsiveClass: true,
      responsive: {
        0: {
          items: 2,
          nav: true
        },
        600: {
          items: 4,
          nav: true
        },
        1000: {
          items: 6,
          nav: true,
          loop: false
        }
      }
    });

    $('#playlistsSlider').owlCarousel({
      loop: false,
      autoplay: false,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      margin: 20,
      navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
      responsiveClass: true,
      responsive: {
        0: {
          items: 2,
          nav: true
        },
        600: {
          items: 4,
          nav: true
        },
        1000: {
          items: 6,
          nav: true,
          loop: false
        }
      }
    });
    // this.owlElement.refresh();
    // $('#artistImage').owlCarousel('destroy'); 
  }

  ngOnDestroy() {
    $('#playlistsSlider').owlCarousel('destroy');
    $('#tracksSlider').owlCarousel('destroy');
    $('#albumsSlider').owlCarousel('destroy');
    $('#artistImage').owlCarousel('destroy');
    $('#soundskitSlider').owlCarousel('destroy');
    $('#serviceSlider').owlCarousel('destroy');
  }

  public totalItems: number;
  public headerText: Object = [{ 'text': 'Tab1' }, { 'text': 'Add New' }];

  public tabCreated(): void {
    let tooltip: Tooltip = new Tooltip({
      content: 'Add Tab'
    });
    tooltip.appendTo('.e-ileft.e-icon');

    const count: number = this.tabInstance.items.length;

    let title: string = 'Tab N' + count;
    let content: string = 'Content N' + count;
    let item: Object = { header: { text: title }, content: createElement('pre', { innerHTML: content.replace(/\n/g, '<br>\n') }).outerHTML };

    this.totalItems = document.querySelectorAll('#element .e-toolbar-item').length;
    this.tabInstance.addTab([item], this.totalItems - 1);

  }

  public tabSelected(args: SelectEventArgs): void {
    if (args.selectedIndex === document.querySelectorAll('#element .e-toolbar-item').length - 1) {
      (document.getElementById('tab-title') as any).value = '';
      (document.getElementById('tab-content') as any).value = '';
    }
  }



  isUpdate: boolean = false;

  initiateLyricForm() {
    this.lyricform = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required)
    })
  }
  onsubmitLyrics() {
    if (this.lyricform.invalid) {
      this.lyricform.controls['name'].markAsTouched()
      this.lyricform.controls['description'].markAsTouched()
    } else {
      if (this.isUpdate) {
        const payload = {
          "Userid": localStorage.getItem('Userid'),
          "name": this.lyricform.controls['name'].value,
          "description": this.lyricform.controls['description'].value,
          "product_id": this.prdId
        };
        this.CrudService.cretaeLyrics(payload).subscribe(res => {
          console.log(res);
          this.onGetLyrics();
          this.postService.snakeMessage('Lyrics created successfully.', '')
        })
      } else {
        const payload = {
          "Userid": localStorage.getItem('Userid'),
          "name": this.lyricform.controls['name'].value,
          "description": this.lyricform.controls['description'].value,
          "product_id": this.prdId,
          "lyricsId": this.lyricId,
        };
        this.CrudService.updatelyrics(payload).subscribe(res => {
          console.log(res);
          this.onGetLyrics();
          this.postService.snakeMessage('Lyrics updated successfully.', '')
        })
      }

    }
  }
  isLyrics: boolean = false
  onAddLyric() {
    this.isUpdate = true;
    this.initiateLyricForm()
    this.versionId = null;
    this.intialtab = false;
    this.isLyrics = true;
  }
  onversionClick(item: any) {
    console.log('item is', item)

    if (item == undefined) {
      this.isUpdate = true;
      this.lyricform.reset();
    } else {
      this.lyricId = item.id
      this.isUpdate = false;
      this.initiateLyricForm();
      this.lyricform.patchValue({
        name: item.name,
        description: item.description
      });
      let x = this.versions.find(x => item.id == x.id);
      this.description = x.description;
      this.versionId = x.id;
      this.intialtab = false
    }




  }


  onGetLyrics() {
    this.versions = []
    let payload = {
      "productId": this.prdId,
      "Userid": window.localStorage.getItem('Userid')
    }
    this.CrudService.getLyrics(payload).subscribe(res => {
      this.versions = res.data;
      console.log('Version is', this.versions.length);
      this.onversionClick(this.versions[0])

    })
  }

   
}


