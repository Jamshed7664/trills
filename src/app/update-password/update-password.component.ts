import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { ConfirmedValidator } from '../confirmed.validator';
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  updatepwdForm: FormGroup;userData;
  loading = false;
  submitted = false;
  returnUrl: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService:CrudService,
    private config: ConfigService
) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) { 
      this.router.navigate(['/']);
  }
 
}

  ngOnInit(): void {
    this.updatepwdForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required],
     // userData: ['', Validators.required]
      
  }, { 
    validator: ConfirmedValidator('password', 'confirm_password')
  });

  if( localStorage.getItem('Userid')){
    this.userData =localStorage.getItem('Userid');
    
  }

  }
  get f() { return this.updatepwdForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.updatepwdForm.invalid) {
        return;
    }

    this.loading = true;
//console.log(this.updatepwdForm.value);

const formData = new FormData();

formData.append('otp', this.updatepwdForm.controls['otp'].value);

formData.append('id', this.userData);

formData.append('password', this.updatepwdForm.controls['password'].value);

  this.CrudService.add(formData,'reset_password')
  .pipe(first())
  .subscribe(
      data => {
          if (data.status==true) {
            this.alertService.success(data.message, true);
            this.router.navigate(['/login']);
          }
          else if (data.status==false) {
              this.alertService.error(data.message);
          }
      },
      error => {
          this.alertService.error(error);
          this.loading = false;
      });
  }

}


