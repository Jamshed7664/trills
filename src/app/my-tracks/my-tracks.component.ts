import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
//import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { User } from '../_models/user';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { PostService } from '../post.service';
import { CartService } from 'src/app/common_service/cart.service';


import { HttpEvent, HttpEventType } from '@angular/common/http';
import * as fileSaver from 'file-saver';

declare var $: any;

@Component({
  selector: 'app-my-tracks',
  templateUrl: './my-tracks.component.html',
  styleUrls: ['./my-tracks.component.css']
})
export class MyTracksComponent implements OnInit {

  DataForm: FormGroup; socialForm: FormGroup; address_book_from: FormGroup;
  loading = false;
  submitted = false;
  api_calling = false;
  state_data: any;
  city_data: any;
  address_data: any;
  address_mode: any = false;
  address_id: any = 0;
  form: FormGroup; list: any[];
  selected_product_download: any;
  page: any;
  totalRec: any;
  checkAll = false;
  selectedCheckBox = []
  constructor(
    private PostService: PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    //private alertService: AlertService,
    public CartService: CartService,
    private CrudService: CrudService,
    private config: ConfigService) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
    }
    this.form = this.formBuilder.group({
      avatar: [null]
    })

  }

  ngOnInit(): void {
    this.get_list();
    //window.document.getElementsByClassName('loaderBody').style.display = 'none';
    //window.document.getElementById('loading').style.display = 'none';
    //$('#loaderMain').css('display','none');
  }

  open_close_modal_download(open_modal_id, close_modal_id, qty, prd) {
    //document.getElementById('loading').style.display = 'none';
    this.selected_product_download = prd;
    $('#myModalDownload' + open_modal_id).modal('toggle');
  }

  downloadFile(data, i) {
    let url1 = '';
    let FileName = '';
    let FileType = '';
    let path = 'public/uploads/music/';
    let user_id = localStorage.getItem('Userid');



    if (i == 1) {
      /*Yes, untagged (MP3 Version - 320kbps)*/
      FileType = 'audio/mp3; charset=utf-8';

      this.CrudService.list({ "trackId": data.id, "downloadType": i, "fileType": 'mp3' }, 'getMusicGallery').subscribe(res => {
        if (res.status) {
          //url1=res.path+res.data.image;
          url1 = path + res.data.image;
          FileName = res.data.image;
          this.downloadFiles(url1, FileType, FileName);
        }
      });
    } else if (i == 2) {
      /*Yes, with voice tag (MP3 Version)*/
      FileType = 'application/x-zip-compressed; charset=utf-8';

      this.CrudService.list({ "trackId": data.id, "downloadType": i, "fileType": 'zip' }, 'getMusicGallery').subscribe(res => {
        if (res.status) {
          //url1=res.path+res.data.image;
          url1 = path + res.data.image;
          FileName = res.data.image;
          this.downloadFiles(url1, FileType, FileName);
        }
      });

    } else if (i == 3) {
      /*Yes, untagged (MP3 Version - 320kbps)*/
      FileType = 'audio/mp3; charset=utf-8';

      this.CrudService.list({ "trackId": data.id, "downloadType": i, "fileType": 'mp3' }, 'getMusicGallery').subscribe(res => {

        if (res.status) {
          //url1=res.path+res.data.image;
          url1 = path + res.data.image;
          FileName = res.data.image;
          this.downloadFiles(url1, FileType, FileName);
        }
      });
    }


  }

  downloadFiles(url1, downloadType, FileName) {
    //window.document.getElementById('loading').style.display = 'block';
    $('#loaderMain').css('display', 'block');
    this.CrudService.getTrackUrl(url1).subscribe(response => {
      let blob: any = new Blob([response], { type: downloadType });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, FileName);
      $('#loaderMain').css('display', 'none');
    }), error => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully');

    /*let  params={
      "user_id":localStorage.getItem('Userid'),
      "url":url1
    };
    this.CrudService.add(params,'downloadEmailTrack').subscribe(data => {
      this.postService.snakeMessage(data['message'],'');
    });*/
  }

  get_list() {
    let params = {
      "user_id": localStorage.getItem('Userid'),
      "future_type": 0,
      "feature_type": 1,
      "product_type": 0
    };
    this.CrudService.add(params, 'tracklist').subscribe(data => {
      this.list = data['data'];
      //console.log(this.list.length);
    });

  }
  createTrack() {

    let query_params = {
      "user_id": localStorage.getItem('Userid')
    };
    this.CrudService.add(query_params, 'createtrack').subscribe(data => {
      if (data.status == true) {
        this.router.navigate(['/tracks/edit/' + data.id]);
        // $('html, body').animate({scrollTop:500},'50');
      } else {
        this.PostService.snakeMessage(data.message, 'Danger');
      }

    });

  }

  delete(id) {
    if (confirm("Want to delete confirm")) {
      let params = {
		"flag":1,
        "id": id
      };
      this.CrudService.add(params, 'deleteTrack').subscribe(data => {
        if (data.status == true) {
          this.get_list();

          this.PostService.snakeMessage(data.message, 'success');
        } else {
          this.PostService.snakeMessage(data.message, 'Danger');
        }

      });
    }
  }
  getPage(page: number) {
    this.page = page;

  }
  onCheckAll() {
    console.log(this.checkAll)
    this.selectedCheckBox = [];
    if(this.checkAll) {
      this.selectedCheckBox = [...this.list];
    }
  }
  onChangeSingleCheckbox(event, row) {
    
    if(event && event.target && event.target.checked) {
      this.selectedCheckBox.push(row);
    } else {
      const index = this.selectedCheckBox.indexOf(row);
      if (index > -1) {
        this.selectedCheckBox.splice(index, 1);
      }
    }
    
  }
  playTrack(row, index) {
    if(this.selectedCheckBox.length>1) {
      this.CartService.setAllTracks(this.selectedCheckBox,'tracks', index)
    } else {
      let arr = [row];
      this.CartService.setAllTracks(arr, 'tracks', 0)
    }
  }
  onclickTrackDetails(row) {
    console.log("row==",row)
  }
}
