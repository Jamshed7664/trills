
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
  selector: 'app-list-album',
  templateUrl: './list-album.component.html',
  styleUrls: ['./list-album.component.css']
})
export class ListAlbumComponent implements OnInit, AfterViewInit {
page=1;
list_type:any='active';
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

     chnageListType(listType){
      this.products=[];
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: { list_type: listType },
          queryParamsHandling: 'merge'
        });
      this.list_type=listType;
      
    }

    deleteService(service){

    if (confirm('Do you really want to delete this')) {
      var params = {
        "id": service.id
      };
      this.CrudService.list(params, 'deleteprod').subscribe(data => {
                if (data.status) {
                const index: number = this.products.indexOf(service);
                if (index !== -1) {
                    this.products.splice(index, 1);
                }   
                console.log(service);
            }
      });
  }

    
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
        "user_id": user_id,
        "list_type": this.list_type
      });
       
      this.CrudService.list(params, 'albums').subscribe(data => {
        this.products = data.data;

        if (data.status) {
  
        } else {
  
        }
      });

    }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('page')) {
    this.page = params.page;
  }
    if (params.hasOwnProperty('list_type')) {
      this.list_type = params.list_type;
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


  ngAfterViewInit() {

  }

}


