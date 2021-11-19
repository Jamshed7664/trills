import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscriber} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import { CrudService } from 'src/app/common_service/crud.service';
import {PageService} from 'src/app/common_service/page.service';
import {of} from 'rxjs/observable/of';
import { PostService  } from '../post.service';
declare var $: any;
@Injectable({
  providedIn: 'root',
})
export class SocialService {
      constructor( 
        private PostService:PostService,
        private cookieService:CookieService,
        private pageSerice: PageService,
        private CrudService:CrudService) {}

followUNfollow(followingData){
  
console.log(followingData,localStorage.getItem('Userid') || 0);
return this.CrudService.add({
        "user_id": localStorage.getItem('Userid'),
        "following_id": followingData.artist_id,
        "method": followingData.isIamFollowing
        }
  ,'followUnfollow').subscribe(res => {
      this.PostService.snakeMessage(res.msg,'');
  });
}

}
