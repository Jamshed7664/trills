import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
//import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { User } from '../_models/user';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { PostService  } from '../post.service';
import { CartService } from 'src/app/common_service/cart.service';

import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-future-releases',
  templateUrl: './future-releases.component.html',
  styleUrls: ['./future-releases.component.css']
})
export class FutureReleasesComponent implements OnInit {
  DataForm: FormGroup;socialForm: FormGroup;address_book_from: FormGroup;
  loading = false;
  submitted = false;
  api_calling=false;
  state_data:any;
    city_data:any;
    address_data:any;
    address_mode:any=false;
    address_id:any=0;
    form: FormGroup;list:any[];
    page:any;
  totalRec:any;
  checkAll = false;
  selectedCheckBox = []
  constructor( 
    private PostService:PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    //private alertService: AlertService,
	public CartService: CartService, 
    private CrudService:CrudService,
    private config: ConfigService) {  
  if (!this.authService.currentUserValue) { 
      this.router.navigate(['/login']);
  } 
  this.form = this.formBuilder.group({
    avatar: [null]
  })
}

  ngOnInit(): void {
   this.get_list();
  }
  get_list(){
    let  params={
      "user_id":localStorage.getItem('Userid'),
      "future_type":1,
	  "feature_type":1,
	  "product_type":0
    };
    this.CrudService.add(params,'tracklist').subscribe(data => {
      this.list =data['data'];
     //console.log(this.list.length);
    });
  
  }
  createTrack(){
   
      let  query_params={
        "user_id":localStorage.getItem('Userid')
      };
       this.CrudService.add(query_params,'createtrack').subscribe(data => {
          if (data.status==true) {
            this.router.navigate(['/tracks/edit/'+data.id]);
                 // $('html, body').animate({scrollTop:500},'50');
          } else {
         this.PostService.snakeMessage(data.message,'Danger');
          }
  
     });
    
  }

  delete(id){
    if (confirm("Want to delete confirm")) {
      let  params={
        
        "id":id
      };
       this.CrudService.add(params,'deleteTrack').subscribe(data => {
          if (data.status==true) {
              this.get_list();
           
          this.PostService.snakeMessage(data.message,'success');
          } else {
          this.PostService.snakeMessage(data.message,'Danger');
          }
  
     });
    }
  }
  getPage(page: number) {
    this.page=page;
    
  }

  onCheckAll() {
    console.log(this.checkAll)
    this.selectedCheckBox = [];
    if(this.checkAll) {
      this.selectedCheckBox = [...this.list];
    }
  }
  onChangeSingleCheckbox(event, row) {
    
    if(event && event.target && event.target.checked) {
      this.selectedCheckBox.push(row);
    } else {
      const index = this.selectedCheckBox.indexOf(row);
      if (index > -1) {
        this.selectedCheckBox.splice(index, 1);
      }
    }
    
  }
  playTrack(row, index) {
    if(this.selectedCheckBox.length>1) {
      this.CartService.setAllTracks(this.selectedCheckBox,'tracks', index)
    } else {
      let arr = [row];
      this.CartService.setAllTracks(arr, 'tracks', 0)
    }
  }
}
