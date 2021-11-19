import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscriber} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import { CrudService } from 'src/app/common_service/crud.service';
import {PageService} from 'src/app/common_service/page.service';
import {of} from 'rxjs/observable/of';
import { PostService  } from '../post.service';
declare var $: any;
@Injectable()
export class FollowService {
       
	   /*artist:any={
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
  };*/
  
		constructor(  
		  private PostService:PostService,
		  private cookieService:CookieService,
		  private pageSerice: PageService,
		  private CrudService:CrudService) 
		{
      
		}
  
 
  public followingUnfollowing(followingData: any) {
	  
	  
           this.CrudService.add({
                "user_id": localStorage.getItem('Userid') || 0,
                "following_id": followingData.artist_id,
                "method": !followingData.isIamFollowing
                }
          ,'followUnfollow').subscribe(res => {
            if(res.status){
              //this.artist.follower+=(followingData.isIamFollowing)?-1:1;
              //this.artist.isIamFollowing=!followingData.isIamFollowing;
              
            }
            this.PostService.snakeMessage(res.msg,'');
          });
    }
 
}
