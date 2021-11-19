import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscriber} from 'rxjs';
import { CrudService } from 'src/app/common_service/crud.service';
import { PostService } from '../post.service';
declare var $: any;
@Injectable({
    providedIn: 'root',
  })
export class DataService {
          public SelectedImageFromGallery:BehaviorSubject<any>= new BehaviorSubject('');
          public commonData: BehaviorSubject<any[]> = new BehaviorSubject([]);
          public commonObject: BehaviorSubject<any> = new BehaviorSubject('');
    constructor(
        private CrudService: CrudService,
        private postService: PostService
      ) {
     
      } 
    likeunLike(data,i,likeWhat,from){
      if(from=='detail'){
        this.CrudService.add({
          "user_id": localStorage.getItem('Userid') || 0,
          "like_id": data.id,
          "likeWhat": likeWhat,
          "method": !data.isIamLiking
          }
    ,'likeUnlike').subscribe(res => {
      if(res.status){
          this.commonObject.subscribe(commonObject => {
            commonObject.likeCount+=(data.isIamLiking)?-1:1;
            commonObject.isIamLiking=!data.isIamLiking;
          });
      }
    });
      }else{

        this.CrudService.add({
          "user_id": localStorage.getItem('Userid') || 0,
          "like_id": data.id,
          "likeWhat": likeWhat,
          "method": !data.isIamLiking
          }
    ,'likeUnlike').subscribe(res => {
      if(res.status){
            this.commonData.subscribe(redData => {
                redData[i].likeCount+=(data.isIamLiking)?-1:1;
                redData[i].isIamLiking=!data.isIamLiking;
              
        });
      }
    });
      }
        
    }
  }

  
  
