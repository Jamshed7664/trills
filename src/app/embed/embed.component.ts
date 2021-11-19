import { Component, OnInit, ViewChild, AfterViewInit ,OnDestroy} from '@angular/core';
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
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.css']
})

export class EmbedComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild('owlElement') owlElement: any
  products: any[]; currency; attrib; cart; url; type;
  searchType="";
  search="";

  artists:any=[];
  albums:any=[];
  services:any=[];
  soundskits:any=[];
  tracks:any=[];
  playLists:any=[];

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

  constructor(private router: Router, private serializer: UrlSerializer,
    public CartService: CartService, 
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
        this.setCarosaul();
      }, 1500);
  }
  getFilters() {
    let query_params = {};
    $.extend(query_params, { "category": this.current_path,"type":'tracks' });
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
  
  ngOnInit(): void {
        this.setParams();
        // this.apicall();
        this.CartService.navData.subscribe(navData => {
        this.categories = navData;
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
    
      var params={
        type:this.searchType
      }
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: params
      });

  }
  removeFilter(filter){
      var params={};
        switch (filter) {
            case 'search':
                this.search=null;
                this.CartService.searchText.next('');
                params={q:null};
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

    this.called=true;
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
    
	  $.extend(params,{"type":'tracks'});
      this.searchType='tracks';
	  
      if(params1.hasOwnProperty('q')){
        if((params1.q.length)>0){
          this.search=params1.q;
          $.extend(params,{"q":params1.q});
          this.CartService.searchText.next(params1.q);
        }
          
      }
    });
    this.CartService.searchType.next(this.searchType);
    if(this.searchType=='all'){
          this.CrudService.list(params, 'allList').subscribe(res => {
            this.artists=res.data.artist;
            this.albums=res.data.albums;
            this.playLists=res.data.playLists;
            this.tracks=res.data.tracks;
            this.soundskits=res.data.sounds;
            this.services=res.data.services;

          

          });
    }else if(this.searchType=='musicians') {
      this.CrudService.list(params, 'allArtist').subscribe(data => {
        this.products = data.data;
        this.totalRec=data.count;
      });
    }else{
      this.CrudService.list(params, 'tracks').subscribe(data => {
        this.products = data.data;
        this.totalRec=data.count;
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
      loop:false,
      autoplay:false,
       autoplayTimeout:3000,
        autoplayHoverPause:true,
        margin:20,
         navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
        responsiveClass:true,
        responsive:{
            0:{
                items:2,
                nav:true
            },
            600:{
                items:4,
                nav:true
            },
            1000:{
                items:6,
                nav:true,
                loop:false
            }
        }
    });
  $('#soundskitSlider').owlCarousel({
    loop:false,
    autoplay:false,
     autoplayTimeout:3000,
      autoplayHoverPause:true,
      margin:20,
       navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
      responsiveClass:true,
      responsive:{
          0:{
              items:2,
              nav:true
          },
          600:{
              items:4,
              nav:true
          },
          1000:{
              items:6,
              nav:true,
              loop:false
          }
      }
  });
  $('#artistImage').owlCarousel({
    loop:false,
    autoplay:false,
     autoplayTimeout:3000,
      autoplayHoverPause:true,
      margin:20,
       navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
      responsiveClass:true,
      responsive:{
          0:{
              items:2,
              nav:true
          },
          600:{
              items:4,
              nav:true
          },
          1000:{
              items:6,
              nav:true,
              loop:false
          }
      }
  });

  $('#albumsSlider').owlCarousel({
    loop:false,
    autoplay:false,
     autoplayTimeout:3000,
      autoplayHoverPause:true,
      margin:20,
       navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
      responsiveClass:true,
      responsive:{
          0:{
              items:2,
              nav:true
          },
          600:{
              items:4,
              nav:true
          },
          1000:{
              items:6,
              nav:true,
              loop:false
          }
      }
  });

  $('#tracksSlider').owlCarousel({
    loop:false,
    autoplay:false,
     autoplayTimeout:3000,
      autoplayHoverPause:true,
      margin:20,
       navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
      responsiveClass:true,
      responsive:{
          0:{
              items:2,
              nav:true
          },
          600:{
              items:4,
              nav:true
          },
          1000:{
              items:6,
              nav:true,
              loop:false
          }
      }
  });

  $('#playlistsSlider').owlCarousel({
    loop:false,
    autoplay:false,
     autoplayTimeout:3000,
      autoplayHoverPause:true,
      margin:20,
       navText: ["<span><img src='assets/images/arrow-left-white.png'></span>", "<span><img src='assets/images/arrow-right-white.png'></span>"],
      responsiveClass:true,
      responsive:{
          0:{
              items:2,
              nav:true
          },
          600:{
              items:4,
              nav:true
          },
          1000:{
              items:6,
              nav:true,
              loop:false
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

}
