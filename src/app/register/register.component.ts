import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfirmedValidator } from '../confirmed.validator';
import { PostService  } from '../post.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
@Component({
	templateUrl: 'register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;pages:any;
    loading = false;
    submitted = false;
    buttonDisable = false;
    constructor(
        private CrudService:CrudService,
        public el: ElementRef,
        public PostService:PostService,
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: CrudService,
        private authService: AuthService,
        private alertService: AlertService
        //private CrudService:CrudService
       ) { 
        // redirect to home if already logged in
       
        if (this.authService.currentUserValue) { 
            this.router.navigate(['/']);
        }
        
        
    }

    ngOnInit() {
       
        this.CrudService.add('','pages').subscribe(data => {
            this.pages=data['data'];
           
          });
        this.registerForm = this.formBuilder.group({
            countryCode: '',
            registerType: ['', Validators.required],
			name: ['', [Validators.required, Validators.pattern("^[a-zA-Z0+\\s(),-]+$")]],
            phone: ['', [Validators.required, Validators.minLength(10)]],
            email: ['', [Validators.required,RxwebValidators.email()]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirm_password: ['', [Validators.required]],
            terms: ['', Validators.required]
        }, { 
            validator: ConfirmedValidator('password', 'confirm_password')
          });

          this.registerForm.patchValue(
            {
                countryCode: '91',
				registerType: '1',
          });
		   
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            this.scrollToFirstInvalidControl();
            return;
        }
        this.buttonDisable = true;
        this.loading = true;
        this.userService.add(this.registerForm.value,'signup')
            .pipe(first())
            .subscribe(
                data => {

                    if (data.status==true) {
                        //this.PostService.snakeMessage(data.message,'Danger');
                       // this.alertService.success('Registration successful', true);
                       localStorage.setItem('verifyUser', JSON.stringify(data.data));
                    localStorage.setItem('Userid', JSON.stringify(data.data));
                       this.router.navigate(['/verify']);
                       // this.alertService.success(data.message,true);
                        this.PostService.snakeMessage(data.message,''); 
                   } else {
                    
               // this.currentUserSubject.next(user);
               this.PostService.snakeMessage(data.message,'OK'); 
                  //  this.alertService.error(data.message,true);
                  //  this.router.navigate(['/login']);
                  this.buttonDisable = false
                   }

             
                },
                error => {
                    this.PostService.snakeMessage(error,'OK');
                    //this.alertService.error(error);
                    this.loading = false;
                });
    }
    private scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
          "form .ng-invalid"
        );
    
        window.scroll({
          top: this.getTopOffset(firstInvalidControl),
          left: 0,
          behavior: "smooth"
        });
      }
    
      private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 50;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
      }
}
