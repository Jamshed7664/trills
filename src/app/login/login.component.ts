import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { PostService  } from '../post.service';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
    private PostService:PostService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authService.currentUserValue) { 
          this.router.navigate(['/']);
      }
     
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
 
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {

                    if(data.isOtpVerified==0){
                      //  localStorage.setItem('currentUser', JSON.stringify(data));
                        localStorage.setItem('verifyUser', JSON.stringify(data.data.id));
                        localStorage.setItem('Userid', JSON.stringify(data.data.user_id));
                   // this.currentUserSubject.next(user);
                        this.router.navigate(['/verify']);
                    }
                    else if (data.code==200) {
                   // localStorage.setItem('currentUser', JSON.stringify(data.data));
                    localStorage.setItem('verifyUser', JSON.stringify(0));
                    localStorage.setItem('Userid', JSON.stringify(data.data.user_id));
					localStorage.setItem('registerType', data.data.registerType);


                    if (localStorage.getItem('redirectAfterLogin')) {
                        var str=localStorage.getItem('redirectAfterLogin');
                        localStorage.removeItem("redirectAfterLogin");
                        this.router.navigate([str]);
                    } else{
                        if(data.data.registerType==2){
							this.router.navigate(['/profile']);
						}else{
							this.router.navigate(['/dashboard']);
						}
                    }
                     // this.currentUserSubject.next(user);
                   this.PostService.snakeMessage(data.message,'');
                   // this.router.navigate([this.returnUrl]);
                    }
                    else if (data.code==201) {
                    	this.PostService.snakeMessage('Password not macthed','OK');
                        //this.alertService.error('Password not macthed');
                    }
                    else if (data.code==404) {
                    	this.PostService.snakeMessage('User Not exist','OK');
                        //this.alertService.error('User Not exist');
                    }
                    else if (data.code==401) {
                    	this.PostService.snakeMessage('Your account is disabled','OK');
                        //this.alertService.error('Your account is disabled');
                    }
                },
                error => {
                	this.PostService.snakeMessage(error,'OK');
                    //this.alertService.error(error);
                    this.loading = false;
                });
    }
}
