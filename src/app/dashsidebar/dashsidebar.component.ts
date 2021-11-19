import { Component, OnInit ,Input} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscriber} from 'rxjs';
//import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from 'src/app/common_service/crud.service';
import { CartService } from 'src/app/common_service/cart.service';
import {PageService} from 'src/app/common_service/page.service';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-dashsidebar',
  templateUrl: './dashsidebar.component.html',
  styleUrls: ['./dashsidebar.component.css']
})
  export class DashsidebarComponent implements OnInit{
  @Input('current_page') page_name: string;
  sitelang = '';
  constructor(
    private CartService:CartService,
   // private fb: FormBuilder,
    private router:Router,
    private route: ActivatedRoute,
    private CrudService:CrudService
  ) {
     }

  ngOnInit() {
      	$("#account-btn").on("click", function() {
				$("#mobile-show").slideToggle("2000");
			});
  }
  

}
