import { Component, OnInit, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { User } from '../_models/user';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { PostService } from '../post.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import * as moment from 'moment';
import { ThemePalette } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { EncrDecrService } from 'src/app/common_service/EncrDecrService.service';
import { CartService } from '../../app/common_service/cart.service'


declare var $: any;

@Component({
  selector: 'app-trackedit',
  templateUrl: './trackedit.component.html',
  styleUrls: ['./trackedit.component.css']
})

export class TrackeditComponent implements OnInit, AfterViewInit  {
  @ViewChild('picker') picker: any;

  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = "primary";

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required])
  });
  public dateControl = new FormControl(new Date(2021, 9, 4, 5, 6, 7));
  public dateControlMinMax = new FormControl(new Date());

  public listColors = ["primary", "accent", "warn"];

  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];

  imageChangedEvent: any = ''; thumbnail_url: any; youtubeLink : SafeResourceUrl;
  croppedImage: any = '';
  file: File;
  fileName: string = "No file selected";
  imageUrl: string | ArrayBuffer = "https://bulma.io/images/placeholders/480x480.png";
  buttonType: any;
  currentModal: any = 0
  currentModalTitle: any = 'My device';
  userData; info: any; currentUser: User; tagtitle;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null; api_calling = false;
  uploadedFilePath: string = null;
  address: any = ''; Droplist: any;
  form: FormGroup;
  progress: number = 0;
  //DataForm: FormGroup;
  socialForm: FormGroup; address_book_from: FormGroup;
  loading = false;
  submitted = false;
  url; tags: any[]; baseurl;
  licenselist: any[];
  tracktypelist: any;
  newDynamic: any = {};
  alluploaded: any[];
  steamURL;
  itemForm: FormGroup; id: any; image: any; url1; form01_zip: FormGroup; track_stems_rarzip: any;
  rows: FormArray; isShow = false; videos: any[]; allmusicuploaded: any; allmusicuploadedstream: any; videoinfo: any;
  fields: any; licensefields: any; controls: any[]; track_loops: any; form01: FormGroup; results: any;
  Droplist2: any; Droplist3: any; Droplist4: any; Droplist5: any; stemslist: any; searchText: any;

  not_for_sale = '0';
  private_discount = '0';
  options = new FormArray([]);

  track_url;

  licenseForm: FormGroup;
  //licenseslist = new FormArray([]);
  licenseslist = FormArray;
  //collaborators = FormArray;
  collaboratorfields;
  profitShare = 100;
  publishing = 100;
  isMp3Selected = false;
  isZipSelected = false;
  isStreamSelected = false;


  constructor(
    private PostService: PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private EncrDecr: EncrDecrService,
    private authService: AuthService,
    private alertService: AlertService,
    public CrudService: CrudService,
    private config: ConfigService,
    private cartService: CartService,
    private postService: PostService,
    private sanitizer: DomSanitizer) {
    this.baseurl = location.origin;
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    //this.options = this.formBuilder.array([]);



  }

  /*onKeypressEvent(event: any){
  console.log(event.target.value);
    if(event.target.value.length<6){
    alert("no serve")
    }else if(event.target.value.length>50){
    return false;
    }
  }*/

  DataForm = this.formBuilder.group({

    tagtitle: '',
    name: ['', [Validators.required]],
    track_type: ['', [Validators.required]],
    //track_time: '',
    release_date: '',
    not_for_sale: '0',
    private_discount: '0',
    bulk_discounts: '0',
    //price: '',
    //WAVprice: '',
    download_options: '',
    guest_downloads: '',
    require_downloaders: '2',
    social_twitter: '',
    social_sound: '',
    social_trill: '',
    subgenre: '',
    secondary_mood: '',
    BPM: 0,
    track_key: '',
    description: '',
    primary_genre: '',
    primary_mood: '',
    id: '',
    feature_type: '',
    track_url: '',
    //licenseslist: this.formBuilder.array([]) ,
    //licenseslist:new FormArray([]),
    licenseslist: this.formBuilder.array([
      this.formBuilder.group({
        licenseName: [''],
        licenseId: [''],
        licensePrice: ['']
      })
    ]),
    collaborators: this.formBuilder.array([]),
    /*collaborators:this.formBuilder.array([
                  this.formBuilder.group({
            collaboratorUserId: [''],
            collaboratorUser: [''],
            collaboratorRole: [''],
            collaboratorProfit: [''],
            collaboratorPublishing: ['']
          })
              ]),*/
    options: this.formBuilder.array([])
  });

  get df() { return this.DataForm.controls; }

  //get t() { return this.df.licenseslist as FormArray; }

  get collaborators() {
    return this.DataForm.get('collaborators') as FormArray;
  }
  ngAfterViewInit() {
    
    
  }
  onKeyUpProfit(x, index) {
    let profits = this.DataForm.get('collaborators') as FormArray;

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
    let publishes = this.DataForm.get('collaborators') as FormArray;

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

    let CollaboratorsData = this.DataForm.value.collaborators;

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
    this.onKeyUpProfit('', index)
    this.onKeyUpPublishing('', index)

  }

  requestSend(id, requesttype) {
    let url = {
      "user_id": localStorage.getItem('Userid'),
      "request_id": id,
      "requesttype": requesttype
    };
    this.CrudService.add(url, 'sendRequest').subscribe(data => {
      this.info = data['data'];
      this.PostService.snakeMessage(data.message, 'OK');
    });
  }

  onPrivateDiscount(e): void {
    let trackUrl;
    trackUrl = this.baseurl + '/beat/' + this.id;

    if (e.target.checked) {
      trackUrl = this.baseurl + '/beat/' + this.id + '?exclusive_access=' + this.EncrDecr.set('123456$#@$^@1ERF', this.id);
    }

    this.DataForm.patchValue(
      {
        track_url: trackUrl,
      });
  }

  onNotSale(e): void {
    this.DataForm.controls['licenseslist'].enable();
    if (e.target.checked) {
      this.DataForm.controls['licenseslist'].disable();
    }
  }

  // toggleMinDate(evt: any) {
  //   if (evt.checked) {
  //     this._setMinDate();
  //   } else {
  //     this.minDate = null;
  //   }
  // }

  // toggleMaxDate(evt: any) {
  //   if (evt.checked) {
  //     this._setMaxDate();
  //   } else {
  //     this.maxDate = null;
  //   }
  // }

  // closePicker() {
  //   this.picker.cancel();
  // }

  // private _setMinDate() {
  //   const now = new Date();
  //   this.minDate = new Date();
  //   this.minDate.setDate(now.getDate() - 1);
  // }


  // private _setMaxDate() {
  //   const now = new Date();
  //   this.maxDate = new Date();
  //   this.maxDate.setDate(now.getDate() + 1);
  // }

  license_list(): void {
    this.CrudService.list({ "user_id": localStorage.getItem('Userid') }, 'getEnableLicense').subscribe(res => {
      if (res.status) {

        this.licenselist = res.data;

        const staffs = this.DataForm.get('licenseslist') as FormArray;

        while (staffs.length) {
          staffs.removeAt(0);
        }

        this.DataForm.patchValue(res.data);
        (res.data).forEach(staff => staffs.push(this.formBuilder.group(staff)));


      } else {
        this.PostService.snakeMessage(res.msg, '');
      }
    });
  }

  autoSave() {
    setTimeout(() => {
      this.DataForm.valueChanges.pipe(debounceTime(3000)).subscribe(value => {
        if (this.DataForm.valid) {
          var event = {
            "submitter": {
              "name": "save"
            }
          }
  
          /*var evt = new CustomEvent("submitter", {name: "save"});*/
          //console.log(e);		
          this.onSubmit(event);
        } else {
          this.DataForm.markAsTouched();
          return;
        }
  
      });
    }, 1000);
  }

  async ngOnInit() {

    /*this.licenseForm = this.formBuilder.group({
             licenseslist: this.formBuilder.array([
                this.formBuilder.group({
          licenseName: [''],
          licenseId: [''],
          licensePrice: ['']
        })
            ])
    });*/



    
    //this.date = new Date(2021,9,4,5,6,7);
    let query_params = {};
    let apisCallData = [
      {
        "params": { type: 1 },
        "url": "generMoodKey"
      },
      {
        "params": { type: 2 },
        "url": "generMoodKey"
      },
      {
        "params": { type: 3 },
        "url": "generMoodKey"
      },
      {
        "params": { type: 4 },
        "url": "generMoodKey"
      },
      {
        "params": { type: 5 },
        "url": "generMoodKey"
      }
    ];


    this.CrudService.handleMutipleCallAPI(apisCallData).subscribe(data => {
      this.Droplist = data[0].data;
      this.Droplist2 = data[1].data;
      this.Droplist3 = data[2].data;
      this.Droplist4 = data[3].data;
      this.Droplist5 = data[4].data;
    });

    this.form01_zip = this.formBuilder.group({
      track_stems_url: '', //text
      track_stems_pswurl: '', //text

    });
    this.form01 = this.formBuilder.group({
      video_link: ['', Validators.required], //text
      video_title: ['', Validators.required],
      video_description: ['', Validators.required],
    });

    let prm = { "prd_id": this.route.snapshot.paramMap.get('url'), "type": "1", "filetype": 'mp3,wav' };
    this.CrudService.add(prm, 'getMusic').
      subscribe(data => {
        if(data && data.status) {
          this.allmusicuploaded = data['data'];
          if(data.selected == 1) {
            this.isMp3Selected = true
          } else {
            this.isMp3Selected = false
          }
    
        }
       
        //this.profileimg =data['data'];
        //this.imgpath=data.imgpath;
      }
      );

    let prm1 = { "prd_id": this.route.snapshot.paramMap.get('url'), "type": "3", "filetype": 'mp3,wav' };
    await this.CrudService.add(prm1, 'getMusic').
      subscribe(data => {
        if(data && data.status) {
          this.allmusicuploadedstream = data['data'];
          if(data.selected == 1) {
            this.isStreamSelected = true;
          } else {
            this.isStreamSelected = false;
          }
        }
        
        //this.profileimg =data['data'];
        //this.imgpath=data.imgpath;
      }
      );
    let prm3 = { "prd_id": this.route.snapshot.paramMap.get('url'),user_id: localStorage.getItem('Userid'), "type": "1" };
    await this.CrudService.add(prm3, 'getGalleryImage').
      subscribe(data => {
        this.alluploaded = data['data'];
        console.log("prm===",prm3,this.alluploaded);
        //this.profileimg =data['data'];
        //this.imgpath=data.imgpath;
      }
      )



    this.fields = {
      options: [
        {
          title: '',
          source: ''
        }
      ]
    };

    /*this.licensefields = {
         licenseslist: [
           {
             licenseName: '',
         licenseId: '',
             licensePrice: ''
           }
         ]
    };
    
    this.collaboratorfields = {
         collaborators: [
           {
             collaboratorUser: '',
         collaboratorRole: '',
             collaboratorProfit: '',
         collaboratorPublishing: ''
           }
         ]
    };*/


    this.patch();
    //this.collaboratorspatch();
    //this.licensepatch();
    this.CrudService.list('', 'trackType').subscribe(data => {
      this.tracktypelist = data['data'];
      // console.log(data['data']);
    });
    let url = {
      "url": this.route.snapshot.paramMap.get('url'),
      "user_id": localStorage.getItem('Userid')
    };

    this.CrudService.add(url, 'getTrack').subscribe(data => {
      if (data.status == false) {
        this.PostService.snakeMessage(data.message, 'Danger');
        this.router.navigate(['/tracks/my-tracks']);
      }
      this.info = data['data'];

      this.getLicense(data['data'].licenselist);

      this.id = this.info.id;
      this.image = this.info.image;
      this.track_stems_rarzip = this.info.track_stems_rarzip;
      //this.track_loops=this.info.track_loops;
      //this.licenselist=this.info.licenselist;
      this.licenseslist = this.info.licenselist;
      //this.collaborators=this.info.collaborators;

      this.options = this.info.track_loops,
        this.form01_zip.setValue(
          {
            track_stems_pswurl: '',
            track_stems_url: data.data.track_stems_url,
          });


      console.log("tttr",this.info);
      let date: any;
      if(this.info.release_date) {
        date = this.info.release_date.replace(' ', 'T');
        date = date+'Z'
      }
      this.DataForm.patchValue(
        {
          id: this.info.id,
          name: this.info.name,
          /*track_time: this.info.track_time,*/
          release_date: date,
          not_for_sale: this.info.not_for_sale,
          tagtitle: '',
          track_type: data.data.track_type,
          private_discount: this.info.private,
          bulk_discounts: this.info.bulk_discounts,
          //price: this.info.price,
          //WAVprice: this.info.WAVprice,
          download_options: this.info.download_options,
          guest_downloads: this.info.guest_downloads,
          require_downloaders: this.info.require_downloaders,
          social_twitter: this.info.social_twitter,
          social_sound: this.info.social_sound,
          social_trill: this.info.social_trill,
          subgenre: this.info.subgenre,
          secondary_mood: this.info.secondary_mood,
          BPM: this.info.BPM,
          track_key: this.info.track_key,
          description: this.info.description,
          primary_genre: this.info.primary_genre,
          primary_mood: this.info.primary_mood,
          feature_type: '',
          track_url: this.baseurl + '/beat/' + this.info.id,
          licenseslist: this.info.licenselist,
          //collaborators:[],
          //licenseslist:[],
          /*licenseslist:[
  {
    licenseName: '',
    licenseId: '',
    licensePrice: ''
  },
  {
    licenseName: '',
    licenseId: '',
    licensePrice: ''
  },
  {
    licenseName: '',
    licenseId: '',
    licensePrice: ''
  }
],*/
          options: this.info.track_loops
        }
      );
      
      if(this.options && this.options.length>0) {
        this.isShow = true
      }
      if (this.info.not_for_sale == '1') {
        this.DataForm.controls['licenseslist'].disable();
      } else {
        this.DataForm.controls['licenseslist'].enable();
        $("#not_for_sale").prop("checked", false);
      }

      if (this.info.private == '1') {
        this.DataForm.patchValue(
          {
            track_url: this.baseurl + '/beat/' + this.id + '?exclusive_access=' + this.EncrDecr.set('123456$#@$^@1ERF', this.id)
          });
      } else {
        this.DataForm.patchValue(
          {
            track_url: this.baseurl + '/beat/' + this.id
          });
        $("#private_discount").prop("checked", false);
      }


      for (let i = 0; i < this.info.collaborators.length; i++) {
        this.collaborators.push(this.formBuilder.group({
          collaboratorUserId: this.info.collaborators[i].collaboratorUserId,
          collaboratorUser: this.info.collaborators[i].UserName,
          collaboratorRole: this.info.collaborators[i].user_role,
          collaboratorProfit: this.info.collaborators[i].profit_share,
          collaboratorPublishing: this.info.collaborators[i].publishing
        }));
      }

      this.info.collaborators.forEach((element,idx) => {
        this.onKeyUpProfit('',idx)
        this.onKeyUpPublishing('', idx)
      });

    });



    const control = <FormArray>this.DataForm.get('options');
    this.fields.options.forEach(x => {
      control.push(this.patchValues(x.label, x.value))
    })

    /*let control1 = <FormArray>this.DataForm.get('licenseslist');
    this.licensefields.licenseslist.forEach(x => {  
      control1.push(this.licensepatchValues(x.licenseName,x.licenseId, x.licensePrice))
    })*/
    
    this.getTags(this.route.snapshot.paramMap.get('url'));
    this.getVideo(this.route.snapshot.paramMap.get('url'));
    this.getTrackStems(this.route.snapshot.paramMap.get('url'));
    this.options = this.formBuilder.array([]);
    this.autoSave();
    //this.licenseslist = this.formBuilder.array([]);

    //console.log(this.rows);  
    /*this.fields.type.options.forEach(x => {
        control.push(this.patchValues(x.title, x.source))
      })*/

    //this.license_list();
  }
  getLicense(data) {
    const staffs = this.DataForm.get('licenseslist') as FormArray;

    while (staffs.length) {
      staffs.removeAt(0);
    }
    //console.log("ppp",data);

    this.DataForm.patchValue(data);
    (data).forEach(staff => staffs.push(this.formBuilder.group(staff)));

  }
  

  /*****************************Add More**********************************/
  onAddRow() {
    const control = <FormArray>this.DataForm.controls['options'];
    // // control.push()
    this.fields.options.forEach(x => {
      control.push(this.patchValues(x.title, x.source))
    })
  }
  onRemoveRow(rowIndex: number) {
    const fa = (this.DataForm.get('options') as FormArray);
    fa.removeAt(rowIndex);
    // this.fields.options.removeAt(rowIndex);
    // this.rows.removeAt(rowIndex);
  }
  onAddRow1() {
    this.patch();
    //this.rows.push(this.createItemFormGroup());
  }
  patch() {
    // const control = <FormArray>this.DataForm.get('type.options');
    const control = <FormArray>this.DataForm.get('options');
    this.fields.options.forEach(x => {
      control.push(this.patchValues(x.title, x.source))
    })
  }

  patchValues(title, source) {
    return this.formBuilder.group({
      title: [title],
      source: [source]
    })
  }

  /*licensepatch() {
    const control = <FormArray>this.DataForm.get('licenseslist');
    this.licensefields.licenseslist.forEach(x => {
      control.push(this.licensepatchValues(x.name,x.id,x.default_track_price))
    })
  }

  licensepatchValues(licenseName,licenseId, licensePrice) {
  return this.formBuilder.group({
      licenseName:[licenseName],
    licenseId: [licenseId],
      licensePrice: [licensePrice]
    })
  }*/

  collaboratorspatch() {
    // const control = <FormArray>this.DataForm.get('type.options');
    const control = <FormArray>this.DataForm.get('collaborators');
    this.collaboratorfields.collaborators.forEach(x => {
      control.push(this.collaboratorspatchValues(x.collaboratorUser, x.collaboratorRole, x.collaboratorProfit, x.collaboratorPublishing))
    })
  }

  collaboratorspatchValues(collaboratorUser, collaboratorRole, collaboratorProfit, collaboratorPublishing) {
    return this.formBuilder.group({
      collaboratorUser: [collaboratorUser],
      collaboratorRole: [collaboratorRole],
      collaboratorProfit: [collaboratorProfit],
      collaboratorPublishing: [collaboratorPublishing]
    })
  }
  onChangeRequiredDownload() {
    if(this.DataForm.controls['require_downloaders'].value==1) {
        this.DataForm.patchValue({
          social_twitter: '',
          social_sound: '',
          social_trill:''
        })
    }
  }
  /*****************************ADD MORE END*************************************/
  //get f() { return this.DataForm.controls; }
  onSubmit(event) {

    console.log("tttt", this.DataForm.value);
    // onSubmit() {
    // console.log(this.DataForm.controls['title'].value);
    if (event.submitter.name == "draft") { //console.log('draft');
      var feature_type = 0;
    }
    else if (event.submitter.name == "save") { //console.log('save');
      var feature_type = 2;

    } else if (event.submitter.name == "publish") {
      var feature_type = 1;

    }
    this.submitted = true;

    // stop here if form is invalid
    if (this.DataForm.invalid) {
      return;
    }
    // if(this.DataForm.controls['require_downloaders'].value==1) {
    //   this.DataForm.patchValue({
    //     social_twitter: '',
    //     social_sound: '',
    //     social_trill:''
    //   })
    // }
    var prm = this.DataForm.value;
    //console.log('licensecheck',this.DataForm.controls['not_for_sale'].value);
    prm.id = this.route.snapshot.paramMap.get('url');
    prm.feature_type = feature_type;

    this.loading = true;
    this.CrudService.add(prm, 'Updatetrack')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            //this.alertService.success(data.message, true);
            this.PostService.snakeMessage(data.message, 'success');
            if (event.submitter.name == "publish") {
              this.router.navigate(['/tracks/my-tracks'])
            }
          }
          else if (data.status == false) {
            this.PostService.snakeMessage(data.message, 'success');
            //   this.alertService.error(data.message);
          }

        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
  /*************END Form Submit**************/

  /*********Add More functionality***********/
  onAddRow_old() {
    this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow11(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): FormGroup {
    return this.formBuilder.group({
      title: null,
      source: null

    });
  }

  /**************Tags Section *******************/
  createTrack() {

    let query_params = {
      "user_id": localStorage.getItem('Userid')
    };
    this.CrudService.add(query_params, 'createtrack').subscribe(data => {
      if (data.status == true) {
        this.router.navigate(['/tracks/edit/' + data.id]);
        // $('html, body').animate({scrollTop:500},'50');
      } else {
        this.PostService.snakeMessage(data.message, 'OK');
      }
    });

  }

  delete(id) {
    //console.log(id);
    // if (confirm("Want to delete confirm")) {
    let params = {

      "id": id
    };
    this.CrudService.add(params, 'deleteTags').subscribe(data => {
      if (data.status == true) {
        this.getTags(data.id);

        //  this.PostService.snakeMessage(data.message,'success');
      } else {
        //  this.PostService.snakeMessage(data.message,'Danger');
      }

    });
    //}
  }

  getTags(id) {
    //console.log(id);
    let params = {
      "prd_id": id
    };
    this.CrudService.add(params, 'gettags').subscribe(data => {
      this.tags = data['data'];
      //console.log(this.list.length);
    });

  }

  createTags(prd_id) {

    if (this.tags.length < 3) {
      var title = ((document.getElementById("tagtitle") as HTMLInputElement).value);
      //console.log(title);

      let params = {
        "prd_id": prd_id,
        "title": title
      };
      this.CrudService.add(params, 'CreateTags').subscribe(data => {
        if (data.status == true) {
          this.getTags(prd_id);

          this.PostService.snakeMessage(data.message, 'OK');
        } else {
          this.PostService.snakeMessage(data.message, 'OK');
        }

      });
    } else {
      this.PostService.snakeMessage('You can add 3 Tags only', 'OK');
    }
    console.log();
  }
  /**Other section ****/

  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  copyMessage(val: string) {
    console.log(val);
    this.PostService.snakeMessage('URL copied to clipboard.', 'OK');
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

  /**************Video Section *******************/
  importVideo() {
    this.api_calling = false;
    var video_link = $('#video_link').val();
    let videourl = {
      "youtubeurl": video_link

    };
    this.CrudService.add(videourl, 'videoImport').subscribe(data => {
      if (data.status == true) {
        this.thumbnail_url = data.data.thumbnail_url;
        this.youtubeLink= this.sanitizer.bypassSecurityTrustResourceUrl(data.data.youtubelink);
        console.log("this.youtubeLink=",this.youtubeLink)
        // this.youtubeLink = data.data.youtubelink
        this.form01.setValue(
          {
            video_link: video_link,
            video_title: data.data.title,
            video_description: data.data.description,
          });

        // this.PostService.snakeMessage(data.message,'success');     
        // $('html, body').animate({scrollTop:500},'50');
      } else {

        this.PostService.snakeMessage(data.message, 'OK');
      }

    });

  }

  saveVideo() {
    if (!this.form01.valid) {
      this.form01.markAsTouched();
      return;
    }
    this.api_calling = true;
    var video_link = $('#video_link').val();
    var video_title = $('#video_title').val();
    var video_description = $("#video_description").val();




    //console.log(video_link);
    let params = {
      "title": video_title,
      "link": video_link,
      "description": video_description,
      "prd_id": this.route.snapshot.paramMap.get('url')
    };


    this.CrudService.add(params, 'Createvideo')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            this.loading = true;
            this.alertService.success(data.message, true);
            this.getVideo(data.id);
            this.form01.reset();
            this.thumbnail_url = '';
            this.youtubeLink = '';
            $('#myModal').modal('hide');
          }
          else if (data.status == false) {
            this.alertService.error(data.message);
          }

        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
  getVideo(id) {
    //console.log(id);
    let params = {
      "prd_id": id
    };
    this.CrudService.add(params, 'getvideo').subscribe(data => {
      this.videos = data['data'];

    });

  }
  deleteVideo(id) {
    //console.log(id);
    // if (confirm("Want to delete confirm")) {
    let params = {

      "id": id
    };
    this.CrudService.add(params, 'deletevideo').subscribe(data => {
      if (data.status == true) {
        this.getVideo(data.id);

        this.PostService.snakeMessage(data.message, 'OK');
      } else {
        this.PostService.snakeMessage(data.message, 'OK');
      }

    });
    //}
  }
  /**************Gallery Image Section */

  fileChangeEvent(event: any): void {
    let img = new Image()
    img.src = window.URL.createObjectURL(event.target.files[0])
    img.onload = () => {
      if (img.naturalWidth < 500  || img.naturalHeight < 500) {
        this.postService.snakeMessage('Minimum image size should be 500 x 500', '');
      }else if(img.naturalWidth > 1500  || img.naturalHeight > 1500){
        this.postService.snakeMessage('Maximum image size should be 1500 x 1500', '');
      }else {
         this.imageChangedEvent = event;
       $('#uploadArtWork').modal('hide');
       $('#CropPhoto').modal('show');
      }
    }
  
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  changeSection123() {
    $('#exampleModal').modal('hide');
    $('#SteamMedialbum').modal('show');
  }
  changeSection(param1, param2) {
    this.currentModal = param1;
    this.currentModalTitle = param2;
    this.CrudService.list('', 'getGalleryImage').
      subscribe(data => {
        this.alluploaded = data['data'];
      }
      )
  }
  onChange(file: File) {
    if (file) {
      this.fileName = file.name;
      this.file = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        this.imageUrl = reader.result;
        $('#uploadArtWork').modal('hide');
        $('#CropPhoto').modal('show');
      };
    }
  }
  saveImage() {

    // $('#loaderMain').css('display', 'block');
    this.alertService.sendLoading(true);
    let params = {
      "image": this.croppedImage,
      "prd_id": this.route.snapshot.paramMap.get('url'),
      "user_id": localStorage.getItem('Userid'),
      "type": "1",
      "flag": 0
    };


    this.CrudService.add(params, 'imageGallery')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            //  this.alertService.success(data.message, true);
            this.image = data.image;
            this.alluploaded = data['data'];
            this.alertService.sendLoading(false);
            // $('#loaderMain').css('display', 'none');
            $('#CropPhoto').modal('hide');
          }
          else if (data.status == false) {
            this.alertService.sendLoading(false);
            // this.alertService.error(data.message);
          }

        },
        error => {
          this.alertService.error(error);
          this.alertService.sendLoading(false);
          this.loading = false;
        });
  }

  selectGallery(id, type) {
    let params = {
      "id": id,
      "flag": type,
      "prd_id": this.route.snapshot.paramMap.get('url'),
      "user_id": localStorage.getItem('Userid'),
      "type": "1"
    };
    this.alertService.sendLoading(true);
    this.CrudService.add(params, 'GalleryImagedelete')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            //   this.alertService.success(data.message, true);
            $('#uploadArtWork').modal('hide');
            this.alertService.sendLoading(false);
            // this.image=data.image;
            this.image = data.image;
            this.CrudService.add(params, 'getGalleryImage').
              subscribe(data => {
                this.alluploaded = data['data'];

              }
              )

          }
          else if (data.status == false) {
            this.alertService.sendLoading(false);
            //  this.alertService.error(data.message);
          }

        },
        error => {
          this.alertService.error(error);
          this.alertService.sendLoading(false);
          // this.loading = false;
        });
  }

  /**********Music Upload********* */
  selectMusic(id, type) {
    let params: any;
    if(type==1||type==3) {
      params = {
        "id": id,
        "flag": "0",
        "prd_id": this.route.snapshot.paramMap.get('url'),
        "user_id": localStorage.getItem('Userid'),
        "type": type,
        "filetype": 'mp3,wav'
  
      };
    } else if(type==2) {
      params = {
        "id": id,
        "flag": "0",
        "prd_id": this.route.snapshot.paramMap.get('url'),
        "user_id": localStorage.getItem('Userid'),
        "type": type,
        "filetype": 'zip,rar'
  
      };
    }
    this.alertService.sendLoading(true);
    this.CrudService.add(params, 'musicdelete')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            //   this.alertService.success(data.message, true);
            // if(type == 0) {
            //   $('#SteamMedialbum').modal('hide');
            // }
            if(type == 1) {
              $('#mediaWorkTrack').modal('hide');
            }
            if(type == 2) {
              $('#SteamMedialbum').modal('hide');
              
            }
            if(type == 3) {
              $('#mediaWorkTrackStream').modal('hide');
            }
            
            // this.image=data.image;
            // this.image=data.image;
            this.CrudService.add(params, 'getMusic').
              subscribe(data => {
                if (type == 3) {
                  this.allmusicuploadedstream = data['data'];
                  if(data.selected == 1) {
                    this.isStreamSelected = true;
                  } else {
                    this.isStreamSelected = false;
                  }

                } else if(type == 1) {
                  
                  this.allmusicuploaded = data['data'];
                  if(data.selected == 1) {
                    this.isMp3Selected = true;
                  } else {
                    this.isMp3Selected = false;
                  }
                } else if(type == 2) {
                  this.stemslist = data['data'];
                  if(data.selected == 1) {
                    this.isZipSelected = true;
                  } else {
                    this.isZipSelected = false;
                  }
                  
                }
                this.alertService.sendLoading(false);
              }
              )

          }
          else if (data.status == false) {
            this.alertService.sendLoading(false);
            //  this.alertService.error(data.message);
          }

        },
        error => {
          this.alertService.error(error);
          // this.loading = false;
        });
  }
  validateFile(name: String, filetype: any) {
    var ext = name.substring(name.lastIndexOf('.') + 1);

    if (filetype == 2) {
      var type1 = 'mp3';
      var type2 = 'wav';
    }
    if (filetype == 1) {
      var type1 = 'rar';
      var type2 = 'zip';
    }
    if (ext.toLowerCase() == type1 || ext.toLowerCase() == type2) {
      return true;
    }
    else {
      return false;
    }
  }

  fileChangeEventMusic(event, upload_type) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      var fileTypes = ['mp3', 'WAV'];
      if (!this.validateFile(event.target.files[0].name, 2)) {
        this.PostService.snakeMessage('Invalid file type. Files accepted: .MP3, .WAV', 'OK');
        console.log('Selected file format is not supported');
        $('#mediaWorkTrack').modal('hide');
        return false;
      }
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      var extension = event.target.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
        isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types

      var filename = event.target.files[0].name;
      // console.log(filename);

      // $('#loaderMain' + upload_type).css('display', 'block');
      this.alertService.sendLoading(true);
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url1 = event.target.result;

        let params = {
          "image": this.url1,
          "filename": filename,
          "extension": extension,
          "prd_id": this.route.snapshot.paramMap.get('url'),
          "user_id": localStorage.getItem('Userid'),
          "upload_type": upload_type,
          "type": "1"
        };

        this.CrudService.add(params, 'addmusicGallery')
          .pipe(first())
          .subscribe(
            data => {

              if (data.status == true) {
                //this.alertService.success(data.message, true);
                // this.image=data.image;

                /*let  prm={"prd_id":this.route.snapshot.paramMap.get('url'),"type":"1","filetype":'mp3,wav'};*/
                let prm = { "prd_id": this.route.snapshot.paramMap.get('url'), "type": upload_type, "filetype": 'mp3,wav' };
                this.CrudService.add(prm, 'getMusic').
                  subscribe(data => {

                    if(data && data.status) {
                      if (upload_type == 3) {
                        this.allmusicuploadedstream = data['data'];
                        if(data.selected == 1) {
                          this.isStreamSelected = true;
                        } else {
                          this.isStreamSelected = false;
                        }
      
                      } else if(upload_type == 1) {
                        
                        this.allmusicuploaded = data['data'];
                        if(data.selected == 1) {
                          this.isMp3Selected = true;
                        } else {
                          this.isMp3Selected = false;
                        }
                      } else if(upload_type == 2) {
                        this.stemslist = data['data'];
                        if(data.selected == 1) {
                          this.isZipSelected = true;
                        } else {
                          this.isZipSelected = false;
                        }
                        
                      }
                    }
                  }
                  );
                  this.alertService.sendLoading(false);
                // $('#loaderMain' + upload_type).css('display', 'none');
                if (upload_type == 3) {
                  $('#mediaWorkTrackStream').modal('hide');
                } else {
                  $('#mediaWorkTrack').modal('hide');
                }
              }
              else if (data.status == false) {
                this.alertService.error(data.message);
              }

            },
            error => {
              this.alertService.error(error);
              this.loading = false;
            });

        // console.log(this.url1);
      }
    }
  }
  /****************************************************************/
  getTrackStems(id) {
    //console.log(id);
    let params = {
      "prd_id": id,
      "type": 2,
      "filetype": 'zip,rar',
    };
    this.CrudService.add(params, 'getMusic').subscribe(data => {
      this.stemslist = data['data'];
      if(data.selected == 1) {
        this.isZipSelected = true;
      } else {
        this.isZipSelected = false;
      }
      // console.log(this.stemslist);
    });

  }
  fileChangeEventSteam(event: any, upload_type) {
    
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      var fileTypes = ['rar', 'zip'];
      if (!this.validateFile(event.target.files[0].name, 1)) {
        this.PostService.snakeMessage('Invalid file type. Files accepted: .zip, .rar', 'Danger');
        $('#exampleModal').modal('hide');
        $('#SteamMedialbum').modal('hide');
        //console.log('Selected file format is not supported');
        return false;
      }


      reader.readAsDataURL(event.target.files[0]); // read file as data url
      var extension = event.target.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
        isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types

      this.steamURL = event.target.files[0].name;
      // console.log(filename);
      // $('#loaderMain'+upload_type).css('display','block');
      this.alertService.sendLoading(true);
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url1 = event.target.result;
        let params = {
          "image": this.url1,
          "filename": this.steamURL,
          "extension": extension,
          "prd_id": this.route.snapshot.paramMap.get('url'),
          "user_id": localStorage.getItem('Userid'),
          "upload_type": upload_type,
          "type": "1"
        };

        this.CrudService.add(params, 'addmusicGallery')
          .pipe(first())
          .subscribe(
            data => {

              if (data.status == true) {
                //this.alertService.success(data.message, true);
                // this.image=data.image;
                this.getTrackStems(this.route.snapshot.paramMap.get('url'));
                //                  let  prm={"prd_id":this.route.snapshot.paramMap.get('url'),"type":"1","filetype":extension};
                // this.CrudService.add(prm,'getMusic').
                // subscribe(data => {
                //      this.allmusicuploaded=data['data'];
                //      //this.profileimg =data['data'];
                //      //this.imgpath=data.imgpath;
                // }
                // );
                // $('#loaderMain'+upload_type).css('display','none');
                this.alertService.sendLoading(false);
                $('#exampleModal').modal('hide');
                this.PostService.snakeMessage(data.message, 'OK');
              }
              else if (data.status == false) {
                this.alertService.error(data.message);
              }

            },
            error => {
              this.alertService.error(error);
              this.loading = false;
            });
        // console.log(this.url1);

      }
    }
  }
  saveSteam() {

    var track_stems_url = $("#track_stems_url").val();
    var track_stems_pswurl = $("#track_stems_pswurl").val();
    let params = {
      // "image":this.url1,
      // "steamURL":this.steamURL,
      "id": this.route.snapshot.paramMap.get('url'),
      "user_id": localStorage.getItem('Userid'),
      "track_stems_url": track_stems_url,
      "track_stems_pswurl": track_stems_pswurl
    };

    this.CrudService.add(params, 'updateSteam')
      .pipe(first())
      .subscribe(
        data => {

          if (data.status == true) {
            //  this.alertService.success(data.message, true);
            // this.image=data.image;

            $('#exampleModal').modal('hide');
          }
          else if (data.status == false) {
            this.alertService.error(data.message);
          }

        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

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
