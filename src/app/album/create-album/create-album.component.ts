import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AlertService } from 'src/app/common_service/alert.service';
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
import { EncrDecrService } from 'src/app/common_service/EncrDecrService.service';

declare var $: any;
@Component({
  selector: 'app-create-album',
  templateUrl: './create-album.component.html',
  styleUrls: ['./create-album.component.css']
})
export class CreateAlbumComponent implements OnInit {

  api_calling: boolean = false;
  private titleSubject = new Subject<string>();
  readonly blogPosts$ = this.titleSubject.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((async (titleSubject) => this.fetchTracks(titleSubject))
    ));
  image: any;
  albumCreate = 0;
  baseurl;
  licenselist: any = [];
  tags: any = [];
  tracks: any = [];
  searchData = [];
  public form: FormGroup;
  public contactList: FormArray;

  not_for_sale = '0';
  private_discount = '0';

  album_url;

  licenseslist = FormArray;

  searchText: any;
  collaboratorfields;
  profitShare = 100;
  publishing = 100;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private EncrDecr: EncrDecrService,
    private postService: PostService,
    private dataSerice: DataService,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService: CrudService,
    private config: ConfigService,
    private http: Http) {
    this.baseurl = location.origin;
  }
  album_form = this.formBuilder.group({
    name: ['', [
      Validators.required,
    ]],
    track_type: ['', [
      Validators.required,
    ]],
    release_date: ['', [
      Validators.required,
    ]],
    description: ['', [
      Validators.required,
    ]],
    /*track_url: ['', [
      Validators.pattern(/^(https|http):\/\/(?:www\.)?b2cdomain.in\/trilicon/)
    ]],*/
    image: ['', [
      RxwebValidators.image({ minHeight: 500000, minWidth: 500000 })
    ]],
    not_for_sale: 'false',
    private_discount: 'false',
    album_url: '',
    licenseslist: this.formBuilder.array([
      this.formBuilder.group({
        licenseName: [''],
        licenseId: [''],
        licensePrice: ['']
      })
    ]),
    collaborators: this.formBuilder.array([]),
    tags: this.formBuilder.array([]),
    tracks: this.formBuilder.array([])
  });

  keyDownHandler(event) {
    if (event.keyCode === 32)
      event.preventDefault();
  }
  searchPosts(title: string) {
    this.searchData = [];
    if (title) {
      var parms = { "title": title, "type": 0 };
      var user = '1';
      if (localStorage.getItem('Userid')) {
        user = localStorage.getItem('Userid');
      }
      let user_cookie = {
        "customer_id": user
      };
      $.extend(parms, user_cookie);
      this.CrudService.list(parms, 'search').subscribe(res => {
        this.searchData = res.data;
      });
    }
  }

  onPrivateDiscount(e): void {
    let trackUrl;
    trackUrl = this.baseurl + '/album/' + this.albumCreate + '/tracks';

    if (e.target.checked) {
      trackUrl = this.baseurl + '/album/' + this.albumCreate + '/tracks?exclusive_access=' + this.EncrDecr.set('123456$#@$^@1ERF', this.albumCreate);
    }

    this.album_form.patchValue(
      {
        album_url: trackUrl,
      });
  }

  onNotSale(e): void {
    this.album_form.controls['licenseslist'].enable();
    if (e.target.checked) {
      this.album_form.controls['licenseslist'].disable();
    }
  }

  get collaborators() {
    return this.album_form.get('collaborators') as FormArray;
  }

  onKeyUpProfit(x, index) {
    let profits = this.album_form.get('collaborators') as FormArray;

    let sumprofit = 0;
    for (let i = 0; i < profits.length; i++) {
      sumprofit += parseInt(profits.value[i].collaboratorProfit);
    }

    if (sumprofit < 100) {
      this.profitShare = 100 - sumprofit;
    } else {
      ((profits).at(index) as FormGroup).get('collaboratorProfit').patchValue(0);
      let sumprofit = 0;
      for (let i = 0; i < profits.length; i++) {
        sumprofit += parseInt(profits.value[i].collaboratorProfit);
      }
      this.profitShare = 100 - sumprofit;
    }

  }
  onKeyUpPublishing(x, index) {
    let publishes = this.album_form.get('collaborators') as FormArray;

    let sumpublish = 0;
    for (let i = 0; i < publishes.length; i++) {
      sumpublish += parseInt(publishes.value[i].collaboratorPublishing);
    }

    if (sumpublish < 100) {
      this.publishing = 100 - sumpublish;
    } else {
      ((publishes).at(index) as FormGroup).get('collaboratorPublishing').patchValue(0);
      let sumpublish = 0;
      for (let i = 0; i < publishes.length; i++) {
        sumpublish += parseInt(publishes.value[i].collaboratorPublishing);
      }
      this.publishing = 100 - sumpublish;
    }

  }

  addCollaborator(id, userName) {

    let CollaboratorsData = this.album_form.value.collaborators;

    let isexist = CollaboratorsData.filter(el => el.collaboratorUserId == id);

    if (isexist.length == 0) {
      this.collaborators.push(this.formBuilder.group({
        collaboratorUserId: id,
        collaboratorUser: userName,
        collaboratorRole: "master",
        collaboratorProfit: "0",
        collaboratorPublishing: "0"
      }));
    }
  }

  removeCollaborator(index) {
    this.collaborators.removeAt(index);

  }


  getLicense(data) {
    const staffs = this.album_form.get('licenseslist') as FormArray;

    while (staffs.length) {
      staffs.removeAt(0);
    }
    //console.log("ppp",data);

    this.album_form.patchValue(data);
    (data).forEach(staff => staffs.push(this.formBuilder.group(staff)));

  }

  license_list(): void {
    this.CrudService.list({ "user_id": localStorage.getItem('Userid') }, 'getAlbumLicense').subscribe(res => {
      if (res.status) {

        this.licenselist = res.data;

        const staffs = this.album_form.get('licenseslist') as FormArray;

        while (staffs.length) {
          staffs.removeAt(0);
        }

        this.album_form.patchValue(res.data);
        (res.data).forEach(staff => staffs.push(this.formBuilder.group(staff)));

      } else {
        this.postService.snakeMessage(res.msg, '');
      }
    });
  }

  fetchTracks(titleSubject) {
    // this.titleSubject.next(title);
    console.log("fetch");
    var parms = { "title": titleSubject, "type": 1 };
    var user = '1';
    if (localStorage.getItem('Userid')) {
      user = localStorage.getItem('Userid');
    }
    let user_cookie = {
      "customer_id": user
    };
    $.extend(parms, user_cookie);

    //  this.http.post(this.config.backendUrl+'search', parms)
    //   .subscribe((res => {return res} ));

    this.CrudService.list(parms, 'search').subscribe(res => {
      console.log(res.data);
      return res.data
    });

  }


  createTags(id) {
    var title = ((document.getElementById(id) as HTMLInputElement).value);
    if (title) {
      const control2 = new FormControl(title, Validators.required);
      this.tags.push(control2);
      $('#' + id).val('');
    } else {
      this.postService.snakeMessage('Please enter tag first', '');
    }
  }

  deletetag(i) {
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

  addTracks(track) {
    let myArray = this.album_form.get("tracks").value;
    let test = myArray.filter(data => data.id == track.id)
    if (test.length > 0) {
      this.postService.snakeMessage('Tracks already added', '');
    } else {
      const group = new FormGroup({
        id: new FormControl(track.id),
        title: new FormControl(track.title)
      });
      this.tracks.push(group);
    }
  }
  deleteTracks(i) {
    const control = <FormArray>this.tracks;
    control.removeAt(i);
  }

  ngOnInit(): void {

    if (this.route.snapshot.queryParamMap.get("albm") == null) {
      this.license_list();
    }

    this.dataSerice.SelectedImageFromGallery.subscribe(selimage => {
      if (selimage) {
        this.image = selimage.path + "" + selimage.image;
        var imgdata = {
          "image": selimage.image
        }
        this.album_form.patchValue(imgdata);
      }

    });

    this.tags = this.album_form.get("tags") as FormArray;
    this.tracks = this.album_form.get("tracks") as FormArray;
    this.album_form.valueChanges.pipe(debounceTime(3000)).subscribe(value => {
      if (this.album_form.valid) {
        this.createAlbum('');
      } else {
        this.album_form.markAsTouched();
        return;
      }

    }
    );


    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('albm')) {
        this.albumCreate = params['albm'];
        this.CrudService.list({ "albumId": this.albumCreate, "user_id": localStorage.getItem('Userid') }, 'getAlbum').subscribe(res => {
          if (res.status) {

            var tgs = res.data.tags;
            var trcks = res.data.tracks;
            if (trcks) {
              trcks.forEach(function (value) {

                const group = new FormGroup({
                  id: new FormControl(value.id),
                  title: new FormControl(value.name)
                });
                this.tracks.push(group);
              }.bind(this));
            }
            if (tgs) {
              const tagArr = tgs.split(",");
              tagArr.forEach(function (value) {
                this.tags.push(new FormControl(value, Validators.required));
              }.bind(this));
            }
            var rs = res.data;
            delete rs.tags;
            delete rs.tracks;
            this.image = res.data.img_url;
            //this.licenselist=res.data.licenselist;
            this.licenseslist = res.data.licenselist;
            this.album_form.patchValue(rs);

			this.album_form.patchValue({
				not_for_sale:(res.data.not_for_sale==1)?'true':'false',
				private_discount:(res.data.private_discount==1)?'true':'false'
			});

            console.log("lop", rs.private_discount);
            if (rs.not_for_sale == 'true') {
              this.album_form.controls['licenseslist'].disable();
            } else {
              this.album_form.controls['licenseslist'].enable();
              $("#not_for_sale").prop("checked", false);
            }

            if (rs.private_discount == 'true') {
              this.album_form.patchValue(
                {
                  album_url: this.baseurl + '/album/' + this.albumCreate + '/tracks?exclusive_access=' + this.EncrDecr.set('123456$#@$^@1ERF', this.albumCreate)
                });
            } else {
              this.album_form.patchValue(
                {
                  album_url: this.baseurl + '/album/' + this.albumCreate
                });
              $("#private_discount").prop("checked", false);
            }

            this.getLicense(this.licenseslist);
            //this.album_form.get('album_url').setValue(this.baseurl+'/album/'+this.albumCreate+'/tracks');

            for (let i = 0; i < res.data.collaborators.length; i++) {
              this.collaborators.push(this.formBuilder.group({
                collaboratorUserId: res.data.collaborators[i].collaboratorUserId,
                collaboratorUser: res.data.collaborators[i].UserName,
                collaboratorRole: res.data.collaborators[i].user_role,
                collaboratorProfit: res.data.collaborators[i].profit_share,
                collaboratorPublishing: res.data.collaborators[i].publishing
              }));
            }
          } else {
            this.postService.snakeMessage(res.msg, '');
          }
        });
      } else {
        this.album_form.controls["image"].setValidators(Validators.required);
        this.album_form.controls["image"].updateValueAndValidity();
      }
    });
  }


  createAlbum(e) {
    if (!this.album_form.valid) {
      this.album_form.markAsTouched();
      return;
    }
    var url = 'createAlbum';
    this.api_calling = true;

    const formData = new FormData();
    formData.append('name', this.album_form.controls['name'].value);
    formData.append('track_type', this.album_form.controls['track_type'].value);
    formData.append('release_date', this.album_form.controls['release_date'].value);
    formData.append('description', this.album_form.controls['description'].value);
    formData.append('not_for_sale', (this.album_form.controls['not_for_sale'].value)?'1':'0');
    formData.append('private_discount', (this.album_form.controls['private_discount'].value)?'1':'0');
    formData.append('licenseslist', JSON.stringify(this.album_form.controls['licenseslist'].value));
    formData.append('collaborators', JSON.stringify(this.album_form.controls['collaborators'].value));
    //formData.append('track_url', this.album_form.controls['track_url'].value);
    formData.append('image', this.album_form.controls['image'].value);
    formData.append('tags', this.album_form.controls['tags'].value);
    formData.append('tracks', JSON.stringify(this.album_form.controls['tracks'].value));

    if (localStorage.getItem('Userid')) {
      formData.append('Userid', localStorage.getItem('Userid'));
    }
    if (this.albumCreate != 0) {
      formData.append('albumId', this.albumCreate.toString());
      url = 'updateAlbum';
    } else {
      url = 'createAlbum';
    }

    //console.log('licens',this.album_form.controls['licenseslist'].value);
    this.CrudService.add(formData, url).subscribe(res => {
      if (res.status) {
        this.albumCreate = res.data;
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: { albm: this.albumCreate },
            queryParamsHandling: 'merge'
          });
          if(e && e=='save') {
            this.router.navigate(['/albums'])
          }
      }
      this.postService.snakeMessage(res.msg, '');
    });
    this.api_calling = false;
  }


  copyMessage(val: string) {
    console.log(val);
    this.postService.snakeMessage('URL copied to clipboard.', 'OK');
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.innerText = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  /************************Collaborator**********************************/
  onSearchChange(searchValue: string): void {
    let params = {
      "username": searchValue,
      "user_id": localStorage.getItem('Userid'),
    };
    this.CrudService.list(params, 'userSearch').subscribe(data => {
      this.searchText = data['data'];
    })
    //ssssssssssssthis.searchText =searchValue;
  }

  /**************************************************/

}
