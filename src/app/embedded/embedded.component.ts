import { Component, OnInit, ViewChild, AfterViewInit,OnDestroy } from '@angular/core';
import { Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { PostService } from '../post.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { variable } from '@angular/compiler/src/output/output_ast';
import { PageService } from 'src/app/common_service/page.service';
import { ActivatedRoute, UrlSerializer, UrlTree, UrlSegmentGroup, DefaultUrlSerializer, UrlSegment, Router } from '@angular/router';
import { CrudService } from 'src/app/common_service/crud.service';
import { BehaviorSubject, Observable, Subject, Subscriber } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-embedded',
  templateUrl: './embedded.component.html',
  styleUrls: ['./embedded.component.css']
})

export class EmbeddedComponent implements OnInit{
	
	embeddedUrl:string = '';
	 
	constructor(
		 
	) 
	{
      
	} 
	
	ngOnInit(): void {
		var rand=1234;
		//var ss='<iframe width="560" height="315" src="'+window.location.origin+'/embed" ></iframe>';
		var ss=window.location.origin+"/embed/"+rand;
       this.embeddedUrl=ss; 
	}
    

}
