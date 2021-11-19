
//import { HttpModule } from '@angular/http';
import { Component ,OnInit,ViewChild,AfterViewInit} from '@angular/core';
//import {OwlCarousel} from 'ngx-owl-carousel';
import { PostService  } from './post.service';
import { HttpClient } from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';  
import { variable } from '@angular/compiler/src/output/output_ast';
import {PageService} from 'src/app/common_service/page.service';
import { CrudService } from 'src/app/common_service/crud.service';
import{CartService}from 'src/app/common_service/cart.service';
import {BehaviorSubject, Observable, Subject, Subscriber} from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
 declare var $: any;
@Component({
  selector: 'Home',
  templateUrl: './home.component.html'
 // template: '<h2>Courses</h2>'
 
})
export class HomeComponent implements OnInit, AfterViewInit{
  cart$: Observable<any[]>;
  
  banner: any[];  most_sold: any[];trending:any[];artists:any[];testimonials:any[];
  brand: any[];
  ads:any[];page;
  ads1:any;cart;
  ads2: any;currency;attrib;cartcount:any=0;
  // Inject HttpClient into your component or service.  ddfdf
  @ViewChild('selector') private elementName;
  constructor(
    private router: Router,
      public CartService:CartService,private CrudService:CrudService,private http: HttpClient,public postService: PostService, private pageSerice: PageService,private cookieService: CookieService) {
    // Making the HTTP Request
    this.currency = postService.currency();
    this.postService.page.next('');
 }

 onOptionsSelected(value:string,i:any){
  //console.log("the selected value is " + value);
//this.attrib = postService.attrib_view(value);
this.CrudService.list('','product_attrib_view/'+value).subscribe(data => {
  this.attrib = data['data'];
 
 // this.products[i].getPrice.fld_product_cutting_price =this.attrib.fld_product_cutting_price;
  //this.products[i].getPrice.fld_prd_price =this.attrib.fld_prd_price;
});


}


handleSearch(){
    var params={
      type:$('.HOMEsearchBoxTopVale').val(),
      q:$('.HOMEsearchBoxTop').val()
    };
this.router.navigate(
['search'],
{
queryParams: params
});
}
 ngOnInit() {

    $('.HOMEsearchBoxTop').keypress(function (e) {
        var key = e.which;
        console.log(key);
        if(key == 13)  // the enter key code
         {
           this.handleSearch();
         }
       }.bind(this)); 
  //this.cart$ = await this.CartService.getCart();
 // this.populateProducts();
  
 let apisCallData=[
  { 
    "params":"",
   "url":"banners"
  },
 { 
"params":{type:1},
"url":"featuresProduct"
 },
 {
"params":{type:2},
"url":"featuresProduct"
 },
{
"params":'',
"url":"artists"
 },
{
"params":"",
"url":"testimonials"
}
];

    this.CrudService.handleMutipleCallAPI(apisCallData).subscribe(data => {
      this.banner =data[0].data;
      this.trending=data[1].data;
      this.most_sold =data[2].data;
      this.artists=data[3].data;
      this.testimonials=data[4].data;
    });
}
ngAfterViewInit() {
  setTimeout(function () {
    
 $('#owl-carousel').owlCarousel({
  loop:true,
  margin:10,
 autoplay:true,
  autoplayTimeout:1000,
  autoplayHoverPause:true,
  responsiveClass:true,
  responsive:{
      0:{
          items:1,
          nav:true
      },
      600:{
          items:3,
          nav:true
      },
      1000:{
          items:5,
          nav:true,
          loop:true
      }
  }
});
    $('.owl-carousel1').owlCarousel({
      loop:true,
      autoplay:true,
      autoplayTimeout:3000,
      autoplayHoverPause:true,
      dots: false,
      margin: 10,
      responsiveClass: true,
      responsive: {
          0: {
              items: 1,
              nav: true
          },
          600: {
              items: 3,
              nav: true
          },
          1000: {
              items: 5,
              nav: true,
              margin: 20
          }
      }
      });
      $('.artists-carousel').owlCarousel({
        loop:true,
      autoplay:true,
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
                loop:true
            }
        }
    });
    $('.testimonial-carousel').owlCarousel({
      loop:true,
    autoplay:false,
     autoplayTimeout:3000,
      autoplayHoverPause:true,
      margin:25,
      navText:false,
      responsiveClass:true,
      responsive:{
          0:{
              items:1,
              nav:true
          },
          600:{
              items:1,
              nav:true
          },
          1000:{
              items:1,
              nav:true,
              loop:true
          }
      }
  });
  
  }, 6000);
}
}