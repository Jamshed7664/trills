import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  forgetForm: FormGroup;userData;
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
    this.forgetForm = this.formBuilder.group({
      email: ['', Validators.required]
      //id:[]
  });

  

  }
  get f() { return this.forgetForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgetForm.invalid) {
        return;
    }

    this.loading = true;

  this.CrudService.add(this.forgetForm.value,'forgot_password')
  .pipe(first())
  .subscribe(
      data => {
          if (data.status==true) {
            this.alertService.success(data.message, true);
            localStorage.setItem('Userid', JSON.stringify(data.data.id));
            this.router.navigate(['/updatepassword']);
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
