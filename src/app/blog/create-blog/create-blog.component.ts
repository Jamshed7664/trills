import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray} from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { DataService } from 'src/app/common_service/data.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
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
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit {

  api_calling:boolean = false;

  image:any;
  albumCreate=0;
  tags:any=[];
  tracks:any=[];
  searchData=[];
    public form: FormGroup;
    public contactList: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService:CrudService,
    private dataSerice:DataService,
    private config: ConfigService,
    private http: Http  ) {

  }
    album_form = this.formBuilder.group({
    name: ['', [
      Validators.required,
    ]],
    category: ['', [
     Validators.required
    ]],
    
    featured: ['no', [
      Validators.required,
    ]],
    description: ['', [
       Validators.required,
    ]],
    excert: ['', [
      Validators.required,
    ]],
     image: ['', [
      RxwebValidators.image({minHeight:500000  ,minWidth:500000 })
    ]],
    tags: this.formBuilder.array([])
  });

  keyDownHandler(event) {
    if (event.keyCode  === 32)
        event.preventDefault();
  }
  
  createTags(id) {
    var title = ((document.getElementById(id) as HTMLInputElement).value);
    if(title){
        const control2 = new FormControl(title, Validators.required);
        this.tags.push(control2);
    $('#'+id).val('');
    }else{
      this.postService.snakeMessage('Please enter tag first','');
    }
    }

  deletetag(i){
    const control = <FormArray>this.album_form.controls.tags;
    control.removeAt(i);
  }
 

  ngOnInit(): void {
        this.dataSerice.SelectedImageFromGallery.subscribe(selimage => {
          if(selimage){
            this.image=selimage.path+""+selimage.image;
            var imgdata={
              "image":selimage.image
            }
            this.album_form.patchValue(imgdata);  
          }
          
        });

          this.tags = this.album_form.get("tags") as FormArray;
          this.tracks = this.album_form.get("tracks") as FormArray;
   this.album_form.valueChanges.pipe(debounceTime(3000) ).subscribe(value => {
        if(this.album_form.valid){
             this.createBlog('');
          }else{
          this.album_form.markAsTouched();
          return ;
        }
         
      }
      );

    this.route.queryParams.subscribe(params => {
        if (params.hasOwnProperty('blogId')) {
          this.albumCreate = params['blogId'];
          this.CrudService.list({"blogId":this.albumCreate}, 'getBlog').subscribe(res => {
                 if (res.status) {
                        var tgs=res.data.tags;
                           if(tgs){
                          const tagArr= tgs.split(",");                     
                          tagArr.forEach(function (value) {
                                this.tags.push( new FormControl(value, Validators.required));
                          }.bind(this)); 
                        }
                var rs=res.data;
                delete rs.tags;
                this.image=res.data.img_url;
                this.album_form.patchValue(rs);  
            } else {
              this.postService.snakeMessage(res.msg,'');
            }
          });
        }else{
          this.album_form.controls["image"].setValidators(Validators.required);
          this.album_form.controls["image"].updateValueAndValidity();
        }
    });
  }
  
  createBlog(e){
   
    if(!this.album_form.valid){
      this.album_form.markAsTouched();
         return ;
    }
    var url='updateBlog';
    this.api_calling=true;
    const formData = new FormData();
    formData.append('name', this.album_form.controls['name'].value);
    formData.append('category', this.album_form.controls['category'].value);
    formData.append('featured', this.album_form.controls['featured'].value);
    formData.append('description', this.album_form.controls['description'].value);
    formData.append('excert', this.album_form.controls['excert'].value);
    formData.append('tags', this.album_form.controls['tags'].value);
    formData.append('image', this.album_form.controls['image'].value);
    if (localStorage.getItem('Userid')) {
      formData.append('Userid', localStorage.getItem('Userid'));
    }
   if( this.albumCreate!=0){
    formData.append('blogId',this.albumCreate.toString());
     url='updateBlog';
   }else{
     url='createBlog';
   }
    this.CrudService.add(formData,url).subscribe(res => {
        if (res.status) {
          this.albumCreate=res.data;
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: { blogId:  this.albumCreate },
              queryParamsHandling: 'merge'
            });
        }
      this.postService.snakeMessage(res.msg,'');
    });
          this.api_calling=false;
      }

}
