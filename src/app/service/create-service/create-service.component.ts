import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray} from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { PostService } from '../../post.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Headers } from '@angular/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DataService } from 'src/app/common_service/data.service';

  import { Observable } from 'rxjs/Observable';
  import 'rxjs/add/operator/map';
  import 'rxjs/add/operator/debounceTime';
  import 'rxjs/add/operator/distinctUntilChanged';
  import 'rxjs/add/operator/switchMap';

declare var $: any;
@Component({
      selector: 'app-create-service',
      templateUrl: './create-service.component.html',
      styleUrls: ['./create-service.component.css']
})
export class CreateServiceComponent implements OnInit {
  api_calling:boolean = false;
  private titleSubject = new Subject<string>();
  readonly blogPosts$ = this.titleSubject.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((async (titleSubject) => this.fetchTracks(titleSubject))
  ));
  image:any;
  albumCreate=0;
  tags:any=[];
  tracks:any=[];
  collabs:any=[];
  searchText:any
  searchData=[];
    public form: FormGroup;
    public contactList: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dataSerice:DataService,
    private postService: PostService,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService:CrudService,
    private config: ConfigService,
    private http: Http  ) {

  }
    album_form = this.formBuilder.group({
    name: ['', [
      Validators.required,
    ]],
    track_type: ['', [
     Validators.required,
    ]],
    price_type: ['', [
      Validators.required,
    ]],
    price: ['', [
      Validators.required,
    ]],
    description: ['', [
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
   requestSend(id,requesttype){
    let  url={
      "user_id":localStorage.getItem('Userid'),
      "request_id":id,
      "requesttype":requesttype
    };
    this.CrudService.add(url,'sendRequest').subscribe(data => {
      // this.info=data['data'];
      this.postService.snakeMessage(data.message,'OK');
    });
  }
  
  onSearchChange(searchValue: string): void {  
  let  params={
    "username":searchValue,
    "user_id":localStorage.getItem('Userid'),
  };
  this.CrudService.list(params,'userSearch').subscribe(data => {
  this.searchText = data['data'];
  })
  //ssssssssssssthis.searchText =searchValue;
}
  addCalTothis(val){
    if(val){
        var parms={};
        var user='';
          if (localStorage.getItem('Userid')) {
            user=localStorage.getItem('Userid');
          }
        let user_cookie = {               
        "customer_id" :user,
        "collab_id" :val
        };
      $.extend(parms,user_cookie);
      this.CrudService.list(parms, 'searchUser').subscribe(res => {
           this.postService.snakeMessage(res.msg,'');
      });

    }else{
      this.postService.snakeMessage('Please Select a collaborator','');
    }
     
  }
  searchPosts(title: string) {
    this.searchData=[];
    if(title){
      var parms={"title":title};
      var user='1';
          if (localStorage.getItem('Userid')) {
            user=localStorage.getItem('Userid');
          }
            let user_cookie = {               
            "customer_id" :user
            };
      $.extend(parms,user_cookie);
      this.CrudService.list(parms, 'searchUser').subscribe(res => {
           this.searchData=res.data;
      });
    }
  }

  fetchTracks(titleSubject){
     // this.titleSubject.next(title);
    console.log("fetch");
var parms={"title":titleSubject,"type":1};
var user='1';
    if (localStorage.getItem('Userid')) {
      user=localStorage.getItem('Userid');
    }
      let user_cookie = {               
      "customer_id" :user
      };
$.extend(parms,user_cookie);

  //  this.http.post(this.config.backendUrl+'search', parms)
  //   .subscribe((res => {return res} ));

this.CrudService.list(parms, 'search').subscribe(res => {
 console.log(res.data);
 return res.data
});
  
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
  getImage(event) {
      if (event.target.files.length === 0)
      return;
    const file = (event.target as HTMLInputElement).files[0];
    this.album_form.patchValue({
      image: file
    });
    this.album_form.get('image').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  addTracks(track){
      let myArray =this.album_form.get("tracks").value;
    let test = myArray.filter(data => data.id == track.id)
      if (test.length > 0) {
        this.postService.snakeMessage('Tracks already added','');
      } else {
          const group = new FormGroup({
            id: new FormControl(track.id),
            title: new FormControl(track.title)
          });
      this.tracks.push(group);
      }
  }
  deleteTracks(i){
    const control = <FormArray>this.tracks;
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
             this.createService('');
          }else{
          this.album_form.markAsTouched();
          return ;
        }
         
      }
      );

    this.route.queryParams.subscribe(params => {
        if (params.hasOwnProperty('serviceId')) {
          this.albumCreate = params['serviceId'];
            var colls={};
              if (localStorage.getItem('Userid')) {
               colls = {               
                "customer_id" :localStorage.getItem('Userid')
                };
              }else{
                colls = {               
                "customer_id" :0
                };
              }

            this.CrudService.list(colls, 'fetchCollabuser').subscribe(res => {
                    this.collabs=res.data;
            });
          this.CrudService.list({"serviceId":this.albumCreate}, 'getService').subscribe(res => {
                 if (res.status) {
                        var tgs=res.data.tags;
                        var trcks=res.data.tracks;
                        if(trcks){
                          trcks.forEach(function (value) {

                                const group = new FormGroup({
                                  id: new FormControl(value.id),
                                  title: new FormControl(value.name)
                                });
                                  this.tracks.push(group);
                          }.bind(this)); 
                        }
                           if(tgs){
                          const tagArr= tgs.split(",");                     
                          tagArr.forEach(function (value) {
                                this.tags.push( new FormControl(value, Validators.required));
                          }.bind(this)); 
                        }
                var rs=res.data;
                delete rs.tags;
                delete rs.tracks;
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
  


  open_close_modal(open_modal_id,close_modal_id){
    
    $('#myModalprocess'+open_modal_id).modal('toggle');
    
}
  createService(e){
    if(!this.album_form.valid){
      this.album_form.markAsTouched();
         return ;
    }
    var url='createService';
    this.api_calling=true;
    const formData = new FormData();
    formData.append('name', this.album_form.controls['name'].value);
    formData.append('track_type', this.album_form.controls['track_type'].value);
    formData.append('description', this.album_form.controls['description'].value);
    formData.append('price', this.album_form.controls['price'].value);
    formData.append('image', this.album_form.controls['image'].value);
    formData.append('tags', this.album_form.controls['tags'].value);
    formData.append('price_type', JSON.stringify(this.album_form.controls['price_type'].value));
    if (localStorage.getItem('Userid')) {
      formData.append('Userid', localStorage.getItem('Userid'));
    }
   if( this.albumCreate!=0){
    formData.append('serviceId',this.albumCreate.toString());
     url='updateService';
   }else{
     url='createService';
   }
    this.CrudService.add(formData,url).subscribe(res => {
        if (res.status) {
          this.albumCreate=res.data;
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: { serviceId:  this.albumCreate },
              queryParamsHandling: 'merge'
            });
        }
      this.postService.snakeMessage(res.msg,'');
    });
          this.api_calling=false;
      }

}
