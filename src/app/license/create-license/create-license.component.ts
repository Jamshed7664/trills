import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AlertService } from 'src/app/common_service/alert.service';
import { AuthService } from 'src/app/common_service/auth.service';
import { CrudService } from 'src/app/common_service/crud.service';
import { ConfigService } from 'src/app/common_service/ConfigService.service';
import { PostService } from '../../post.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Headers } from '@angular/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
declare var $: any;

@Component({
  selector: 'app-create-license',
  templateUrl: './create-license.component.html',
  styleUrls: ['./create-license.component.css']
})
export class CreateLicenseComponent implements OnInit {
  licenseCreate = 0;
  api_calling = false;
  check1: any;
  check2: any;
  check3: any;
  customization: any = `This Non-Exclusive {LICENSE_NAME} License Agreement (the “Agreement”), having been made on and effective as of {CONTRACT_DATE} (the “Effective Date”) by and between {TRACK_OWNER_FULLNAME} p/k/a {PRODUCER_ALIAS} (the “Producer” or “Licensor”); and {CUSTOMER_FULLNAME} residing at {CUSTOMER_ADDRESS} (“You” or “Licensee”), sets forth the terms and conditions of the Licensee’s use, and the rights granted in, the Producer’s instrumental music file entitled {TRACK_TITLE} (the “Beat”) in consideration for Licensee’s payment of {TRACK_PRICE} (the “License Fee”), on a so-called “{LICENSE_NAME}” basis.
    This Agreement is issued solely in connection with and for Licensee's use of the Beat pursuant and subject to all terms and conditions set forth herein.
      License Fee: The Licensee to shall make payment of the License Fee to Licensor on the date of this Agreement. All rights granted to Licensee by Producer in the Beat are conditional upon Licensee’s timely payment of the License Fee. The License Fee is a one-time payment for the rights granted to Licensee and this Agreement is not valid until the License Fee has been paid.
      Delivery of the Beat:
          Licensor agrees to deliver the Beat as a high-quality {FILE_TYPE}, as such terms are understood in the music industry.
          Licensor shall use commercially reasonable efforts to deliver the Beat to Licensee immediately after payment of the License Fee is made. Licensee will receive the Beat via email, to the email address Licensee provided to Licensor.
        Term: The Term of this Agreement shall be ten (10) years and this license shall expire on the ten (10) year anniversary of the Effective Date.
         Use of the Beat:
          In consideration for Licensee’s payment of the License Fee, the Producer hereby grants Licensee a limited non-exclusive, nontransferable license and the right to incorporate, include and/or use the Beat in the preparation of one (1) new song or to incorporate the Beat into a new piece of instrumental music created by the Licensee. Licensee may create the new song or new instrumental music by recording his/her written lyrics over the Beat and/or by incorporating portions/samples of the Beat into pre-existing instrumental music written, produced and/or owned by Licensee. The new song or piece of instrumental music created by the Licensee which incorporates some or all of the Beat shall be referred to as the “New Song”. Permission is granted to Licensee to modify the arrangement, length, tempo, or pitch of the Beat in preparation of the New Song for public release.
          This License grants Licensee a worldwide, non-exclusive license to use the Beat as incorporated in the New Song in the manners and for the purposes expressly provided for herein, subject to the sale restrictions, limitations and prohibited uses stated in this Agreement. Licensee acknowledges and agrees that any and all rights granted to Licensee in the Beat pursuant to this Agreement are on a NON-EXCLUSIVE basis and Producer shall continue to license the Beat upon the same or similar terms and conditions as this Agreement to other potential third-party licensees.
              The New Song may be used for any promotional purposes, including but not limited to, a release in a single format, for inclusion in a mixtape or free compilation of music bundled together (EP or album), and/or promotional, non-monetized digital streaming;
              Licensee {PERFORMANCES_FOR_PROFIT} perform the song publicly for-profit performances and for an {PERFORMANCES_NOT_FOR_PROFIT} non-profit performances, including but not limited to, at a live performance (i.e. concert, festival, nightclub etc.), on terrestrial or satellite radio, and/or on the internet via third-party streaming services (Spotify, YouTube, iTunes Radio etc.). The New Song may be played on {NUMBER_OF_RADIO_STATIONS} terrestrial or satellite radio stations;
              The Licensee may use the New Song in synchronization with {MONETIZED_MUSIC_VIDEOS_WORD} ({MONETIZED_MUSIC_VIDEOS}) audiovisual work no longer than five (5) minutes in length (a “Video”). In the event that the New Song itself is longer than five (5) minutes in length, the Video may not play for longer than the length of the New Song. The Video may be broadcast on any television network and/or uploaded to the internet for digital streaming and/or free download by the public including but not limited to on YouTube and/or Vevo. Producer grants no other synchronization rights to Licensee;
              The Licensee may make the New Song available for sale in physical and/or digital form and sell {DISTRIBUTE_COPIES} downloads/physical music products and are allowed {AUDIO_STREAMS} monetized audio streams, {MONETIZED_VIDEO_STREAMS_ALLOWED} monetized video streams, {NONMONETIZED_VIDEO_STREAMS_ALLOWED} non-monetized video streams and are allowed {FREE_DOWNLOADS} free downloads. The New Song may be available for sale as a single and/or included in a compilation of other songs bundled together by Licensee as an EP or a full-length Album. The New Song may be sold via digital retailers for permanent digital download in mp3 format and/or physical format, including compact disc and vinyl records. For clarity and avoidance of doubt, the Licensee does NOT have the right to sell the Beat in the form that it was delivered to Licensee. The Licensee must create a New Song (or instrumental as detailed above) for its rights under this provision to a vest. Any sale of the Beat in its original form by Licensee shall be a material breach of this Agreement and the Licensee shall be liable to the Licensor for damages as provided hereunder.
          Subject to the Licensee’s compliance with the terms and conditions of this Agreement, Licensee shall not be required to account or pay to Producer any royalties, fees, or monies paid to or collected by the Licensee (expressly excluding mechanical royalties), or which would otherwise be payable to Producer in connection with the use/exploitation of the New Song as set forth in this Agreement.
          Restrictions on the Use of the Beat: Licensee hereby agrees and acknowledges that it is expressly prohibited from taking any action(s) and from engaging in any use of the Beat or New Song in the manners, or for the purposes, set forth below:
          The rights granted to Licensee are NON-TRANSFERABLE and that Licensee may not transfer or assign any of its rights hereunder to any third-party;
          The Licensee shall not synchronize, or permit third parties to synchronize, the Beat or New Song with any audiovisual works EXCEPT as expressly provided for and pursuant to Paragraph 4(b)(iii) of this Agreement for use in one (1) Video. This restriction includes, but is not limited to, use of the Beat and/or New Song in television, commercials, film/movies, theatrical works, video games, and in any other form on the Internet which is not expressly permitted herein.
          The Licensee shall not have the right to license or sublicense any use of the Beat or of the New Song, in whole or in part, for any so-called “samples”.
          Licensee shall not engage in any unlawful copying, streaming, duplicating, selling, lending, renting, hiring, broadcasting, uploading, or downloading to any database, servers, computers, peer to peer sharing, or other file-sharing services, posting on websites, or distribution of the Beat in the form, or a substantially similar form, as delivered to Licensee. Licensee may send the Beat file to any individual musician, engineer, studio manager or other people who are working on the New Song.
          THE LICENSEE IS EXPRESSLY PROHIBITED FROM REGISTERING THE BEAT AND/OR NEW SONG WITH ANY CONTENT IDENTIFICATION SYSTEM, SERVICE PROVIDER, MUSIC DISTRIBUTOR, RECORD LABEL OR DIGITAL AGGREGATOR (for example TuneCore or CDBaby, and any other provider of user-generated content identification services). The purpose of this restriction is to prevent you from receiving a copyright infringement takedown notice from a third party who also received a non-exclusive license to use the Beat in a New Song. The Beat has already been tagged for Content Identification (as that term is used in the music industry) by Producer as a pre-emptive measure to protect all interested parties in the New Song. If you do not adhere to this policy, you are in violation of the terms of this License and your license to use the Beat and/or New Song may be revoked without notice or compensation to you.
          As applicable to both the underlying composition in the Beat and to the master recording of the Beat: (i) The parties acknowledge and agree that the New Song is a “derivative work”, as that term is used in the United States Copyright Act; (ii) As applicable to the Beat and/or the New Song, there is no intention by the parties to create a joint work; and (iii) There is no intention by the Licensor to grant any rights in and/or to any other derivative works that may have been created by other third-party licensees.
           Ownership:
          The Producer is and shall remain the sole owner and holder of all rights, title, and interest in the Beat, including all copyrights to and in the sound recording and the underlying musical compositions written and composed by Producer. Nothing contained herein shall constitute an assignment by Producer to Licensee of any of the foregoing rights. Licensee may not, under any circumstances, register or attempt to register the New Song and/or the Beat with the U.S. Copyright Office. The aforementioned right to register the New Song and/or the Beat shall be strictly limited to Producer. Licensee will, upon request, execute, acknowledge and deliver to Producer such additional documents as Producer may deem necessary to evidence and effectuate Producer’s rights hereunder, and Licensee hereby grants to Producer the right as attorney-in-fact to execute, acknowledge, deliver and record in the U.S. Copyright Office or elsewhere any and all such documents if Licensee shall fail to execute same within five (5) days after so requested by Producer.
          For the avoidance of doubt, you do not own the master or the sound recording rights in the New Song. You have been licensed the right to use the Beat in the New Song and to commercially exploit the New Song based on the terms and conditions of this Agreement.
              Notwithstanding the above, you do own the lyrics or other original musical components of the New Song that were written or composed solely by you.
        With respect to the publishing rights and ownership of the underlying composition embodied in the New Song, the Licensee, and the Producer hereby acknowledge and agree that the underlying composition shall be owned/split between them as follows:
          {PUBLISHING_RIGHTS}
              Producer shall own, control, and administer One Hundred Percent (100%) of the so-called “Publisher’s Share” of the underlying composition.
                  In the event that Licensee wishes to register his/her interests and rights to the underlying composition of the New Song with their Performing Rights Organization (“PRO”), Licensee must simultaneously identify and register the Producer’s share and ownership interest in the composition to indicate that Producer wrote and owns 50% of the composition in the New Song and as the owner of 100% of the Publisher’s share of the New Song.
  
          The licensee shall be deemed to have signed, affirmed and ratified its acceptance of the terms of this Agreement by virtue of its payment of the License Fee to Licensor and its electronic acceptance of its terms and conditions at the time Licensee made payment of the License Fee.
  
      Mechanical License: If any selection or musical composition, or any portion thereof, recorded in the New Song hereunder is written or composed by Producer, in whole or in part, alone or in collaboration with others, or is owned or controlled, in whole or in part, directly or indirectly, by Producer or any person, firm, or corporation in which Producer has a direct or indirect interest, then such selection and/or musical composition shall be hereinafter referred to as a “Controlled Composition”. Producer hereby agrees to issue or cause to be issued, as applicable, to Licensee, mechanical licenses in respect of each Controlled Composition, which are embodied on the New Song. For that license, on the United States and Canada sales, Licensee will pay mechanical royalties at one hundred percent (100%) of the minimum statutory rate, subject to no cap of that rate for albums and/or EPs. For license outside the United States and Canada, the mechanical royalty rate will be the rate prevailing on an industry-wide basis in the country concerned on the date that this agreement has been entered into.
  
      Credit: Licensee shall have the right to use and permit others to use Producer’s approved name, approved likeness, and other approved identification and approved biographical material concerning the Producer solely for purposes of trade and otherwise without restriction solely in connection with the New Song recorded hereunder. Licensee shall use best efforts to have Producer credited as a “producer” and shall give Producer appropriate production and songwriting credit on all compact discs, record, music video, and digital labels or any other record configuration manufactured which is now known or created in the future that embodies the New Song created hereunder and on all cover liner notes, any records containing the New Song and on the front and/or back cover of any album listing the New Song and other musician credits. The licensee shall use its best efforts to ensure that Producer is properly credited and Licensee shall check all proofs for the accuracy of credits, and shall use its best efforts to cure any mistakes regarding Producer's credit. In the event of any failure by Licensee to issue the credit to Producer, Licensee must use reasonable efforts to correct any such failure immediately and on a prospective basis. Such credit shall be in the substantial form: “Produced by {PRODUCER_ALIAS}”.
  
      Licensor’s Option: Licensor shall have the option, at Licensor’s sole discretion, to terminate this License at any time within three (3) years of the date of this Agreement upon written notice to Licensee. In the event that Licensor exercises this option, Licensor shall pay to Licensee a sum equal to Two Hundred Percent (200%) of the License Fee paid by Licensee. Upon Licensor’s exercise of the option, Licensee must immediately remove the New Song from any and all digital and physical distribution channels and must immediately cease access to any streams and/or downloads of the New Song by the general public.
  
      Breach by Licensee:
          The licensee shall have five (5) business days from its receipt of written notice by Producer and/or Producer’s authorized representative to cure any alleged breach of this Agreement by Licensee. Licensee’s failure to cure the alleged breach within five (5) business days shall result in Licensee’s default of its obligations, its breach of this Agreement, and at Producer's sole discretion, the termination of Licensee’s rights hereunder.
          If Licensee engages in the commercial exploitation and/or sale of the Beat or New Song outside of the manner and amount expressly provided for in this Agreement, Licensee shall be liable to Producer for monetary damages in an amount equal to any and all monies paid, collected by, or received by Licensee, or any third party on its behalf, in connection with such unauthorized commercial exploitation of the Beat and/or New Song.
          Licensee recognizes and agrees that a breach or threatened breach of this Agreement by Licensee give rise to irreparable injury to Producer, which may not be adequately compensated by damages. Accordingly, in the event of a breach or threatened breach by the Licensee of the provisions of this Agreement, Producer may seek and shall be entitled to a temporary restraining order and a preliminary injunction restraining the Licensee from violating the provisions of this Agreement. Nothing herein shall prohibit Producer from pursuing any other available legal or equitable remedy from such breach or threatened breach, including but not limited to the recovery of damages from the Licensee. The Licensee shall be responsible for all costs, expenses or damages that Producer incurs as a result of any violation by the Licensee of any provision of this Agreement. Licensee’ obligation shall include court costs, litigation expenses, and reasonable attorneys' fees.
  
      Warranties, Representations, and Indemnification:
          Licensee hereby agrees that Licensor has not made any guarantees or promises that the Beat fits the particular creative use or musical purpose intended or desired by the Licensee. The Beat, its sound recording, and the underlying musical composition embodied therein are licensed to the Licensee “as is” without warranties of any kind or fitness for a particular purpose.
          {SAMPLES_DEFINITION}
          Parties hereto shall indemnify and hold each other harmless from any and all third party claims, liabilities, costs, losses, damages or expenses as are actually incurred by the non-defaulting party and shall hold the non-defaulting party, free, safe, and harmless against and from any and all claims, suits, demands, costs, liabilities, loss, damages, judgments, recoveries, costs, and expenses; (including, without limitation, reasonable attorneys' fees), which may be made or brought, paid, or incurred by reason of any breach or claim of breach of the warranties and representations hereunder by the defaulting party, their agents, heirs, successors, assigns and employees, which have been reduced to final judgment; provided that prior to final judgment, arising out of any breach of any representations or warranties of the defaulting party contained in this agreement or any failure by defaulting party to perform any obligations on its part to be performed hereunder the non-defaulting party has given the defaulting party prompt written notice of all claims and the right to participate in the defense with counsel of its choice at its sole expense. In no event shall Artist be entitled to seek injunctive or any other equitable relief for any breach or non-compliance with any provision of this agreement.
  
      Miscellaneous: This Agreement constitutes the entire understanding of the parties and is intended as a final expression of their agreement and cannot be altered, modified, amended or waived, in whole or in part, except by written instrument (email being sufficient) signed by both parties hereto. This agreement supersedes all prior agreements between the parties, whether oral or written. Should any provision of this agreement be held to be void, invalid or inoperative, such decision shall not affect any other provision hereof, and the remainder of this agreement shall be effective as though such void, invalid or inoperative provision had not been contained herein. No failure by Licensor hereto to perform any of its obligations hereunder shall be deemed a material breach of this agreement until the Licensee gives Licensor written notice of its failure to perform, and such failure has not been corrected within thirty (30) days from and after the service of such notice, or, if such breach is not reasonably capable of being cured within such thirty (30) day period, Licensor does not commence to cure such breach within said time period, and proceed with reasonable diligence to complete the curing of such breach thereafter. This agreement shall be governed by and interpreted in accordance with the laws of the {STATE_PROVINCE_COUNTRY} applicable to agreements entered into and wholly performed in said State, without regard to any conflict of laws principles. You hereby agree that the exclusive jurisdiction and venue for any action, suit or proceeding based upon any matter, claim or controversy arising hereunder or relating hereto shall be in the state or federal courts located in the {STATE_PROVINCE_COUNTRY}. You shall not be entitled to any monies in connection with the Master(s) other than as specifically set forth herein. All notices pursuant to this agreement shall be in writing and shall be given by registered or certified mail, return receipt requested (prepaid) at the respective addresses hereinabove set forth or such other address or addresses as may be designated by either party. Such notices shall be deemed given when received. Any notice mailed will be deemed to have been received five (5) business days after it is mailed; any notice dispatched by expedited delivery service will be deemed to be received two (2) business days after it is dispatched. YOU ACKNOWLEDGE AND AGREE THAT YOU HAVE READ THIS AGREEMENT AND HAVE BEEN ADVISED BY US OF THE SIGNIFICANT IMPORTANCE OF RETAINING AN INDEPENDENT ATTORNEY OF YOUR CHOICE TO REVIEW THIS AGREEMENT ON YOUR BEHALF. YOU ACKNOWLEDGE AND AGREE THAT YOU HAVE HAD THE UNRESTRICTED OPPORTUNITY TO BE REPRESENTED BY AN INDEPENDENT ATTORNEY. IN THE EVENT OF YOUR FAILURE TO OBTAIN AN INDEPENDENT ATTORNEY OR WAIVER THEREOF, YOU HEREBY WARRANT AND REPRESENT THAT YOU WILL NOT ATTEMPT TO USE SUCH FAILURE AND/OR WAIVER as a basis to avoid any obligations under this agreement, or to invalidate this agreement or To render this agreement or any part thereof unenforceable. This agreement may be executed in counterparts, each of which shall be deemed an original, and said counterparts shall constitute one and the same instrument. In addition, a signed copy of this agreement transmitted by facsimile or scanned into an image file and transmitted via email shall, for all purposes, be treated as if it was delivered containing an original manual signature of the party whose signature appears thereon and shall be binding upon such party as though an originally signed document had been delivered. Notwithstanding the foregoing, in the event that you do not sign this Agreement, your acknowledgment that you have reviewed the terms and conditions of this Agreement and your payment of the License Fee shall serve as your signature and acceptance of the terms and conditions of this Agreement.
  `;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private authService: AuthService,
    private alertService: AlertService,
    private CrudService: CrudService,
    private config: ConfigService,
    private http: Http) { }

  licenseForm = this.formBuilder.group({
    name: ['', [
      Validators.required,
    ]],
    minimum_offer_price: ['', [
      Validators.required,
    ]],
    default_track_price: ['', [
      Validators.required,
    ]],
    default_album_price: ['', [
      Validators.required,
    ]],
    enable_license: ['no', [
      Validators.required,
    ]],
    description: ['', [
      Validators.required,
    ]],
    full_customization: [this.customization, [
      Validators.required,
    ]],
    country: ['', [
      Validators.required,
    ]],
    state_province: ['', [
      Validators.required,
    ]],
    features: ['', [
      Validators.required,
    ]],
    not_profit: ['', [
      Validators.required,
    ]],
    allow_profit: ['', [
      Validators.required,
    ]],
    radio_stations: ['', [
      Validators.required,
    ]],
    broadcasting_right: ['', [
      Validators.required,
    ]],
    monetized_video_streams: ['', [
      Validators.required,
    ]],
    non_monetized_video_streams: ['', [
      Validators.required,
    ]],
    music_video: ['', [
      Validators.required,
    ]],
    audio_streams: ['', [
      Validators.required,
    ]],
    free_downloads: ['', [
      Validators.required,
    ]],
    distribution_copies: ['', [
      Validators.required,
    ]],
    mp3_for: [0, [
      Validators.required,
    ]],
    license_for: ['', [
    ]]

  });
  clickBox(e) {
    var check = '';
    var facilitiesid = new Array();
    $(".mycustomCheckbox:checkbox:checked").each(function () {
      facilitiesid.push($(this).attr('id'));
    });

    if (facilitiesid.length > 0) {
      check = facilitiesid.toString();
    } else {
      check = '';
    }
    this.licenseForm.controls['license_for'].setValue(check);
  }

  checkselection(e) {
    var tags = this.licenseForm.controls['license_for'].value;
    if (tags) {
      const tagArr = tags.split(",");
      if (tagArr.length > 0) {
        const officersIds = tagArr.map((tagA) => tagA == e);
        if (officersIds) {
          return true;
        } else {
          return false;
        }
      }

    } else {
      return false;
    }



  }
  resetContract() {
   this.licenseForm.patchValue({
    'full_customization' : this.customization
   })
  }
  open_close_modal_share(open_modal_id) {

    setTimeout(() => {
      $('#myModalshare' + open_modal_id).modal('toggle');
    }, 200);

  }

  createlicense(e) {
    if (!this.licenseForm.valid) {
      this.licenseForm.markAsTouched();
      this.postService.snakeMessage('Invalid Form', '');
      return;
    }
    var url = 'createAlbum';
    this.api_calling = true;
    const formData = new FormData();
    formData.append('name', this.licenseForm.controls['name'].value);
    formData.append('minimum_offer_price', this.licenseForm.controls['minimum_offer_price'].value);
    formData.append('default_track_price', this.licenseForm.controls['default_track_price'].value);
    formData.append('default_album_price', this.licenseForm.controls['default_album_price'].value);
    formData.append('enable_license', this.licenseForm.controls['enable_license'].value);
    formData.append('description', this.licenseForm.controls['description'].value);
    formData.append('full_customization', this.licenseForm.controls['full_customization'].value);
    formData.append('country', this.licenseForm.controls['country'].value);
    formData.append('state_province', this.licenseForm.controls['state_province'].value);
    formData.append('features', this.licenseForm.controls['features'].value);

    formData.append('not_profit', this.licenseForm.controls['not_profit'].value);
    formData.append('allow_profit', this.licenseForm.controls['allow_profit'].value);
    formData.append('radio_stations', this.licenseForm.controls['radio_stations'].value);
    formData.append('broadcasting_right', this.licenseForm.controls['broadcasting_right'].value);

    formData.append('monetized_video_streams', this.licenseForm.controls['monetized_video_streams'].value);
    formData.append('non_monetized_video_streams', this.licenseForm.controls['non_monetized_video_streams'].value);
    formData.append('music_video', this.licenseForm.controls['music_video'].value);
    formData.append('audio_streams', this.licenseForm.controls['audio_streams'].value);
    formData.append('free_downloads', this.licenseForm.controls['free_downloads'].value);
    formData.append('distribution_copies', this.licenseForm.controls['distribution_copies'].value);
    formData.append('mp3_for', this.licenseForm.controls['mp3_for'].value);
    formData.append('license_for', this.licenseForm.controls['license_for'].value);
    if (localStorage.getItem('Userid')) {
      formData.append('Userid', localStorage.getItem('Userid'));
    }

    if (this.licenseCreate != 0) {
      formData.append('licenseId', this.licenseCreate.toString());
      url = 'updateLicense';
    } else {
      url = 'createLicense';
    }
    this.CrudService.add(formData, url).subscribe(res => {
      if (res.status) {
        this.licenseCreate = res.data;
        this.router.navigate(['/licenses'])
        // this.router.navigate(
        //   [],
        //   {
        //     relativeTo: this.route,
        //     queryParams: { licenseId:  this.licenseCreate },
        //     queryParamsHandling: 'merge'
        //   });
      }
      this.postService.snakeMessage(res.msg, '');
    });
    this.api_calling = false;
  }
  ngOnInit(): void {

    // this.licenseForm.valueChanges.pipe(debounceTime(3000) ).subscribe(value => {
    //   if(this.licenseForm.valid){
    //        this.createlicense('');
    //     }else{
    //     this.licenseForm.markAsTouched();
    //     this.postService.snakeMessage('Invalid Form','');
    //     return ;
    //   }

    // }
    // );

    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('licenseId')) {
        this.licenseCreate = params['licenseId'];
        this.CrudService.list({ "licenseId": this.licenseCreate }, 'getlicenses').subscribe(res => {
          if (res.status) {

            var rs = res.data;
            // delete rs.tags;
            // delete rs.tracks;
            // this.image=res.data.img_url;
            if (rs.license_for) {
              let lcFr = rs.license_for.split(',');
              lcFr.forEach(element => {
                if (element == 1) {
                  this.check1 = 1
                } else if (element == 2) {
                  this.check2 = 2
                } else if (element == 3) {
                  this.check3 = 3
                }
              });
            }
            this.licenseForm.patchValue(rs);
          } else {
            this.postService.snakeMessage(res.msg, '');
          }
        });
      } else {
        // this.album_form.controls["image"].setValidators(Validators.required);
        // this.album_form.controls["image"].updateValueAndValidity();
      }
    });

  }

}
