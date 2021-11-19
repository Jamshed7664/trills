import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray} from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { DataService } from 'src/app/common_service/data.service';
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
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css']
})
export class CreatePlaylistComponent implements OnInit {

  api_calling:boolean = false;
  private titleSubject = new Subject<string>();
  readonly blogPosts$ = this.titleSubject.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((async (titleSubject) => this.fetchTracks(titleSubject))
  ));
  image:any;
  playlistCreate=0;
  tracks:any=[];
  searchData=[];
    public form: FormGroup;
    public contactList: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private dataSerice:DataService,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService:CrudService,
    private config: ConfigService,
    private http: Http  ) {

  }
    playlist_form = this.formBuilder.group({
    name: ['', [
      Validators.required,
    ]],
    description: ['', [
       Validators.required,
    ]],
    tracks: this.formBuilder.array([])
  });

  keyDownHandler(event) {
    if (event.keyCode  === 32)
        event.preventDefault();
  }
  searchPosts(title: string) {
    this.searchData=[];
    if(title){
      var parms={"title":title,"type":0};
      var user='1';
          if (localStorage.getItem('Userid')) {
            user=localStorage.getItem('Userid');
          }
            let user_cookie = {               
            "customer_id" :user
            };
      $.extend(parms,user_cookie);
      this.CrudService.list(parms, 'search').subscribe(res => {
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

  addTracks(track){
      let myArray =this.playlist_form.get("tracks").value;
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
     

           
          this.tracks = this.playlist_form.get("tracks") as FormArray;
   this.playlist_form.valueChanges.pipe(debounceTime(3000) ).subscribe(value => {
        if(this.playlist_form.valid){
             this.createPlaylist('');
          }else{
          this.playlist_form.markAsTouched();
          return ;
        }
         
      }
      );

	this.route.queryParams.subscribe(params => {
        if (params.hasOwnProperty('playlist')) {
          this.playlistCreate = params['playlist'];
          this.CrudService.list({"playlistId":this.playlistCreate}, 'getPlaylist').subscribe(res => {
                 if (res.status) {
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
                            
                var rs=res.data;
                 
                delete rs.tracks;
                 
                this.playlist_form.patchValue(rs);  
            } else {
              this.postService.snakeMessage(res.msg,'');
            }
          });
        }else{
          //this.playlist_form.controls["image"].setValidators(Validators.required);
          //this.playlist_form.controls["image"].updateValueAndValidity();
        }
    });
    
  }
  
  createPlaylist(e){
    if(!this.playlist_form.valid){
      this.playlist_form.markAsTouched();
         return ;
    }
    var url='createPlaylist';
    this.api_calling=true;
    const formData = new FormData();
    formData.append('name', this.playlist_form.controls['name'].value);
    formData.append('description', this.playlist_form.controls['description'].value);
    formData.append('tracks', JSON.stringify(this.playlist_form.controls['tracks'].value));
    if (localStorage.getItem('Userid')) {
      formData.append('Userid', localStorage.getItem('Userid'));
    }
   if( this.playlistCreate!=0){
    formData.append('playlistId',this.playlistCreate.toString());
     url='updatePlaylist';
   }else{
     url='createPlaylist';
   }
    this.CrudService.add(formData,url).subscribe(res => {
        if (res.status) {
          this.playlistCreate=res.data;
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: { playlist:  this.playlistCreate },
              queryParamsHandling: 'merge'
            });
        }
      this.postService.snakeMessage(res.msg,'');
    });
          this.api_calling=false;
      }

}
