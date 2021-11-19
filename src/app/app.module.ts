import { ListAlbumComponent } from './album/list-album/list-album.component';
import { AlbumDetailsComponent } from './album/album-details/album-details.component';
import { CreateServiceComponent } from './service/create-service/create-service.component';
import { HttpInterceptorInterceptor } from './http-interceptor.interceptor';

import {APP_BASE_HREF} from '@angular/common';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { BrowserModule,Title  } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { ReactiveFormsModule} from '@angular/forms' 
//import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxStripeModule } from 'ngx-stripe';

import { TabModule } from '@syncfusion/ej2-angular-navigations';

import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//import {NgxPaginationModule} from 'ngx-pagination';
import { ValidateService } from 'src/app/common_service/validate.service'
//import { AuthService } from 'src/app/common_service/auth.service';
//import { FlashMessagesModule } from 'angular2-flash-messages';
import {PageService} from './common_service/page.service';
import {ConfigService} from './common_service/ConfigService.service';
import { CrudService } from './common_service/crud.service';
import {CartService} from './common_service/cart.service';
import {FollowService} from './common_service/follow.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { FeaturedComponent } from './featured/featured.component'; 
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchPipe } from './_pipe/search/search.pipe';

//import { FlashMessagesModule } from 'angular2-flash-messages';

import {RouterModule} from '@angular/router';
import { ProductComponent } from './product/product.component';
import { DetailsComponent } from './details/details.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import {MatToolbarModule} from '@angular/material';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { fakeBackendProvider } from './helpers/fake-backend';

import { AuthService } from './common_service/auth.service';
import { CheckoutComponent } from './checkout/checkout.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageComponent } from './page/page.component';
import { VideosComponent } from './videos/videos.component';
import { TracksComponent } from './tracks/tracks.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { CommentsComponent } from './comments/comments.component';
import { AboutComponent } from './about/about.component';
import {FeedComponent} from './feed/feed.component';
import {FeedsComponent} from './feeds/feeds.component';
import {DashsidebarComponent} from './dashsidebar/dashsidebar.component';
import { AccountComponent } from './account/account.component';
import { CreatetracksComponent } from './createtracks/createtracks.component';
import { AlertComponent} from './_components/alert.component';
import { VerifyComponent } from './verify/verify.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { ImageCropperModule } from 'ngx-image-cropper';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { PaymentAccountsComponent } from './payment-accounts/payment-accounts.component';
import { MyTracksComponent } from './my-tracks/my-tracks.component';
import { FutureReleasesComponent } from './future-releases/future-releases.component';
import { DraftsComponent } from './drafts/drafts.component';
import { TrackeditComponent } from './trackedit/trackedit.component';
import { CredentialsComponent } from './credentials/credentials.component';
//import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MaterialModule } from './material.module';
import { PricingComponent } from './pricing/pricing.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { EmailVarifyComponent } from './email-varify/email-varify.component';
import { VideoComponent } from './video/video.component';
import { PhotosComponent } from './photos/photos.component';
import { LicensesContractsComponent } from './licenses-contracts/licenses-contracts.component';
import { ThankYouComponent } from './thankyou/thankyou.component';
import {CreateAlbumComponent} from './album/create-album/create-album.component';
import {ListLicenseComponent} from './license/list-license/list-license.component';
import { CreateLicenseComponent } from './license/create-license/create-license.component';
import { ListServiceComponent } from './service/list-service/list-service.component';
import { SearchComponent } from './search/search.component';
import { ServiceDetailsFrontComponent } from './services/service-details-front/service-details-front.component';
import { ServiceListFrontComponent } from './services/service-list-front/service-list-front.component';

import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { EmbedComponent } from './embed/embed.component';
import { EmbeddedComponent } from './embedded/embedded.component';
import {CreatePlaylistComponent} from './playlist/create-playlist/create-playlist.component';
import {CreateCouponsComponent} from './coupons/create-coupons/create-coupons.component';

import { CreateBlogComponent } from './blog/create-blog/create-blog.component';
import { ListBlogComponent } from './blog/list-blog/list-blog.component';
import { FlistBlogComponent } from './blog/flist-blog/flist-blog.component';
import { FlistBlogDetailComponent } from './blog/flist-blog-detail/flist-blog-detail.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import {EncrDecrService} from './common_service/EncrDecrService.service';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { LoaderComponent } from './loader/loader.component'
@NgModule({
  declarations: [
  
    CartComponent,
    AlertComponent,
    AppComponent,
    HomeComponent,
	FeaturedComponent,
    HeaderComponent,
    FooterComponent,
    SearchPipe,
    ProductComponent,
    DetailsComponent,
    LoginComponent,
    CheckoutComponent,
    RegisterComponent,
    DashboardComponent,
    PageComponent,
    VideosComponent,
    TracksComponent,
    ReviewsComponent,
    CommentsComponent,
    AboutComponent,
    FeedComponent,
	FeedsComponent,
    DashsidebarComponent,
    AccountComponent,
    CreatetracksComponent,
    VerifyComponent,
    ForgetpasswordComponent,
    UpdatePasswordComponent,
    PaymentAccountsComponent,
    MyTracksComponent,
	FutureReleasesComponent,
    DraftsComponent,
    TrackeditComponent,
    CredentialsComponent,
    PricingComponent,
    EmailVarifyComponent,
    VideoComponent,
    PhotosComponent,
    LicensesContractsComponent,
    ThankYouComponent,
    CreateAlbumComponent,
    ListLicenseComponent,
    CreateLicenseComponent,
    ListServiceComponent,
    CreateServiceComponent,
    SearchComponent,
    AlbumDetailsComponent,
    ListAlbumComponent,
    ServiceDetailsFrontComponent,
    ServiceListFrontComponent,
	OrdersComponent,
	ProfileComponent,
    SellerProfileComponent,
	EmbedComponent,
	EmbeddedComponent,
	CreatePlaylistComponent,
	CreateCouponsComponent,
    CreateBlogComponent,
    ListBlogComponent,
    FlistBlogComponent,
    FlistBlogDetailComponent,
    DateAgoPipe,
    AudioPlayerComponent,
    LoaderComponent
    ],
  imports: [
	ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    NgxPayPalModule,
    NgxStripeModule.forRoot('pk_test_51IGkoqBEvU5wwjJLk80aSfWLfp0RHw8WmWybG3uoYpOej9L7wDt7KCC62kIfh4rV18aNKv9RHwhO29Sl3cu22wUy00CCzAWe4F'),
    NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule,
    MaterialModule,
    ImageCropperModule,
    TabModule,
    MatSnackBarModule,
    GooglePlaceModule,
    ReactiveFormsModule,//Add if needed 
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatSliderModule,
    MatIconModule,
    MatCardModule,
    HttpClientModule,
    HttpModule,
    NgxPaginationModule,
    NgxAudioPlayerModule,
    RouterModule.forRoot([
      {path:'', component:HomeComponent},
	  {path:'trending-beats/:type', component:FeaturedComponent},
	  {path:'most-sold-beats/:type', component:FeaturedComponent},
	  
      {path:'details/:name/:id/:url', component:DetailsComponent},
      {path:'login',component:LoginComponent, data: {title: 'About'}},
      {path:'register',component:RegisterComponent},
      {path:'cart',component:CartComponent},
      {path:'pages/:url',component:PageComponent},
      {path:'dashboard',component:DashboardComponent},
      {path:'about',component:AboutComponent},
      {path:'comments',component:CommentsComponent},
      {path:'feed',component:FeedComponent},
	  {path:'feeds',component:FeedsComponent},
      {path:'reviews',component:ReviewsComponent},
      {path:'tracks',component:TracksComponent},
      {path:'video',component:VideoComponent},
      {path:'account',component:AccountComponent},
      {path:'verify',component:VerifyComponent},
      {path:'forge-password',component:ForgetpasswordComponent},
      {path:'updatepassword',component:UpdatePasswordComponent},
      {path:'tracks/my-tracks',component:MyTracksComponent},
	  {path:'tracks/future-releases',component:FutureReleasesComponent},
      {path:'tracks/drafts',component:DraftsComponent},
      {path:'tracks/edit/:url',component:TrackeditComponent},
      {path:'account/credentials/:url',component:CredentialsComponent},
      {path:'pricing',component:PricingComponent},
      {path:'pages/:url',component:PageComponent},
      {path:'email-verification',component:EmailVarifyComponent},
      {path:'videos',component:VideosComponent},
      {path:'thank-you',component:ThankYouComponent},
	  {path:'thank-you/:type',component:ThankYouComponent},
      {path:'create-album',component:CreateAlbumComponent},
      {path:'albums',component:ListAlbumComponent},

      {path:'licenses',component:ListLicenseComponent},
      {path:'create-license',component:CreateLicenseComponent},
      {path:'services',component:ListServiceComponent},
      {path:'create-service',component:CreateServiceComponent},
      {path:'photos',component:PhotosComponent},
      {path:'search',component:SearchComponent},
      {path:'album/:id/:type',component:AlbumDetailsComponent},
      {path:'u/:name/:id/:type',component:ServiceListFrontComponent},
      {path:'u/:name/:id/:type/:name',component:ServiceDetailsFrontComponent}, 
	  
	  {path:'orders',component:OrdersComponent},
	  {path:'profile',component:ProfileComponent},
	  {path:'p/:url/:id/:type',component:SellerProfileComponent}, 
	  
	  {path:'embed',component:EmbedComponent},
	  {path:'embedded',component:EmbeddedComponent},
	  {path:'create-playlist',component:CreatePlaylistComponent},
	  {path:'create-coupons',component:CreateCouponsComponent},
	  

      {path:'myblog',component:CreateBlogComponent},
      {path:'myblogs',component:ListBlogComponent},
      {path:'blog',component:FlistBlogComponent},
      {path:'blog/:url',component:FlistBlogDetailComponent},
      {path: '**', component: ProductComponent, data: {title: 'Charts', description: 'Homepage - quick overview.'}}
      
    ])
  
  ],
  providers: [
    CartService,FollowService,PageService,ValidateService,ConfigService,CrudService,AuthService,EncrDecrService,Title,
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorInterceptor, multi: true}
  ],
  
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
