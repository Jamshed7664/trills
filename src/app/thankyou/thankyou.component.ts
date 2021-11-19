import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankYouComponent implements OnInit {
	
	type:any = '';
	membershipText:string = 'Order Placed successfully';
	
	constructor(
		private route: ActivatedRoute,
		private router: Router
	) { }

  ngOnInit(): void {
    this.type=this.route.snapshot.paramMap.get('type');
	if(this.type==1){
		this.membershipText="Thanks for connect with us with membership";
	}else if(this.type==2){
		this.membershipText="Order Placed successfully";
	}
	
  }

}
