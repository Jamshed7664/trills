import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { User } from '../_models/user';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { PostService  } from '../post.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

 declare var $: any;

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  packagelist:any[];
  constructor( 
    public PostService:PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    public CrudService:CrudService,
    private config: ConfigService) {  
  if (!this.authService.currentUserValue) { 
      this.router.navigate(['/login']);
  } 
  }
  ngOnInit(): void {
    this.CrudService.list('','packages').subscribe(data => {    
      this.packagelist =data['plan_list'];
    });
  }
  
  purchasePlan(planId)
  {
		var params = {
			"trsn_id":0,
			"category_id":0,
			"package_id": planId,
			"user_id":localStorage.getItem('Userid'),
		};
		
		this.CrudService.list(params,'buypackage').subscribe(data => {    
		  
		  this.PostService.snakeMessage('Membership Purchased','');
		  this.router.navigate(['thank-you/1']);
		  
		});
  }


}
