import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscriber} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import { CrudService } from 'src/app/common_service/crud.service';
import {PageService} from 'src/app/common_service/page.service';
import {of} from 'rxjs/observable/of';
import { PostService  } from '../post.service';
declare var $: any;
@Injectable()
export class CartService {
      public itemsInCartSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
      public navData: BehaviorSubject<any[]> = new BehaviorSubject([]);
      public cart_item_count= new BehaviorSubject('');
      public searchText= new BehaviorSubject('');
      public searchType= new BehaviorSubject('');
      public currentTrack:BehaviorSubject<any>= new BehaviorSubject('');
      public playList: BehaviorSubject<any[]> = new BehaviorSubject([]);
      public trackList:BehaviorSubject<any>= new BehaviorSubject([]);
      constructor(  private PostService:PostService,private cookieService:CookieService,private pageSerice: PageService,private CrudService:CrudService) {
      this.getcartproducts();
  }
  public getItems(): Observable<any[]> {
    return this.itemsInCartSubject;
  }

	LyricsAddUpdate(data,lyrics_id)
    {
		var url='';
		let query_params = {};
		if(lyrics_id!=0)
		{
			url='updatelyrics';
			query_params = {
			  "Userid": localStorage.getItem('Userid'),
			  "lyricsId": lyrics_id,
			  "product_id":"1",
			  "name":"dddd",
			  "description":"description"
			};
		}else{
			url='createlyrics';

			query_params = {
			  "Userid": localStorage.getItem('Userid'),
			  "lyricsId": lyrics_id,
			  "product_id":"1",
			  "name":"dddd",
			  "description":"description"
			};
			
		}

		this.CrudService.add(query_params, url).subscribe(data => {
		  if (data.status == true) {
			//this.router.navigate(['/tracks/edit/' + data.id]);
			// $('html, body').animate({scrollTop:500},'50');
		  } else {
			this.PostService.snakeMessage(data.message, 'OK');
		  }
		});
	}

  setSingleTrack(dataId,dataType, index) {
        var track={
          dataId:dataId,
          dataType:dataType,
          index: index
          }
      this.currentTrack.next(track);
  }

  setAllTracks(tracks,dataType, index?:0) {
    console.log(tracks,dataType, index)
    tracks.forEach(element => {
      var decoded_string = atob(element.playerData);
             var t=JSON.parse(decoded_string);
             element.artist=t.artistname;
             element.title=t.name;
             element.playurl=t.audio;
             element.duration=t.duration;
             element.index = index;
             
    });
    setTimeout(() => {
      this.trackList.next(tracks);
    }, 300);
    
  }
  
  
  public getcartproducts(){
        /*this.CrudService.list('', 'cartcount/'+this.cookieService.get('GroceryCart')+"/"+0).
        subscribe(data => {
          ///console.log(data['data']);
             this.itemsInCartSubject.next(data['data']);
        }
        )*/
  }
  public getfeedUrl(data){ console.log("ssss",data);
    if(data){
      const name=data.name.replace(/\s+/g, '-').toLowerCase();
      return `/${name}/${data.artist_id}/feed`;
    }
   
}

public getcommentsUrl(data){
    if(data){
      const name=data.name.replace(/\s+/g, '-').toLowerCase();
      return `/${name}/${data.artist_id}/comments`;
    }
   
}

public gettracksUrl(data){
    if(data){
      const name=data.name.replace(/\s+/g, '-').toLowerCase();
      return `/${name}/${data.artist_id}/tracks`;
    } 
}

public getvideosUrl(data){
    if(data){
      const name=data.name.replace(/\s+/g, '-').toLowerCase();
      return `/${name}/${data.artist_id}/videos`;
    } 
}

public getaboutUrl(data){
    if(data){
      const name=data.name.replace(/\s+/g, '-').toLowerCase();
      return `/${name}/${data.artist_id}/about`;
    } 
}

  public getServiceUrl(data){
    if(data){
      const name=data.name.replace(/\s+/g, '-').toLowerCase();
      return `/${name}/${data.artist_id}/services`;
    }
   
  }
  public getServiceUrl2(data){
    if(data){
      const name=data.name.replace(/\s+/g, '-').toLowerCase();
      return `/${name}/${data.artist_id}/services/${data.url}`;
    }
   
}
public getSellerProfileUrl(data){ 
    if(data){
      const name=data.name.replace(/\s+/g, '-').toLowerCase();
      return `/${name}/${data.artist_id}/tracks`;
    }
   
}
public getSoundKitListUrl(data){
  if(data){
    const name=data.name.replace(/\s+/g, '-').toLowerCase();
    return `/${name}/${data.artist_id}/sound-kits`;
  }
     
}
public getSoundKitDeatilsListUrl(data){
  if(data){
    const name=data.name.replace(/\s+/g, '-').toLowerCase();
    return `/${name}/${data.artist_id}/sound-kits/${data.url}`;
  }
  
}
public getDetailsUrl(data){
  if(data){
    const name=data.name.replace(/\s+/g, '-').toLowerCase();
    return `/${name}/${data.artist_id}/${data.url}`;
  }
  
}

public getAlbumDetailTabUrl(data,type){
	
    if(data){
      return `/${data.product_id}/${type}`;
    }
   
}

public getUrlFromallList(search,index){ 
  var url='';

  switch (index) {
      case 1:
        url=`?type=musicians`
      break;

      case 2:
        url=`?type=playlist`
      break;

      case 3:
        url=`?type=tracks`
      break;

      case 4:
        url=`?type=albums`
      break;

      case 5:
        url=`?type=services`
      break;

      case 6:
        url=`?type=sound-kits`
      break;
  
  
  }
 return '';
}
  public addToCart(item: any) {
              let user_cookie = { 
                "trilsUserCart" : localStorage.getItem('trilsUserCart'),
                "fld_action_type":0
              };
              $.extend(item,user_cookie);
          if (localStorage.getItem('Userid')) {
                let user_cookie = {
                     "customer_id" :localStorage.getItem('Userid')
                    };
                $.extend(item,user_cookie);
          }
          this.CrudService.add(item, 'cart_add_update').subscribe(res => {
            if(res.success){
                 this.cart_item_count.next('yes');
            }
              this.PostService.snakeMessage(res.msg,'');
          });
    }
 update_cart_item(item: any){
  let user_cookie = { 
    "trilsUserCart" : localStorage.getItem('trilsUserCart'),
    "fld_action_type":1
  };
  $.extend(item,user_cookie);
if (localStorage.getItem('Userid')) {
    let user_cookie = {
         "customer_id" :localStorage.getItem('Userid')
        };
    $.extend(item,user_cookie);
}
this.CrudService.add(item, 'cart_add_update').subscribe(res => {
this.PostService.snakeMessage(res.msg,'');
});
 }
}
