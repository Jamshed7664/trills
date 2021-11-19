import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { Track } from 'ngx-audio-player';   
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './404.component.html',
  // templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit, AfterViewInit {

   

  products: any[]; currency; attrib; cart; url; type;

 

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
  ngOnInit(): void {

    this.setParams();
    // this.apicall();
    this.CartService.navData.subscribe(navData => {
      this.categories = navData;
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

    this.called=true;
    var params = {
      "page": this.page,
      // "limit": 10,
      "sort_by": this.sort_by,
      "category": this.current_path
    };
    if (this.priceChange) {
      let prices = {
        "min": this.c_min_price,
        "max": this.c_max_price
      };
      $.extend(params, prices);
    }

    this.route.queryParams.subscribe(params1 => {
    if(params1.hasOwnProperty('filters')){
    $.extend(params,{"filters":params1.filters});
    } 
    });
    this.CrudService.list(params, 'tracks').subscribe(data => {
      this.products = data.data;
      this.totalRec=data.count
      if (data.status) {

      } else {
      }
    });
  }
}
