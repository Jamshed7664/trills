

import { HttpClient } from '@angular/common/http';
import { PostService  } from './post.service';
import {Title , Meta} from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm } from '@angular/forms'
import { Component, Inject } from '@angular/core';

import { AuthService } from 'src/app/common_service/auth.service';
import { AlertService } from 'src/app/common_service/alert.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading = false; 
  title = '';
  //version = VERSION;
  results: string[];
  todaydate;page;
addForm: FormGroup;
rows: FormArray;
  itemForm: FormGroup;
 constructor(
  private authService: AuthService,
   private router: Router,
   private formBuilder: FormBuilder,
   private activatedRoute: ActivatedRoute, 
   private titleService: Title,
   private http: HttpClient, 
   private postService: PostService,
   public alertService: AlertService
  ) { 
     this.todaydate = postService.todayDate();

     this.addForm = this.formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
       });
    this.rows = this.formBuilder.array([]);
    
  
  }
    // Making the HTTP Request
    ngOnInit() {
      // this.authService.sessionChk()
      // .pipe(first())
      // .subscribe(
      //     data => {
             
      //     },
      //     error => {
      //         //this.alertService.error(error);
      //         this.loading = false;
      //     });
      this.addForm.get("items").valueChanges.subscribe(val => {
        if (val === true) {
          this.addForm.get("items_value").setValue("yes");
  
          this.addForm.addControl('rows', this.rows);
        }
        if (val === false) {
          this.addForm.get("items_value").setValue("no");
          this.addForm.removeControl('rows');
        }
      });
      var lastindex=window.location.pathname.lastIndexOf('/')+1;
      this.page = window.location.pathname.substring(lastindex);
      this.postService.page.next(this.page);
    //  this.postService.title.subscribe(updatedTitle => {
      //  this.title = updatedTitle;
     // });

    // console.log(event['title']);
      this.alertService.getLoading().subscribe(data=>{
        this.loading = data;
      })

    }

    onAddRow() {
      this.rows.push(this.createItemFormGroup());
    }
  
    onRemoveRow(rowIndex:number){
      this.rows.removeAt(rowIndex);
    }
  
    createItemFormGroup(): FormGroup {
      return this.formBuilder.group({
        name: null,
        description: null,
        qty: null
      });
    }





   /* openDialog() {
      const dialogRef = this.dialog.open(ConfirmationDialog,{
        data:{
          message: 'Are you sure want to delete?',
          buttonText: {
            ok: 'Save',
            cancel: 'No'
          }
        }
      });
      const snack = this.snackBar.open('Snack bar open before dialog');
  
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          snack.dismiss();
          const a = document.createElement('a');
          a.click();
          a.remove();
          snack.dismiss();
          this.snackBar.open('Closing snack bar in a few seconds', 'Fechar', {
            duration: 2000,
          });
        }
      });
    }
  
    openAlertDialog() {
      const dialogRef = this.dialog.open(AlertDialogComponent,{
        data:{
          message: 'HelloWorld',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
    }
  */
}
