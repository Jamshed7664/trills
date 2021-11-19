import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray} from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { DataService } from 'src/app/common_service/data.service';
import { PostService } from '../../post.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Headers } from '@angular/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
  import { Observable } from 'rxjs/Observable';
  import 'rxjs/add/operator/map';
  import 'rxjs/add/operator/debounceTime';
  import 'rxjs/add/operator/distinctUntilChanged';
  import 'rxjs/add/operator/switchMap';

declare var $: any;
@Component({
  selector: 'app-create-coupons',
  templateUrl: './create-coupons.component.html',
  styleUrls: ['./create-coupons.component.css']
})
export class CreateCouponsComponent implements OnInit {

  api_calling:boolean = false;
  private titleSubject = new Subject<string>();
  
  image:any;
  couponsCreate=0;
  tracks:any=[];
  searchData=[];
    public form: FormGroup;
    public contactList: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private dataSerice:DataService,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService:CrudService,
    private config: ConfigService,
    private http: Http  ) {

  }
    coupon_form = this.formBuilder.group({
    name: ['', [
      Validators.required,
    ]],
	price: ['', [
      Validators.required,
    ]],
    description: ['', [
       Validators.required,
    ]] 
  });

  keyDownHandler(event) {
    if (event.keyCode  === 32)
        event.preventDefault();
  }
   

   

    
  ngOnInit(): void {
     
   this.coupon_form.valueChanges.pipe(debounceTime(3000) ).subscribe(value => {
        if(this.coupon_form.valid){
             this.createCoupons('');
          }else{
          this.coupon_form.markAsTouched();
          return ;
        }
         
      }
      );

	this.route.queryParams.subscribe(params => {
        if (params.hasOwnProperty('coupons')) {
          this.couponsCreate = params['coupons'];
          this.CrudService.list({"couponsId":this.couponsCreate}, 'getCoupons').subscribe(res => {
                 if (res.status) {
                            
                var rs=res.data;
                
                this.coupon_form.patchValue(rs);  
            } else {
              this.postService.snakeMessage(res.msg,'');
            }
          });
        }else{
          //this.playlist_form.controls["image"].setValidators(Validators.required);
          //this.playlist_form.controls["image"].updateValueAndValidity();
        }
    });
    
  }
  
  createCoupons(e){
    if(!this.coupon_form.valid){
      this.coupon_form.markAsTouched();
         return ;
    }
    var url='createCoupons';
    this.api_calling=true;
    const formData = new FormData();
    formData.append('name', this.coupon_form.controls['name'].value);
    formData.append('description', this.coupon_form.controls['description'].value);
	formData.append('price', this.coupon_form.controls['price'].value);
    if (localStorage.getItem('Userid')) {
      formData.append('Userid', localStorage.getItem('Userid'));
    }
   if( this.couponsCreate!=0){
    formData.append('couponsId',this.couponsCreate.toString());
     url='updateCoupons';
   }else{
     url='createCoupons';
   }
    this.CrudService.add(formData,url).subscribe(res => {
        if (res.status) {
          this.couponsCreate=res.data;
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: { coupons:  this.couponsCreate },
              queryParamsHandling: 'merge'
            });
        }
      this.postService.snakeMessage(res.msg,'');
    });
          this.api_calling=false;
      }

}
