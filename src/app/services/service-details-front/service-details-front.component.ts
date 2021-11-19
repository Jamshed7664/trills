import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray} from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { PostService } from 'src/app/post.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Headers } from '@angular/http';
import { CartService } from 'src/app/common_service/cart.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
  import { Observable } from 'rxjs/Observable';
  import 'rxjs/add/operator/map';
  import 'rxjs/add/operator/debounceTime';
  import 'rxjs/add/operator/distinctUntilChanged';
  import 'rxjs/add/operator/switchMap';

declare var $: any;
@Component({
  selector: 'app-service-details-front',
  templateUrl: './service-details-front.component.html',
  styleUrls: ['./service-details-front.component.css']
})
export class ServiceDetailsFrontComponent implements OnInit {

      url=0;
      type:any;
      userid=0;
    tracks:any=[];
    album:any;
    selected_product:any;
    licenses:any;
    currency:any;
	
	selected_album_msg:any;
	createMessageForm: FormGroup;
	loading = false;
	cmsubmitted = false;
	cmf_success=false;
	
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public CartService: CartService, 
    private postService: PostService,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService:CrudService,
    private config: ConfigService,
    private http: Http  ) {
      this.currency = this.postService.currency();
  }
  
  get cmf() { return this.createMessageForm.controls; }
  
  createMessage(album){
		
		this.cmsubmitted = true;
		this.cmf_success = false;
		
		if (this.createMessageForm.invalid) {
            return;
        }
		this.loading = true;
		
		this.CrudService.add({
			  "Userid":localStorage.getItem('Userid'), 
			  "flag":'service',
			  "receiveUser":album.artist_id,
			  "message":this.cmf.messageBox.value 
		  }
		,'addMessage').subscribe(res => {
			if(res.status){
				//this.products[i].isIamLiking=!data.isIamLiking;
				this.cmf_success = true;
				this.createMessageForm.reset();
				
			
			}
			this.postService.snakeMessage(res.msg,'');
		});
		
	}
	
	open_close_modal_message(open_modal_id,close_modal_id,qty,album){
    
    this.selected_album_msg=album;
	$('#myModalMessage'+open_modal_id).modal('toggle');
  }
  
  add_to_cart(qty: any, product: any) {
    var item = {
      "product_id": product.id,
      "qty": qty,
      "license":0
    };
    this.CartService.addToCart(item);
  }
  add_to_cart2(qty: any, product: any,lncs) {
    var item = {
      "product_id": product.id,
      "qty": qty,
      "license":lncs
    };
    this.CartService.addToCart(item);
  }
  
  open_close_modal(open_modal_id,close_modal_id,qty,prd){
    
    if(close_modal_id!=0){
      $('#myModalprocess'+close_modal_id).modal('hide');
    }
    if(open_modal_id!=0){
      this.selected_product=prd;
      var params = {
        "trackId": prd.id
      };
    
      this.CrudService.add(params, 'track_licenses').subscribe(data => {
        this.licenses=data.data;
        if (data.success) {
          $('#myModalprocess'+open_modal_id).modal('toggle');
        }else{
          this.postService.snakeMessage(data.msg,'');
        }
      });

      
    }
}

  ngOnInit(): void {
       

    this.url=this.route.snapshot.params.url;
    this.userid=this.route.snapshot.params.id;
    this.type=this.route.snapshot.params.type;
          console.log("this type "+this.type);
      this.CrudService.list({"url":this.url,"user_id":this.userid}, 'track').subscribe(res => {
          if (res.status) {
          var rs=res.data;
          this.album=rs;
        console.log( this.album);

          } else {

          }
      });
	  
	this.createMessageForm = this.formBuilder.group({
		messageBox: ['', Validators.required]
	});
	
  }
  


}

