import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { PostService } from '../post.service';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  verifyForm: FormGroup; userData;
  loading = false;
  submitted = false;
  returnUrl: string;
  constructor(
    private PostService: PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService: CrudService,
    private config: ConfigService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

  }

  ngOnInit(): void {
    this.verifyForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(4)]],
      //id:[]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }
  get f() { return this.verifyForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.verifyForm.invalid) {
      return;
    }

    this.loading = true;
    // console.log(this.verifyForm.value);
    if (localStorage.getItem('verifyUser')) {
      this.userData = localStorage.getItem('verifyUser');

    }

    this.authService.verifyOTP(this.f.otp.value, this.userData)
      //.pipe(first())
      .subscribe(
        data => {
          console.log("data=", data)
          if (data.status == true || data.code == 200) {
            localStorage.setItem('currentUser', JSON.stringify(data.data));
            localStorage.setItem('verifyUser', JSON.stringify(0));
            localStorage.setItem('Userid', JSON.stringify(data.data.user_id));
            this.authService.currentUserSubject.next(data.data);
            if (data.data.registerType == 1) {
              this.router.navigate(['/pricing']);
            } else {
              /*this.router.navigate(['/dashboard']);*/
				this.router.navigate(['/profile']);
            }

            this.PostService.snakeMessage(data.message, 'Danger');
            //  this.alertService.success('Registration Completed, Logging you in', true);
            // this.router.navigate(['/login']);
          }
          else if (data.status == false) {
            this.PostService.snakeMessage(data.message, 'Ok');
            // this.alertService.error('OTP Incorrect');
          }

        }
        // error => {
        //   alert(1)
        //     this.alertService.error(error);
        //     this.loading = false;
        // });


      )
  }
}
