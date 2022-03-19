import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocalStorage } from 'src/app/libs/localstorage';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/shared/services/request.service';
import { ToastrService } from 'ngx-toastr';
import { emailRegEx } from 'src/app/shared/utils/email-validation_pattern.config';
import device from "current-device";
import { UsersUrls } from '../users-urls.enum';
import { CommonUrls } from 'src/app/shared/enums/common-urls.enum';
import { markFormGroupTouched, deepCopy } from 'src/app/shared/utils/common-functions';
import { MapsAPILoader } from '@agm/core';
import { Address } from 'src/app/shared/shared-model/address';
import { SharedModalMapComponent } from 'src/app/shared/components/shared-modal-map/shared-modal-map.component';
import { GlobalService } from 'src/app/shared/services/global.service';
declare var $: any;
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  id = null;
  form: FormGroup;
  subscriptions: Subscription[] = [];
  disableButton = false;
  user = null;
  userProfile = null;
  image = null;
  @ViewChild("search", { static: false }) public searchElementRef: ElementRef;
  @ViewChild(SharedModalMapComponent, { static: false }) public mapModal: SharedModalMapComponent;
  address: Address = new Address();
  public latitude: number;
  public longitude: number
  public zoom: number;
  isUserVerified = false;
  componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'long_name',
    country: 'long_name',
    postal_code: 'short_name',
    neighborhood: 'long_name',
    sublocality_level_2: 'long_name',
    sublocality_level_1: 'long_name',
  };
  constructor(
    private localStorage: LocalStorage,
    private router: Router,
    private requestService: RequestService,
    private toasterService: ToastrService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,) {
    this.id = this.route.snapshot.params['id'];
    console.log('check Device ', device.type, ' id ===', this.id);
    this.form = this.formBuilder.group({
      "email": ['', [Validators.required, Validators.pattern(emailRegEx)]],
      // "password": ['', [Validators.required, Validators.maxLength(15)]],
      "current_device": [device.type, Validators.required],
      "first_name": ["", Validators.required],
      "last_name": ["", Validators.required],
      "phone_no": ["", Validators.required],
      "fcm_token": ["tokens"],
      "role_id": [3, Validators.required],
      "gender": ["", Validators.required],
      "about_me": [""],
      "address": ["", Validators.required],
      "skype_id": [""],
      "is_licensed_agent": [""],
      'city': [''],
      'zip': ['12345'],
      'country': [''],
      'lat': [],
      'lng': [],
      'state': [''],
      // repeat: [null, Validators.required],
    });

  }


  addRequired() {
    this.form.get('address').setValidators(Validators.required);
    // this.form.get('city').setValidators(Validators.required);
    // this.form.get('country').setValidators(Validators.required);
    // this.form.get('lat').setValidators(Validators.required);
    // this.form.get('lng').setValidators(Validators.required);
    // this.form.get('zip').setValidators();
    // this.form.get('state').setValidators(Validators.required);
    this.form.get('address').updateValueAndValidity();
    this.form.get('city').updateValueAndValidity();
    this.form.get('country').updateValueAndValidity();
    this.form.get('lat').updateValueAndValidity();
    this.form.get('lng').updateValueAndValidity();
    // this.form.get('zip').updateValueAndValidity();
    this.form.get('state').updateValueAndValidity();
  }

  removeRequired() {
    this.form.get('address').clearValidators();
    this.form.get('city').clearValidators();
    this.form.get('country').clearValidators();
    this.form.get('lat').clearValidators();
    this.form.get('lng').clearValidators();
    this.form.get('zip').clearValidators();
    this.form.get('state').clearValidators();
    this.form.get('address').updateValueAndValidity();
    this.form.get('city').updateValueAndValidity();
    this.form.get('country').updateValueAndValidity();
    this.form.get('lat').updateValueAndValidity();
    this.form.get('lng').updateValueAndValidity();
    this.form.get('zip').updateValueAndValidity();
    this.form.get('state').updateValueAndValidity();
  }


  ngOnInit(): void {
    this.getData();

  }

  getData() {
    this.requestService.sendRequest(UsersUrls.USER_PROFILE_GET, "Get", { id: this.id }).subscribe(res => {
      console.log("RegisterComponent -> doRegister -> res", res)
      this.disableButton = false;
      if (res && res.status) {
        console.log('check here firts => ', res)
        if (res.data.data["gender"]) {
          res.data.data["gender"] = res.data.data["gender"].toString();
        }

        this.user = res.data.data;

        this.userProfile = this.user['profile_media'];
        if (this.userProfile) {
          let img =  this.userProfile.base_path + '/' + this.userProfile.system_name;
          this.image = img;
          let url = "url(" + img + ')';
          $('.wrap-custom-file label').css('background-image', url);
          console.log('check image => ', this.image)
        }
        console.log("UserProfileComponent -> getData -> this.user", this.user)
        this.form.patchValue(this.user);
        if (res.data.data.agent_request == 1 || res.data.data.agent_request == 4) {
          this.form.get("is_licensed_agent").setValue("0");
        } else {
          this.form.get("is_licensed_agent").setValue("1");
        }
        if (res.data.data.agent_request == 3) {
          this.addRequired();
          this.isUserVerified = true;
          this.searchAddress();
        } else {
          this.isUserVerified = false;
          console.log("UserProfileComponent -> getData -> this.isUserVerified", this.isUserVerified)
          this.removeRequired();
        }
        this.handleChange();

      } else {
        this.toasterService.error(res.message, 'Error');
      }
    }, error => {
      console.log("LoginComponent -> submit -> error", error);
      this.toasterService.error(error.error ? error.error.message : error.message, 'Error');
    });
  }

  handleChange() {
    setTimeout(() => {
      $('.fancybox').fancybox({
        type: "iframe"
      });
    }, 500);
  }

  public fileChangeEventProfile(fileInput: any) {
    console.log("EditProfileComponent -> fileChangeEventProfile -> fileInput", fileInput);
    let formData = new FormData();
    formData.append('file', fileInput.target.files[0]);
    formData.append('type', "1");
    formData.append('user_id', this.id);
    this.uploadMedia(formData, 'profile_pic');

  }

  public fileChangeEventDrivingLicense(fileInput: any) {
    console.log("EditProfileComponent -> fileChangeEventProfile -> fileInput", fileInput);
    let formData = new FormData();
    formData.append('file', fileInput.target.files[0]);
    formData.append('type', "2");
    formData.append('user_id', this.id);
    this.uploadMedia(formData, 'driving_licence');

  }

  public fileChangeEventAgentCertificate(fileInput: any) {
    console.log("EditProfileComponent -> fileChangeEventProfile -> fileInput", fileInput);
    let formData = new FormData();
    formData.append('file', fileInput.target.files[0]);
    formData.append('type', "3");
    formData.append('user_id', this.id);
    this.uploadMedia(formData, 'agent_certificate');

  }

  uploadMedia(formData, type = 'profile_pic') {
    this.requestService.sendRequest(CommonUrls.USER_MEDIA_ADD, 'post', formData).subscribe(res => {
      console.log("uploadMedia -> res", res)
      this.disableButton = false;
      if (res && res.status) {
        this.toasterService.success(res.message, 'Success');
        if (type == 'profile_pic') {
          this.userProfile = res.data.data;
          let url = "url(" + this.userProfile.base_path + '/' + this.userProfile.system_name + ')';
          $('.wrap-custom-file label').css('background-image', url);
          let user = this.localStorage.getObject('user_details');
          user['profile_media_id'] = res.data.data.id;
          user['profile_media'] = res.data.data;
          this.localStorage.setObject("user_details", user);
          this.globalService.userUpdate$.next(user);
        }

        if (type == 'agent_certificate') {
          this.user['agent_certificate_media'] = res.data.data;
          this.handleChange();
        }
        if (type == 'driving_licence') {
          this.user['licence_media'] = res.data.data;
          this.handleChange();
        }

      } else {

        this.toasterService.error(res.message, 'Error');

      }
    }, error => {
      this.disableButton = false;
      console.log("LoginComponent -> submit -> error", error);
      this.toasterService.error(error.error ? error.error.message : error.message, 'success');

    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.globalService.userUpdate$.next(null);
  }
  onYes() {
    this.addRequired();
    this.isUserVerified = true;
    setTimeout(() => {
      this.searchAddress();
    }, 500);

  }
  onNo() {
    this.removeRequired();
    this.isUserVerified = false;
  }

  onSubmit() {
    markFormGroupTouched(this.form);
    console.log("onSubmit -> this.form)", this.form.controls);
    if (!this.form.valid) {
      return;
    }
    console.log('value', this.form.getRawValue());
    let form = deepCopy(this.form.getRawValue());

    form['id'] = this.id;
    // form['profile_media_id'] = 2;
    if (this.form.value.is_licensed_agent == '1' || this.form.value.is_licensed_agent == 1) {
      form['agent_request'] = 2;
    }
    this.disableButton = true;
    if (this.id) {
      this.requestService.sendRequest(UsersUrls.UPDATE_PUT, 'POST', form).subscribe(res => {
        this.disableButton = false;
        if (res && res.status) {
          this.localStorage.setObject("user_details", res.data.data);
          this.toasterService.success(res.message, 'Success');
          this.globalService.userUpdate$.next(res.data.data);
        } else {

          this.toasterService.error(res.message, 'Error');

        }
      }, error => {
        this.disableButton = false;
        console.log("LoginComponent -> submit -> error", error);
        this.toasterService.error(error.error ? error.error.message : error.message, 'success');

      });

    }
  }
  searchAddress() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        // types: ["address"]
        types: ["geocode", "establishment"]
      });
      // autocomplete.setComponentRestrictions(
      //   { 'country': [''] });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log(place);
          if (place.address_components) {
            for (var i = 0; i < place.address_components.length; i++) {
              var addressType = place.address_components[i].types[0];
              if (this.componentForm[addressType]) {
                var val = place.address_components[i][this.componentForm[addressType]];
                this.storeAddress(addressType, val);
              }
            }
          }

          let address: any;
          let route = this.address.route;
          if ("street_number" in this.address) {
            route = this.address.street_number + " " + route
          }


          this.form.patchValue({
            'address': route
          });

          console.log("Address Model", this.address);
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.form.controls['lat'].setValue(this.latitude);
          this.form.controls['lng'].setValue(this.longitude);
          this.zoom = 12;
        });
      });
    });
  }

  storeAddress(addressType: any, val: any) {
    if (addressType == "street_number") {

      this.address.street_number = val;
    }

    else if (addressType == "route" || addressType == "sublocality_level_2" || addressType == "sublocality_level_1") {
      this.address.route = val;
    }
    else if (addressType == "locality" || addressType == "political") {
      this.address.locality = val;
      this.form.patchValue({
        'city': this.address.locality,
      });
    }
    else if (addressType == "country") {
      this.address.country = val;
      console.log("storeAddress -> val", val)
      this.form.patchValue({
        'country': this.address.country,
      });
    }
    else if (addressType == "administrative_area_level_1") {
      this.address.administrative_area_level_1 = val;
      this.form.patchValue({
        'state': this.address.administrative_area_level_1,
      });

    }
    else if (addressType == "neighborhood") {
      this.address.neighborhood = val;
      this.form.patchValue({
        'city': this.address.neighborhood,
      });
    }
    else if (addressType == "postal_code") {
      this.address.postal_code = val;
      this.form.patchValue({
        'zip': this.address.postal_code,
      });

    }
    else if (addressType == "country") {
      this.address.country = val;
    }
  }

  setLocationOnMap() {
    console.log('called');
    this.mapModal.showModal(parseFloat(this.form.get('lat').value), parseFloat(this.form.get('lng').value));
    this.mapModal.setValues(this.form.value);
  }

  onDoneEvent(placeData) {
    let form = this.form.value;
    console.log("MainPageComponent -> onDoneEvent -> placeData", placeData);
    for (const property in placeData) {
      if (form.hasOwnProperty(property)) {
        this.form.get(property).setValue(placeData[property]);
      }
      console.log(`${property}: ${placeData[property]}`);
    }
    this.form.get("address").setValue(placeData["formatted_address"]);
  }

  onChangeImage(ev, isCoverImage) {
    console.log('file=> ', ev)
    if (ev && ev.hasOwnProperty('files') && ev.files.length) {
      let formData = new FormData();
      formData.append('file', ev.files[0].file);
      formData.append('type', "1");
      formData.append('user_id', this.id);
      this.uploadMedia(formData, 'profile_pic');
    }
  }
}
