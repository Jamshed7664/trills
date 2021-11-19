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
import { ConfirmedValidator } from '../confirmed.validator';
 declare var $: any;

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css']
})
export class CredentialsComponent implements OnInit {
  info:any;loading = false;
  submitted = false;address_mode:any=false;
  constructor( 
    private PostService:PostService,
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
    this.address_mode = this.route.snapshot.paramMap.get('url');
  }
 
  DataForm = this.formBuilder.group({
       old_password: ['',[Validators.required]],
       email: '',
       name: '',
       countryCode:'',
       password:'',
       confirm_password:'',
       phone:''
    },{ 
      validator: ConfirmedValidator('password', 'confirm_password')
    });
 
    
  ngOnInit(): void {
    this.DataForm.patchValue(
      {
        //countryCode: '91',
    });
   this.edit(this.address_mode);
  }
  get f() { return this.DataForm.controls; }
  edit(address_mode){
    let  url={
      "Userid":localStorage.getItem('Userid')
    };
    this.CrudService.add(url,'profile').subscribe(data => {
      this.info=data['data'];
      ////////Email//////////////
      //if(address_mode=='email'){
        this.DataForm.setValue(
          {
            email:this.info.email,
            name:this.info.name,
            countryCode:this.info.countryCode,
            old_password: '',
            password:'',
            confirm_password:'',
            phone:this.info.phone
        });
      //}
      //////////////////////////
      
    });  
  }
  onSubmit(address_mode) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.DataForm.invalid) {
        return;
    }
var prm=this.DataForm.value;
prm.user_id=localStorage.getItem('Userid');
prm.updatetype=address_mode;
    this.loading = true;

  if(address_mode=='email'){
    var apiurl='changeUpdate';
  }else if(address_mode=='username'){
    var apiurl='userCheck';
  }
  else if(address_mode=='phone'){
    var apiurl='changeUpdate';
  }
  else if(address_mode=='password'){
    var apiurl='changePassword';
  }

    this.CrudService.add(prm,apiurl)
        .pipe(first())
        .subscribe(
            data => {

              if (data.status==true) {
             //   this.alertService.success(data.message, true);
                this.PostService.snakeMessage(data.message,'OK');
              }
              else if (data.status==false) {
                this.PostService.snakeMessage(data.message,'OK');
                 // this.alertService.error(data.message);
              }

            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
}

}
