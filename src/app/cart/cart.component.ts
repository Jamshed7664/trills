import { Component, OnInit,ViewChild  } from '@angular/core';
import { CrudService } from 'src/app/common_service/crud.service';
import{CartService}from 'src/app/common_service/cart.service';
import { PostService  } from '../post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { Router } from '@angular/router';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';
declare var $: any;
@Component({
  selector: 'cart-about',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
 
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };
 
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
 
  stripeTest: FormGroup;
  public payPalConfig ? : IPayPalConfig;
paymentcapturing=false;
msg="";
artistCartData:any;
token:any='';
cart_items:any=[];
sub_total:any=0;
grand_total:any=0;
finalAmount:String= '50';
discount:any=0;
licenses:any;
pages:any;
currency:any='';
  constructor( 
    private router:Router,private fb: FormBuilder, private stripeService: StripeService,
          public CrudService:CrudService,public CartService:CartService,
           private PostService:PostService) {
            this.currency = this.PostService.currency();

   }
   open_close_modal(open_modal_id,close_modal_id,qty,prd){
    
    if(close_modal_id!=0){
      $('#myModalprocess'+close_modal_id).modal('hide');
    }
    if(open_modal_id!=0){

      var params = {
        "license":prd.license,
		"track_id":prd.product_id,
		"customer_id":localStorage.getItem('Userid')
      };
    
      this.CrudService.add(params, 'licensesDetails').subscribe(data => {
        this.licenses=data.data;
        if (data.success) {
          setTimeout(() => {
            $('#myModalprocess'+open_modal_id).modal('toggle');
          }, 200);
          
        }else{
          this.PostService.snakeMessage(data.msg,'');
        }
      });

      
    }
}

    placeOrder(method,cpn='',user_id=0,payment_response){
      var user_id2='';
          if (localStorage.getItem('Userid')) {
            user_id2=localStorage.getItem('Userid');
          }

          var params={
                "trilsUserCart": localStorage.getItem('trilsUserCart'),
                "method":method,
                "cpn":cpn,
                "user_id":user_id2,
                "cartInfo":this.cart_items,
                "cartData":this.cart_items.length,
                "paymentResponse":payment_response
          }
      this.CrudService.add(params,'placeorder').subscribe(data => {
        if(data.status){
          this.CartService.cart_item_count.next('yes');
          this.router.navigate(['thank-you']);
        }else{
          this.PostService.snakeMessage(data.msg,'');
        }
      });

   
    }
removedFrom_cart(prd_ids){



  var params={
    "product_id": prd_ids,
    "trilsUserCart": localStorage.getItem('trilsUserCart'),
    "fld_action_type":2
  }
  this.CrudService.add(params,'cart_add_update').subscribe(data => {
    this.PostService.snakeMessage(data.msg,'');
      if(data.success){
      this.cart_data();
      this.CartService.cart_item_count.next('yes');
      }
  });
}

   cart_data(){
    if (localStorage.getItem('trilsUserCart')) {
      let apisCallData=[
        { 
          "params":{"trilsUserCart":localStorage.getItem('trilsUserCart'),"coupon_code":""},
          "url":"cart"
        }
      ];
       this.CrudService.handleMutipleCallAPI(apisCallData).subscribe(data => {
            this.initConfig();
            this.cart_items =data[0].data;
            this.sub_total=data[0].cart_sub_total;
            this.discount=data[0].discount;
            this.grand_total=data[0].cart_total;
            this.checkDiscount();
      });
    }
   }
   createToken(): void {
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          this.paymentcapturing=true;
          this.token=result.token.id;
          this.msg='plz wait while we are making your payment....';
                  var params={
                  "grandTotal":this.grand_total,
                  "description": "Example charge",
                  "source" : this.token,
                  "trilsUserCart":localStorage.getItem('trilsUserCart')
                }
          this.CrudService.add(params,'captureStripePayment').subscribe(data => {
            if(data.status){
                  this.placeOrder(2,'',0,data.data);
            }else{
                  this.paymentcapturing=false;
                  this.msg=data.msg;
            }
          });

        } else if (result.error) {
          this.paymentcapturing=false;
          this.msg=result.error.message;
        }
      });
  }

  checkDiscount(){
    var result = 0;
      this.cart_items.map(function (obj) {
            console.log(obj.artist_discount);
            result+=obj.artist_discount
    })
    this.discount=result;
    this.grand_total-=this.discount;
  }
  removeCPm(index,art_data){
      this.cart_items[index].artist_discount_code=null;
      this.cart_items[index].artist_discount=0;
      this.PostService.snakeMessage('Coupon Removed','');
      this.checkDiscount();
  }
  applyCPN(val){
    if(val){
      var params=this.artistCartData;
      let user_coupon = {
        "user_coupon" :val
       };
           $.extend(params,user_coupon);
      this.CrudService.add(params, 'applyCPN').subscribe(res => {
            if (res.status) {
            var discount=res.data;
            var index = this.cart_items.indexOf(this.artistCartData);
            this.cart_items[index].artist_discount_code=val;
            this.cart_items[index].artist_discount=discount;
            this.checkDiscount();
            this.PostService.snakeMessage('Coupon Applied','');
        }else{
          this.PostService.snakeMessage(res.msg,'');
        }
      }); 

    }else{
      this.PostService.snakeMessage('Enter Coupon First','');
    }

  }
  open_modal_for_promo(open_modal_id,artstistCartData){
    this.artistCartData=artstistCartData;
    if( this.artistCartData){
      $('#myModalprocess'+open_modal_id).modal('show');
      $('#cpnBox').val('');
    }
        
}
  ngOnInit(): void {
     if (localStorage.getItem('Userid')) {
      
    } else{
      localStorage.setItem('redirectAfterLogin', 'cart');
      this.router.navigate(['login']);
    }
    
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });

    this.CrudService.add('','pages').subscribe(data => {
      this.pages=data['data'];
    });
    this.cart_data();
  }
  private initConfig(): void {
    this.payPalConfig = {
        currency: 'USD',
        clientId: 'AeUJbm7J4D4LDvyQomhco7a7xxi__KWudG_f7SlSrDK8g6Q3KvGWGQRChM4czp-KS5CUd_LlgGk2yo8H',
        advanced: {
            commit: 'true'
        },
        createOrderOnClient: (data) => < ICreateOrderRequest > {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                  currency_code: 'USD',
                  value: this.grand_total,
                  breakdown: {
                      item_total: {
                          currency_code: 'USD',
                          value:this.grand_total
                      }
                  }
              },
              items:  []
          }]
      },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
               var params={
              "trilsUserCart": localStorage.getItem('trilsUserCart')
              }
              this.CrudService.add(params,'paypalSplitPayment').subscribe(mydata => {
                this.placeOrder(1,'',0,data);
              });

            // this.showSuccess = true;
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            // this.showCancel = true;

        },
        onError: err => {
            console.log('OnError', err);
            // this.showError = true;
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
            // this.resetStatus();
        },
    };
}

}