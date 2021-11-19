import { Component,Input, OnInit, Output,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { PostService  } from '../post.service';
import {CookieService} from 'ngx-cookie-service';  
import { AuthService } from 'src/app/common_service/auth.service';

import { v1 as uuidv1 } from 'uuid';
import { CrudService } from 'src/app/common_service/crud.service';
import{CartService}from 'src/app/common_service/cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { first } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
//export class HeaderComponent implements OnInit {
  export class HeaderComponent implements OnInit{
    alluploaded:any[];url1;stemslist; images = []; urls = new Array<string>();index='';
    items:any = 0;
    search:any;
    searchType:any=''
	/*registerType:any=''*/
    currentUser: User;progress: number;allimages;navData;name: string;newimages = [];
    constructor(
    private PostService:PostService,
    public  CartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
   // private alertService: AlertService,
    public CrudService:CrudService,
    private config: ConfigService
    ) {
      if (localStorage.getItem('trilsUserCart')) {
          } else{
              localStorage.setItem('trilsUserCart', uuidv1());
          }

		/*if (localStorage.getItem('registerType')) {
              this.registerType=localStorage.getItem('registerType');
          }*/

        this.authService.currentUser.subscribe(x => this.currentUser = x);
    }
  modal_close(){
      $('.Offcanvas_menu_wrapper,.off_canvars_overlay').removeClass('active');
  }
    myUpload_modal(){
      $('.Offcanvas_menu_wrapper,.off_canvars_overlay').addClass('active');
    }
    logout() {
    localStorage.removeItem("Userid");
    localStorage.removeItem("currentUser");
    this.authService.logout();
    this.router.navigate(['/login']);
	 
    }
    changeRoute(parentLink,childLink){
       if(childLink!=''){
         console.log("booth");
      this.router.navigate(['/'+parentLink+'/'+childLink]);
    }else{
      console.log("single");
      this.router.navigate(['/'+parentLink]);
    }
    }
    selectedFile: File;
    ArrayOfSelectedFile = new Array<string>();
    fileChange(e) {
      for (var i = 0; i < e.target.files.length; i++) { 
        this.images.push(e.target.files[i]);
      }
      //console.log();
      // if (e.target.files && e.target.files[0]) {
      //   var filesAmount = encodeURI.target.files.length;
      //   for (let i = 0; i < filesAmount; i++) {
      //     var reader = new FileReader();
      //     reader.onload = (e: any) => {
      //       this.newimages.push(e.target.files[i]);
      //      // this.images.push(event.target.files); 
      //     }
      //     reader.readAsDataURL(e.target.files[i]);
      //   }
      // }
    }
    removeSelectedFile(index,removetype){
      if(removetype==1){
        this.images.splice(index, 1);
      }
      if(removetype==2){
        this.images.splice(index,1000);
      }
     // this.ArrayOfSelectedFile.splice(index,1);
    }
    selectMusic(id,type){
      let  params={   
        "id":id,
        "flag":type,
        "prd_id":this.route.snapshot.paramMap.get('url'),
        "user_id":localStorage.getItem('Userid'),
        "type":"1",
        "filetype":'mp3,wav'
      };
          this.CrudService.add(params,'musicdelete')
              .pipe(first())
              .subscribe(
                  data => {
                    if (data.status==true) {
                      this.PostService.snakeMessage(data.message,'OK');
                   //   this.alertService.success(data.message, true);
                      $('#mediaWork').modal('hide');
                     // this.image=data.image;
                     // this.image=data.image;
                      this.CrudService.add(params,'getMusic').
                      subscribe(data => {
                           this.alluploaded=data['data'];
                      }
                      )
                    }
                    else if (data.status==false) {
                      //  this.alertService.error(data.message);
                    }
                  },
                  error => {
                     // this.loading = false;
                  });
    }
    validateFile(name: String) {
      var ext = name.substring(name.lastIndexOf('.') + 1);
      if (ext.toLowerCase() == 'mp3' || ext.toLowerCase() == 'wav' 
      || ext.toLowerCase() == 'rar' || ext.toLowerCase() == 'zip' 
      || ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'png'
      ) {
          return true;
      }
      else {
          return false;
      }
    }
    allUpload() {
     const frmData = new FormData();
    console.log(this.images.length);
    for (var i = 0; i < this.images.length; i++) { 
      frmData.append("fileUpload[]", this.images[i]);
    }
    console.log(frmData);
                let  params={   
                  "image": this.newimages,
                  "user_id":localStorage.getItem('Userid'),
                  "type":"1"
                };
                    this.CrudService.add(frmData,'createMusicGallery')
                        .pipe(first())
                        .subscribe(
                            data => {
                              if (data.status==true) {
                                //this.alertService.success(data.message, true);
                               // this.image=data.image;
            let  prm={"prd_id":this.route.snapshot.paramMap.get('url'),"type":"1","filetype":'mp3,wav'};
              this.CrudService.add(prm,'getMusic').
              subscribe(data => {
                   this.alluploaded=data['data'];
              }
              );
                               $('#mediaWork').modal('hide');
                              }
                              else if (data.status==false) {
                              }
                            },
                            error => {
                            });
    }
    selectGallery(id,type){
      let  params={   
        "id":id,
        "flag":type,
        "prd_id":"",
        "user_id":localStorage.getItem('Userid'),
        "type":"1"
      };
          this.CrudService.add(params,'GalleryImagedelete')
              .pipe(first())
              .subscribe(
                  data => {
                    if (data.status==true) {
                   //   this.alertService.success(data.message, true);
                      $('#uploadArtWork').modal('hide');
                      this.CrudService.add(params,'getGalleryImage').
                      subscribe(data => {
                           this.allimages=data['data'];
                      }
                      )
                    }
                    else if (data.status==false) {
                      //  this.alertService.error(data.message);
                    }
                  },
                  error => {
                      this.PostService.snakeMessage(error,'OK');
                  });
    }
    cartData(){
      if (localStorage.getItem('trilsUserCart')) {
        let apisCallData=[
          { 
            "params":{"trilsUserCart":localStorage.getItem('trilsUserCart'),},
           "url":"cart"
          }
        ];
         this.CrudService.handleMutipleCallAPI(apisCallData).subscribe(data => {
             this.items =data[0].count;
          // this.items="4567";
        });

      }
    }
    handleSearch(){
          var params={
            type:$('#searchBoxTopVale').val(),
            q:$('#searchBoxTop').val()
          };
      this.router.navigate(
      ['search'],
      {
      queryParams: params
      });
    }
 
    ngOnInit() { 
      this.CartService.searchText.subscribe(searchText => {
       this.search=searchText;
      });
      this.CartService.searchType.subscribe(searchType => {
        this.searchType=searchType;
      });
	   this.CartService.cart_item_count.subscribe(cart_item_count => {
        //console.log(cart_item_count);
		this.cartData();
	  });

      
      $('#searchBoxTop').keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
         {
           this.handleSearch();
         }
       }.bind(this)); 

            this.cartData();
 

                
      let apisCallData=[
        { 
          "params":{"prd_id":'',"type":"1","filetype":'mp3'},
         "url":"getMusic"
        },
       { 
      "params":{
        "prd_id":"",
        "filetype":'zip,rar',
      },
      "url":"getMusic"
       },
       { 
        "params":{"prd_id":"","type":"1","filetype":'mp3,wav'},
       "url":"getGalleryImage"
      },
      { 
        "params":"",
       "url":"navData"
      },
      ];
       this.CrudService.handleMutipleCallAPI(apisCallData).subscribe(data => {
        this.alluploaded =data[0].data;
        this.stemslist =data[1].data;
        this.allimages=data[2].data;
        this.navData=data[3].data;
        this.CartService.navData.next(this.navData);
      });
    }

     getSearchType(e){  
        if(this.searchType==e){   
          return "selected";
        } 

      if(this.searchType==e){   
        return "selected";
      } 

      if(this.searchType==e){   
        return "selected";
      } 

    if(this.searchType==e){   
      return "selected";
    } 

    if(this.searchType==e){   
      return "selected";
    } 

    if(this.searchType==e){   
      return "selected";
    } 
    if(this.searchType==e){   
    return "selected";
    } 
  
      
    }
}
