
//import { HttpModule } from '@angular/http';
import { Component ,OnInit,ViewChild,AfterViewInit} from '@angular/core';
//import {OwlCarousel} from 'ngx-owl-carousel';
import { PostService  } from '../post.service';
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
  selector: 'Featured',
  templateUrl: './featured.component.html'
 // template: '<h2>Courses</h2>'
 
})
export class FeaturedComponent implements OnInit, AfterViewInit{
  cart$: Observable<any[]>;
  most_sold: any[];trending:any[];
  title='';
  type:any=0;
  page;
  cart;
  currency;attrib;cartcount:any=0;
  // Inject HttpClient into your component or service.  ddfdf
  @ViewChild('selector') private elementName;
  constructor(
    private router: Router,
	private route: ActivatedRoute,
    public CartService:CartService,
	private CrudService:CrudService,
	private http: HttpClient,
	public postService: PostService,
	private pageSerice: PageService,
	private cookieService: CookieService) {
    // Making the HTTP Request
    this.currency = postService.currency();
    this.postService.page.next('');
 }

 ngOnInit() {

 this.type=this.route.snapshot.paramMap.get('type');
 
  if(this.type==1){
	 this.title='Trending Beats';
  }else if(this.type==2){
	 this.title='Most Sold Beats';
  }
  
    this.CrudService.list({type:this.type},'featuresProduct').subscribe(data => {
      this.trending=data.data;    
    });
}
ngAfterViewInit() {
   
}

}