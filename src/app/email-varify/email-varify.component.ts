import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService} from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { PostService  } from '../post.service';

@Component({
  selector: 'app-email-varify',
  templateUrl: './email-varify.component.html',
  styleUrls: ['./email-varify.component.css']
})
export class EmailVarifyComponent implements OnInit {
  currentURL='';code='';identifier='';
  constructor(private CrudService:CrudService, private PostService:PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.code=this.route.snapshot.queryParams['code'];
    this.identifier=this.route.snapshot.queryParams['identifier'];
    let  url={
      "id":this.route.snapshot.queryParams['fordate'],
      "otp":this.route.snapshot.queryParams['code'],
      "email":this.identifier
    };
   
    this.CrudService.add(url,'verify_otp').subscribe(res => {
      if (res.status==true) {
        this.PostService.snakeMessage(res.message,'');
      } else {
      this.PostService.snakeMessage(res.message,'OK');
      }
    })

  }

}
