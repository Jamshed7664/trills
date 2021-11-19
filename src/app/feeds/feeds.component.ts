import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from 'src/app/common_service/crud.service';
import { CartService } from 'src/app/common_service/cart.service';
declare var $: any;
@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {
	
	page=1;
	totalRec:any=0;
	products:any=[];
	
	followed_list:any=[];
	selected_product_share:any;

  constructor(
  private router: Router,
  private CrudService: CrudService, private route: ActivatedRoute, 
  private http: HttpClient,public CartService: CartService, 
  private postService: PostService,
  ) { 
	this.apicall();
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
        "user_id": user_id
      });

	  var params1 = {
        "page": this.page,
		"customer_id": user_id
      };
       
      this.CrudService.list(params1, 'feeds').subscribe(data => {
        this.products = data.data;

        if (data.status) {
  
        } else {
  
        }
      });
	  
	  this.CrudService.list(params, 'followed_list').subscribe(data => {
        this.followed_list = data.data;

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
   
});

  }

open_close_modal_share(open_modal_id,close_modal_id,qty,prd){
    
    this.selected_product_share=prd;
	$('#myModalshare'+open_modal_id).modal('toggle');
  }

likeunLikeFeed(data,i){
    this.CrudService.add({
      "user_id": localStorage.getItem('Userid'),
      "like_id": data.id,
      "likeWhat": 0,
      "method": !data.isIamLiking
      }
,'likeUnlike').subscribe(res => {
  if(res.status){
    this.products[i].isIamLiking=!data.isIamLiking;
	this.apicall();
    
  }
  this.postService.snakeMessage(res.msg,'');
});
  }

 followUNfollowFeed(followingData,i){
      
          this.CrudService.add({
                "user_id": localStorage.getItem('Userid') || 0,
                "following_id": followingData.artist_id,
                "method": !followingData.isIamFollowing
                }
          ,'followUnfollow').subscribe(res => {
            if(res.status){
              this.followed_list[i].followed_count+=(followingData.followed_count)?-1:1;
			  this.followed_list[i].isIamFollowing=!followingData.isIamFollowing;
			}
            this.postService.snakeMessage(res.msg,'');
          });
  }
  
	add_to_cart(qty: any, product: any) {
		var item = {
		  "product_id": product.id,
		  "qty": qty,
		  "license":0
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

}
