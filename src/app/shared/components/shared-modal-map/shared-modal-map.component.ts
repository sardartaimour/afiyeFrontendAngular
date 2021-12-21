import { Component, OnInit, ViewChild, EventEmitter, Output, NgZone, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Address } from '../../shared-model/address';
import { RequestService } from '../../services/request.service';
import { Config } from 'src/app/config/config';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
declare var $: any;
@Component({
  selector: 'app-shared-modal-map',
  templateUrl: './shared-modal-map.component.html',
  styleUrls: ['./shared-modal-map.component.scss']
})
export class SharedModalMapComponent implements OnInit {
  myLatLng = { lat: 51.510280, lng: -0.084028 };
  @ViewChild('mapModal', { static: false }) mapModal: ModalDirective;
  @Output() onDoneEvent = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @ViewChild("search", { static: false }) public searchElementRef: ElementRef;
  form: FormGroup;
  currentPlace: any;
  showTable: boolean;
  machine = [];
  disableBtn: boolean = true;
  componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'long_name',
    country: 'long_name',
    postal_code: 'short_name',
    neighborhood: 'long_name'

  };
  zoom = 12;
  address: Address = new Address();
  selectedLat = 0;
  selectedLng = 0;
  selectedState = '';
  latitude = 0;
  longitude = 0;
  city = '';
  state = '';
  isHeaderRemoved = false;
  isSideBarRemoved = false;
  isOpenButtonHide = false;

  constructor(private requestService: RequestService,
    private config: Config, private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,) {
    this.form = this.fb.group(this.formElements());
  }

  ngOnInit(): void {
    this.searchAddress();
  }

  formElements(): Object {
    return {
      'address': ['',],
      'city': [''],
      'zip': [],
      'country': [''],
      'lat': [],
      'lng': [],
      'state': [''],
      "formatted_address": [""]
    }
  }

  showModal(latitude = null, longitude = null) {
    this.form.reset();
    if (latitude && longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
      this.form.patchValue({ lat: this.latitude, lng: this.longitude });
      this.mapModal.show();
      this.hide();
    } else {
      this.handlePermission();
    }
  }

  cancel() {
    this.onCancel.emit(true);
  }

  setValues(obj) {
    if (obj) {
      // this.form.get('address').setValue(obj.address);
      this.form.patchValue(obj);
      // console.log("this.form.value", this.form.value);
    }

  }

  handlePermission() {
    let self = this;
    navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
      // console.log(result)
      if (result.state == 'granted') {
        self.setCurrentPosition();
        self.report(result.state);
      } else if (result.state == 'prompt') {
        self.setCurrentPosition();
        self.report(result.state);
      } else if (result.state == 'denied') {
        self.report(result.state);
      }
      result.onchange = function () {
        self.report(result.state);
      }
    });
  }


  setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('current => ', this.form.value)
        this.latitude = this.form.get('lat').value ? this.form.get('lat').value : position.coords.latitude ;
        this.longitude = this.form.get('lng').value ? this.form.get('lng').value : position.coords.longitude;
        let data = {
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }
        this.OnDrag(data);
        this.mapModal.show();
        this.hide();

        this.zoom = 12;
      });
    }
  }

  hide() {
    if ($("#listing").hasClass("translated")) {
      $("#listing").removeClass("translated");
      this.isSideBarRemoved = true;
    }
    if ($("#header_top").hasClass("mainheader")) {
      $("#header_top").removeClass("mainheader");
      this.isHeaderRemoved = true;
    }
    $("#open").css({ "display": "none" });
    this.isOpenButtonHide = true;
  }

  show() {
    if (this.isOpenButtonHide) {
      $("#open").css({ "display": "block" });
    }
    if (this.isSideBarRemoved) {
      $("#listing").addClass("translated");
    }
    if (this.isHeaderRemoved) {
      $("#header_top").addClass("mainheader");
    }
  }

  storeAddress(addressType: any, val: any) {
    if (addressType == "street_number") {

      this.address.street_number = val;
    }

    else if (addressType == "route") {
      this.address.route = val;
    }
    else if (addressType == "locality") {
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

  getFormatedAddress(results) {
    
    let isFind = false;
    let place = results && results.length ?  results[0] : null;

    if(results && results.length) {
        ['neighborhood', 'sublocality', 'locality', 'administrative_area_level_1', 'administrative_area_level_2', 'country', 'plus_code'].forEach(r => {
          
          const ft = results.filter(res => res.types.indexOf(r) !== -1);
          if (ft && ft.length) {
            if (!isFind) {
              // console.log('checko =>>>> ', ft, r)
              this.form.get('formatted_address').setValue(ft[0].formatted_address);
              this.form.get('address').setValue(ft[0].formatted_address);
              isFind = true;
              place = ft[0];
            }
          }
        });
    }

    if (!isFind && results && results.length) {
      this.form.get('formatted_address').setValue(results[0].formatted_address);
      this.form.get('address').setValue(results[0].formatted_address);
    }

    return place
}

  formValues(place) {
    // console.log('app shared modal => ', place)
    if (place && place.address_components) {
      for (let i = 0; i < place.address_components.length; i++) {
        let addressType = place.address_components[i].types[0];
        if (this.componentForm[addressType]) {
          let val = place.address_components[i][this.componentForm[addressType]];
          this.storeAddress(addressType, val);
        }
      }
    }

    let address: any;
    let route = this.address.route;
    if ("route" in this.address) {
      route = route
    }
    if (!route && place) {
      route = place['formatted_address'];
    }
    if ("street_number" in this.address) {
      route = this.address.street_number + " " + route
    }
    
    this.form.patchValue({
      'address': route
    });

    // console.log("Address Model", this.address);
    //verify result
    if (!place || place.geometry === undefined || place.geometry === null) {
      return;
    }
    this.latitude = place.geometry.location.lat;
    this.longitude = place.geometry.location.lng;
    this.zoom = 12;
    if (place.geometry.location) {
      // console.log("Latitude", this.latitude);
      this.form.controls['lat'].setValue(this.latitude);
      this.form.controls['lng'].setValue(this.longitude);
      // console.log("longtitude", this.longitude);
    }
    // console.log("Address Model", this.address);
  }

  OnDrag(event) {
    // console.log('drag', event);
    this.disableBtn = true;
    const geocoder = new google.maps.Geocoder();
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.form.patchValue({ lat: this.latitude, lng: this.longitude });
    const my_location = {
      lat: event.coords.lat,
      lng: event.coords.lng,
      key: this.config.getConfig('mapKey')
    };
    this.requestService.getLocation(my_location).subscribe((res: any) => {
      // console.log('onDrag event => ', res)
      // console.log('loc', res);
      if (res.results.length > 0) {
        // let place = res.results.find((product) => {
        //   return product.address_components.some((item1) => {
        //     return item1.types.some((item) => {
        //       return item === 'route';
        //       // return item === 'route' || item === 'locality' || item === 'neighborhood' || item === 'administrative_area_level_3' || item === 'administrative_area_level_1';
        //     });
        //   });
        // });
        // console.log('d', place);
        let place = this.getFormatedAddress(res.results);
        // this.form.get('formatted_address').setValue(place.formatted_address);
        // this.form.get('address').setValue(place.formatted_address);
        if (place) {
          this.currentPlace = place;
        }
        else {
          place = res.results[0];
          this.currentPlace = res.results[0];
        }

        console.log('onDrage place => ', place)

        if (!place) {
          return;
        }
        if (place['geometry'] === undefined || place['geometry'] === null) {
          return;
        }
        this.zoom = 12;
        this.onDoneEvent.emit(this.form.getRawValue());
        this.disableBtn = false;
      }
    })
  }

  report(state) {
    // console.log('Permission ' + state);
  }



  onDone() {
    this.mapModal.hide();
    // this.formValues(this.currentPlace);
    this.onDoneEvent.emit(this.form.getRawValue());
    // console.log("onDone -> this.currentPlace", this.form.getRawValue())
  }

  hideModal() {
    this.mapModal.hide();
  }

  onChangeAddress() {
    console.log('check key down=> ')
    // this.searchAddress();
  }

  searchAddress() {
    this.disableBtn = true;
    this.mapsAPILoader.load().then(() => {
      this.searchPlaces();
    });
  }

  searchPlaces() {
    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      // types: ["address"]
      // types: ["geocode", "establishment"]
          //   types: ["address"],
       types: ["geocode", "establishment"]
    });

    // console.log('searchAddress => ', autocomplete)
    // autocomplete.setComponentRestrictions(
    //   { 'country': [''] });
    autocomplete.addListener("place_changed", () => {

      // console.log('searchAddress => ', autocomplete)
      this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        // console.log("searchAddress -> place ==== > ", place);
        this.form.get('formatted_address').setValue(place.formatted_address);

        console.log('after comp => ', place)
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


        // this.form.patchValue({
        //   'address': route
        // });

        // console.log("Address Model", this.address);
        //verify result
      // let p =  this.getFormatedAddress(place);
      // console.log('check internal address => ', p)
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        // if (p) {
        //   this.currentPlace = p;
        // }
        // else {
        //   p = place.address_components[0];
        //   this.currentPlace = p;
        // }

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.form.controls['lat'].setValue(this.latitude);
        this.form.controls['lng'].setValue(this.longitude);
        console.log('lng => ', this.latitude, this.longitude, this.form.value,place.geometry.location.lat())
        this.zoom = 12;
        this.onDoneEvent.emit(this.form.value);
        this.disableBtn = false;
      });
    });
  }
}
