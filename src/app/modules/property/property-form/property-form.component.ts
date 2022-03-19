import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, NgZone, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LooseObject, markFormGroupTouched, deepCopy, isEmptyObject } from 'src/app/shared/utils/common-functions';
import { MapsAPILoader } from '@agm/core';
import { SharedModalMapComponent } from 'src/app/shared/components/shared-modal-map/shared-modal-map.component';
import { Address } from 'src/app/shared/shared-model/address';
import { RequestService } from 'src/app/shared/services/request.service';
import { PropertyUrls } from '../property-urls.enum';
import { Observable, ObservableInput, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { AgentUrl } from 'src/app/pages/content-pages/agent-list/agent-url.enum';
import { isObject } from 'util';
declare var $: any;
@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent implements OnInit, AfterViewInit {

  searching = false;
  searchFailed = false;
  idx = null;
  newFiles = [];
  filesFormData = new FormData();
  years: any[] = [];
  isUploading: boolean = false;


  form: FormGroup;
  @Input() title: string = '';
  @Input() id = null;
  @Output() formSubmitted = new EventEmitter();
  @Input() data;
  categories = [];
  case: any;
  emailValidationBoolean: boolean = false;
  maxDate = new Date().toJSON().split('T')[0];
  @Input() editData;

  @ViewChild("search", { static: false }) public searchElementRef: ElementRef;
  @ViewChild(SharedModalMapComponent, { static: false }) public mapModal: SharedModalMapComponent;
  address: Address = new Address();
  public latitude: number;
  public longitude: number
  public zoom: number;
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
  disableButton = false;
  images = [];
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toasterService: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private requestService: RequestService,
    private ngZone: NgZone,) {
    // Validators.pattern("^ @]*@[^ @]*")
    this.form = this.fb.group(this.formElements());

    let d = new Date().getFullYear();
    for (let i=0; i<100; i++) {
      this.years.push(d - i);
    }


  }

  formElements() {
    return {
      "address": ["", Validators.required],
      "air_conditioner": [null, Validators.required],
      // "city": ["", Validators.required],
      // "country": ["", Validators.required],
      "description": ["", Validators.required],
      "furniture": [null, Validators.required],
      "garage": [null, Validators.required],
      "garden": [null, Validators.required],
      "kitchen": [null, Validators.required],
      "lat": ["", Validators.required],
      "lng": ["", Validators.required],
      "lot_size": [""],
      "name": ["", Validators.required],
      "no_of_bath_room": [null, Validators.required],
      "no_of_bed_room": [null, Validators.required],
      "pool": [null, Validators.required],
      "price": [null, Validators.required],
      "property_area": [null],
      "property_category_id": [null, Validators.required],
      "property_type_id": [null, Validators.required],
      // "user_id": [null, Validators.required],
      "feature_media": [null],
      "year_built": [null, Validators.required]
    }
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.searchAddress();
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 500);
  }


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.editData) {
      // console.log("Edit Data", this.editData);
      this.data = this.editData;
      this.responseData();
    }
  }

  ngAfterViewInit() {
    // this.searchElementRef.nativeElement.
  }

  responseData() {
    this.form.patchValue(this.data);
    if (this.data['lat'] && this.data['lng']) {
      this.getAddress(this.data['lat'], this.data['lng']);
    }

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 500);
    this.images = this.data['media'];
  }
  public fileChangeEventPropertyFeature(fileInput: any) {
    // console.log("EditProfileComponent -> fileChangeEventProfile -> fileInput", fileInput);
    this.form.get("feature_media").setValue(fileInput.target.files[0]);

  }

  onChooseFileCoverImage() {
    document.getElementById('upload-cover-images').click();
  }

  onChooseFile() {
    document.getElementById('upload-featur-images').click();
  }

  public fileChangeEventProperty(fileInput: any, isFromPicker = false) {

    if (!this.id && !this.form.valid) {
      markFormGroupTouched(this.form);
      this.toasterService.info('Info', 'Please fill form and then upload files');
      return;
    }
    
    // console.log("EditProfileComponent -> fileChangeEventProfile -> fileInput", fileInput);
    if (!isFromPicker) {
      const files: FileList = fileInput.target.files;
      if (!isFromPicker && files.length > 5) {
        this.toasterService.error("you cannot select files more than 5");
        return;
      }
      this.uploadFiles(files, this.id, isFromPicker);
    } else {
      this.uploadFiles(fileInput, this.id, isFromPicker);
    }
    // for (let i = 0; i < files.length; i++) {
    //   let file: File = files[i];
    //   this.images.push(file);
    // }

    // if (!this.id) {
    //   markFormGroupTouched(this.form);
    //   console.log("onSubmit -> this.form)", this.form.controls);
    //   if (!this.form.valid) {
    //     this.toasterService.error("Please fill All required properties");
    //     return;

    //   }
      // let addPropertyStatus = this.addProperty();
    //   console.log("PropertyFormComponent -> fileChangeEventProperty -> addPropertyStatus", addPropertyStatus)
    //   addPropertyStatus.then((res) => {
    //     if (res && res.status) {
    //       this.uploadFiles(files, res.result.data.id);
    //     }
    //   }).catch((error) => {
    //     console.log("Promise rejected with ", error);
    //     this.toasterService.error(error['error'] ? error['error']['message'] : error.message, "Error");
    //   });
    //   return;
    // }
    // else {
      // this.uploadFiles(files, this.id);
    // }
  }

  public fileChangeEventPropertyCover(fileInput: any, isFromPicker = false) {

    if (!this.id && !this.form.valid) {
      markFormGroupTouched(this.form);
      this.toasterService.info('Info', 'Please fill form and then upload files');
      return;
    }

    if (!isFromPicker) {
      const files: FileList = fileInput.target.files;
      if (files.length) {
        // const ft = this.newFiles.filter(d => d.is_featured != "1" || d.is_featured != 1);
        // this.newFiles = ft.length ? ft : this.newFiles;
  
        if (this.id && this.images.length) {
          this.images.forEach((img, idx)=> {
            if ([1, "1"].includes(img.is_featured)) {
              this.deletePropertyImage(img, idx);
            }
          });
        }
        this.filesToUpload(files[0], "1");
      }
    } else {
      this.filesToUpload(fileInput, "1");
    }
    
  }

  uploadFiles(files, id, isFromPicker = false) {
  
    if (!isFromPicker) {
      for (var i = 0; i < files.length; i++) {
        // let isfeatured = i === 0 ? "1" : "0";
        // console.log(files[i]);
        // let formData = new FormData();
        // formData.append('file', files[i]);
        // formData.append('property_id', id);
        // formData.append('is_featured', isfeatured);
        // this.uploadMedia(formData, 'property', id);
        this.filesToUpload(files[i]);
      }
    } else {
      this.filesToUpload(files);
    }
  }

  filesToUpload(file, is_fetured="0")
  {
    let formData = new FormData();
    formData.append('file', file);
    // formData.append('property_id', this.id);
    formData.append('is_featured', is_fetured);

    if (!this.id) {
      this.isUploading = true;
      let addPropertyStatus = this.addProperty();
      addPropertyStatus.then((res) => {
        console.log('resss=> ', res)
        if (res && res.status) {
          this.id = res.data.data['id'];
          formData.append('property_id', this.id);
          this.isUploading = false;
          this.router.navigate(['property/edit/' + this.id]);
          this.uploadMedia(formData, 'property', this.id, is_fetured);
        }
      }).catch((error) => {
        this.isUploading = false;
        console.log("Promise rejected with ", error);
        this.toasterService.error(error['error'] ? error['error']['message'] : error.message, "Error");
      });
    }
    else {
      formData.append('property_id', this.id);
      this.uploadMedia(formData, 'property', this.id, is_fetured);
    }
    // this.newFiles.push(formData);
    // this.filesFormData.append('', formData);
    // console.log('files=======> ', this.newFiles)
  }

  finalFileUpload() {
    if (this.newFiles.length) {
      this.newFiles.forEach(formData => {
        this.uploadMedia(formData, 'property', this.id);
      })
    }
  }


  uploadMedia(formData, type = 'property', propertyId, is_fetured="0") {
    this.requestService.sendRequest(PropertyUrls.PROPERTY_MEDIA_ADD, 'post', formData).subscribe(res => {
      console.log("uploadMedia -> res", res)
      this.disableButton = false;
      if (res && res.status) {
        this.toasterService.success(res.message, 'Success');

        if (type == 'property') {
          if (res.data.data && !res.data.data.hasOwnProperty('is_featured')) {
            res.data.data['is_featured'] = is_fetured;
          }
          this.images.push(res.data.data);
          if (!this.id) {
            this.router.navigate(['property/edit/' + propertyId]);
          }
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

  async addProperty(): Promise<any> {
    if (this.form.valid) {
      var formData: LooseObject = {};
      formData = deepCopy(this.form.value);
      formData['price'] = parseInt(formData['price']);
      formData['user_id'] = this.requestService.getLoggedInUser().id;
    }
    let result = await this.requestService.sendRequest(PropertyUrls.ADD_POST, 'post', formData).toPromise();
    return result;
  }



  onSubmit() {
    markFormGroupTouched(this.form);
    console.log("onSubmit -> this.form)", this.id);
    if (!this.form.valid) {
      this.toasterService.error("Please fill All required properties");
      return;

    }
    // if (!this.form.value.feature_media) {
    //   this.toasterService.error("Please select feature media file");
    //   return;
    // }
    if (this.form.valid) {
      var formData: LooseObject = {};
      formData = deepCopy(this.form.value);
      formData['price'] = parseInt(formData['price']);
      formData['user_id'] = this.requestService.getLoggedInUser().id;
      if (!this.id) {
        // let file = this.form.value.feature_media;
        // var formDataObject: FormData = new FormData();
        // // formData = deepCopy(this.form.value);
        // formData['feature_media'] = file;
        // if (formData && isObject(formData['user_id'])) {
        //   formData['user_id'] = formData['user_id']['id'];
        // }
        // for (const property in formData) {
        //   formDataObject.append(property, formData[property]);
        //   // console.log(`${property}: ${formData[property]}`);
        // }
        this.add(formData);
      }
      else {
        formData['id'] = this.id;
        if (this.images.length == 0) {
          this.toasterService.error("Please upload at least one file");
          return;

        }
        this.update(formData);
      }

      // this.finalFileUpload();
    }
    else {
      this.toasterService.error("Please try again! Something went wrong", "Error");
    }
  }

  add(formData) {
    console.log('add form=> ', this.id);
    this.formSubmitted.emit(formData);
  }

  update(formData) {
    console.log('edit form=> ', this.id);
    this.formSubmitted.emit(formData);
  }


  closeForm() {
    this.router.navigate(['list'], { relativeTo: this.route.parent });
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
          // console.log(place);
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
          // console.log("PropertyFormComponent -> searchAddress -> route", route)
          if ("street_number" in this.address) {
            route = this.address.street_number + " " + route
          }
          if (!route) {
            route = place.formatted_address
          }


          this.form.patchValue({
            'address': route
          });

          // console.log("Address Model", this.address);
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
      // console.log("storeAddress -> val", val)
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
    // console.log('called');
    this.mapModal.showModal(parseFloat(this.form.get('lat').value), parseFloat(this.form.get('lng').value));
    this.mapModal.setValues(this.form.value);
  }

  onDoneEvent(placeData) {
    console.log('check in com=> ', placeData)
    // let form = this.form.value;
    // console.log("MainPageComponent -> onDoneEvent -> placeData ---- ", placeData);

    if (placeData['lat'] && placeData['lng']) {
      this.form.get('lat').setValue(placeData['lat']);
      this.form.get('lng').setValue(placeData['lng']);
      this.getAddress(placeData['lat'], placeData['lng']);
    }
    else {
      // this.form.patchValue(placeData);
     for (const property in placeData) {
        if (placeData.hasOwnProperty(property)) {
          if (property == "formatted_address") {
            this.form.get("address").setValue(placeData[property]);
          } else {
            this.form.get(property).setValue(placeData[property]);
          }
        }
        this.form.get("address").setValue(placeData["formatted_address"]);

        // console.log(`${property}: ${placeData[property]}`);
      }
    }
  }

  getAddress(lat: any, lng: any) {
    // console.log('in functions => ', lat, lng);

    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);

    let request = { LatLng: latlng };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        alert(JSON.stringify(status));
      }
      // This is checking to see if the Geoeode Status is OK before proceeding
      if (status == google.maps.GeocoderStatus.OK) {
        // console.log(results);
        this.getFormatedAddress(results)
        // var address = (results[0].formatted_address);
        // alert(JSON.stringify(address));
      }
    });
  }

  getFormatedAddress(results) {
    // console.log('Formated Address => ', results)
    let isFind = false;
    console.log('result => ', results)
    if(results && results.length) {
        ['neighborhood', 'sublocality', 'locality', 'administrative_area_level_1', 'administrative_area_level_2', 'country', 'plus_code'].forEach(r => {
          
          const ft = results.filter(res => res.types.indexOf(r) !== -1);
          if (ft && ft.length) {
            if (!isFind) {
              // console.log('checko =>>>> ', ft, r)
              this.form.get('address').setValue(ft[0].formatted_address);
              isFind = true;
            }
          }
        });


        // const country = results.filter(res => res.types === 'country');
        // const city =  results.filter(res => res.types === 'city');

        // if (country && country.length) {
        //   this.form.get('country').setValue(country[0].formatted_address);
        // }

        // if (city && city.length) {
        //   this.form.get('city').setValue(city[0].formatted_address);
        // }

    }

    if (!isFind && results && results.length) {
      this.form.get('address').setValue(results[0].formatted_address);
    }

    console.log('formatted => ', this.form.value)
}


  searchUser = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searchFailed = true),
      switchMap(term =>
        term.length <= 2 ? this.returnEmpty() : this.doApiCall(AgentUrl.ALL_GET, { search: term })
      ),
      tap(() => this.searchFailed = false)
    )
  userFormatter = (x) => x['first_name'] + ' - ' + x['last_name'];

  doApiCall(url, data): ObservableInput<any[]> {
    // console.log("SkillFormComponent -> data", data)

    // console.log("SkillFormComponent -> url", url)
    return <any>this.requestService.sendRequest(url, 'get', data)
      .pipe(
        tap(() => this.searchFailed = false),
        map((res) => {
          if (res['result']['data'].length == 0) {
            this.showNotFoundMessage();
          }
          return res['result']['data']
        }),
        catchError(() => {
          this.searchFailed = true;
          return of([]);
        }))

  }
  showNotFoundMessage() {
    this.toasterService.error('No record Found');
  }
  returnEmpty() {
    return of([]);
  }

  deletePropertyImage(image, i) {
    if (image.hasOwnProperty('media_id')) {
      this.requestService.sendRequest(PropertyUrls.DELETE_POST, 'delete_with_body', { ids: JSON.stringify([image.media_id]) }).subscribe(res => {
        if (res.status) {
          this.toasterService.success(res.message, "Success");
          this.images.splice(i, 1)
        } else {
          this.toasterService.error(res.message, "Error");
        }
      }, error => {
        this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
      });
    }
    else {
      this.images.splice(i, 1);
    }
  }

  previewImage(img: any) {
    if (img.hasOwnProperty('base_path')) {
      return img?.base_path+'/'+img?.system_name;
    }
    else {
      return img.name;
    }
  }

  onMakeCoverPhoto(img) {

    const payload = {
      is_featured: "1",
      id: img.hasOwnProperty('media_id') ? img.media_id : (img.hasOwnProperty('id') ? img.id : null)
    }

    this.requestService.sendRequest(PropertyUrls.PROPERTY_MEDIA_COVER_FEATURED, 'POST', payload).subscribe(res => {
      if (res.status) {
        img['is_featured'] = "1";
        this.toasterService.success(res.message, 'Success');
      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    })
  }

  isFeatued(img)
  {
    return [1, "1"].includes(img['is_featured']) ? true : false;
  }

  initAutocomplete(id: string) 
    {
        this.mapsAPILoader.load().then(() => {
            let searchField = document.querySelector(id) as HTMLInputElement;
            
        let autocomplete = new google.maps.places.Autocomplete(searchField, {
            componentRestrictions: { country: ["PK"] },
            fields: ["address_components", "geometry"],
          //   types: ["address"],
              types: ["geocode", "establishment"]
          });
          searchField && searchField.focus();
        
          // When the user selects an address from the drop-down, populate the
          // address fields in the form.
          autocomplete.addListener("place_changed", () => {
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
              // let address = {
              //     'address': '',
              //     'city': '',
              //     'zip': '',
              //     'country': '',
              //     'lat': place.geometry.location.lat(),
              //     'lng': place.geometry.location.lng(),
              //     'state': '',
              //     "formatted_address": ''
              // }
  
              // if (place.address_components) {
              //     for (let i = 0; i < place.address_components.length; i++) {
              //         let addressType = place.address_components[i].types[0];
              //         if (this.componentForm[addressType]) {
              //             let val = place.address_components[i][this.componentForm[addressType]];
              //             address = this.storeAddress(addressType, val, address);
              //         }
              //     }
              // } 
              
              // let route = this.address.route;
              // if ("route" in this.address) {
              // route = route
              // }
              // if (!route) {
              // route = place['formatted_address'];
              // }
              // if ("street_number" in this.address) {
              //     route = this.address.street_number + " " + route
              // }
              
              // address['address'] = route;
  
              // console.log('final check of address => ', address)
              // this.onDoneEvent(address, true);
          });
        });
    }

    get disabledBtn() {
      return !this.id && this.isUploading ? true : false; 
    }

    onChangeImage(ev, isCoverImage) {
      console.log('file=> ', ev)
      if (ev && ev.hasOwnProperty('files') && ev.files.length) {

        for (let file of ev.files) {
          if (isCoverImage) {
            this.fileChangeEventPropertyCover(file.file, true);
          } else {
            this.fileChangeEventProperty(file.file, true);
          }
        }
      }
    }
}
