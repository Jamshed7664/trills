import { Component, OnInit ,AfterViewInit } from '@angular/core';
import { CrudService } from 'src/app/common_service/crud.service';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray} from '@angular/forms';
import { first } from 'rxjs/operators';
import { PostService  } from '../post.service';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {LanguageService} from 'src/app/common_service/language.service';
 import { Http, Headers } from '@angular/http';
import { Observable, forkJoin } from 'rxjs';
 declare var $: any;
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  pagesinfo:any;
page_url:any='';pages;pagename:any='';submitted = false;
constructor(private route: ActivatedRoute,
  private router: Router,private PostService:PostService,
  private CrudService:CrudService, private formBuilder: FormBuilder
  ,private crud: CrudService) { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }


  ngOnInit() {
    if(this.route.snapshot.paramMap.get('url')!='contact-us'){
      this.pagename='';
      let url={"pageurl":this.route.snapshot.paramMap.get('url')};
      this.CrudService.add(url,'pagesDetail').subscribe(data => {
        this.pagesinfo=data['data'];
      });
    }else{
      this.CrudService.add('','settings').subscribe(data => {
        this.pagename=data.message;
        this.pages=data['data'];
        this.pagesinfo='';
      });

    }
    

 
  }
/*
  
  ngOnInit() {
    if(this.route.snapshot.paramMap.get('url')!='contact-us'){
      this.getPage(this.route.snapshot.paramMap.get('url'));
    }
    else{
      this.getPage();
    }

 
  }

  getPage(url=''){
    if(url){
      this.pagename='';
      let url={"pageurl":this.route.snapshot.paramMap.get('url')};
      this.CrudService.add(url,'pagesDetail').subscribe(data => {
        this.pagesinfo=data['data'];
      });
    }else{
      this.CrudService.add('','settings').subscribe(data => {
        this.pagename=data.message;
        this.pages=data['data'];
        this.pagesinfo='';
      });

    }
  }
  */
  
  DataForm = this.formBuilder.group({
    name:['',[Validators.required]],
    phone:['',[Validators.required]],
    email: ['', [
      Validators.required
      ,Validators.email
    ]],
    message:''
  });
  get f() { return this.DataForm.controls; }
  onSubmit(){
    this.submitted = true;
    this.crud.add(this.DataForm.value,'contactUs').subscribe(res => {
      //this.api_calling=false;
      if (res.status==true) {
        this.DataForm.reset();
        this.PostService.snakeMessage(res.message,'OK');
      } else {
        this.PostService.snakeMessage(res.message,'OK');
      }
    });
  }
}
