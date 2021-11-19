import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/common_service/crud.service';
import { User } from 'src/app/_models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AuthService } from 'src/app/common_service/auth.service';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  page=1;
  list_type:any='list';
  blogs:any=[];
  dashboard:any=[];
  filterData: any = '4';
  currentUser: User;
  constructor(  
  private CrudService: CrudService, 
  private router: Router,  
  private route: ActivatedRoute,
  private authService: AuthService) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);

	
	this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const queryParams = {};
        //const tree = this.router.createUrlTree([], { queryParams });
        //this.current_path = serializer.serialize(tree);
        this.apiCall();
      }
    });
   }
   
   filterDataBy(deviceValue) {
    this.filterData = deviceValue;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { filterData: deviceValue },
        queryParamsHandling: 'merge'
      });
	}
	
	apiCall()
	{
		var dashboardParams = {
		  "user_id": localStorage.getItem('Userid'),
		  "date_from": this.filterData
		};
		
		this.CrudService.list(dashboardParams, 'dashboard').subscribe(data => {
			 this.dashboard = data.data;
		});
	}

  ngOnInit(): void {
    var params = {
      "page": this.page
    };
    var user_id='';

    if (localStorage.getItem('Userid')) {
      user_id=localStorage.getItem('Userid');
    }
	
	$.extend(params, {
      "user_id": user_id,
      "list_type": this.list_type
    });
     
    this.CrudService.list(params, 'myblogs').subscribe(data => {
         this.blogs = data.data;
    });
	
	
  }

}
