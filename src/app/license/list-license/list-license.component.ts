import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { PostService } from '../../post.service';
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
  selector: 'app-list-license',
  templateUrl: './list-license.component.html',
  styleUrls: ['./list-license.component.css']
})
export class ListLicenseComponent implements OnInit, AfterViewInit {
page=1;
currency:any;
totalRec:any=0;
products:any=[]
  constructor(private router: Router, private serializer: UrlSerializer,
    public CartService: CartService, 
    private CrudService: CrudService, private route: ActivatedRoute, private http: HttpClient,
    private postService: PostService, private pageSerice: PageService, private cookieService: CookieService) {
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.apicall();
        }
      });
      this.currency = this.postService.currency();
     }

    apicall(){
      var params = {
        "page": this.page
      };
      var user_id='';
      if (localStorage.getItem('Userid')) {
        user_id=localStorage.getItem('Userid');
      }
      $.extend(params, {
        "customer_id": user_id
      });
       
      this.CrudService.list(params, 'licenses').subscribe(data => {
        this.products = data.data;
        this.totalRec=data.count
        if (data.status) {
  
        } else {
  
        }
      });

    }
	
	licenseEnableDisable(licenseId, Status)
	{
		this.CrudService.add({
			  "Userid":localStorage.getItem('Userid'), 
			  "enable_license":Status,
			  "licenseId":licenseId
		  }
		,'statusLicense').subscribe(res => {
			if(res.status){
				this.apicall();
			}
			this.postService.snakeMessage(res.msg,'');
		});
	}
	
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('page')) {
    this.page = params.page;
  }
});

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
  getLicenseName(dt){
    var arr=[];
    var filters_array = dt.split(",");
        filters_array.forEach((val,index)=>{
        if(val=='1'){
        arr.push(' MP3 ');
        }
        if(val=='2'){
        arr.push(' WAV ');
        }
        if(val=='3'){
        arr.push(' Track Stems ');
        } 
    });
    var x = '';
    if(arr.length>0){
        x = arr.toString();
    }
    return x;
  }

  ngAfterViewInit() {

  }

}
