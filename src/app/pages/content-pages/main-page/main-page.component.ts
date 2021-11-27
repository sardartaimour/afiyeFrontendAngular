import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModalMapComponent } from 'src/app/shared/components/shared-modal-map/shared-modal-map.component';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/shared/services/request.service';
import { PropertyUrls } from 'src/app/modules/property/property-urls.enum';
import { LooseObject, oneGridOwlCarousel, sliderProperty } from 'src/app/shared/utils/common-functions';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppDownloadModalComponent } from 'src/app/shared/components/app-download-modal/app-download-modal.component';
import { Address } from 'src/app/shared/shared-model/address';
import { MapsAPILoader } from '@agm/core';
declare var $: any;
declare var jQuery: any;
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterViewInit {

    deviceInfo = null;
    value = "Search";
    formValues: LooseObject = {};
    type = "1";

    rowsFeature: any = [];
    rowsMostFavorite: any = [];
    limit: number = 10;
    activePage: number = 1;
    total: number = 0;
    offset: number = 0;
    rotate = false;
    showLoadingFeature = true;
    showLoadingFavorite = true;
    ad = null;

    address: Address = new Address();
    componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        country: 'long_name',
        postal_code: 'short_name',
        neighborhood: 'long_name'
    };

    @ViewChild(SharedModalMapComponent) mapModal: SharedModalMapComponent;
    @ViewChild(AppDownloadModalComponent) appDownloadModal: AppDownloadModalComponent;

    constructor(private router: Router,
        private deviceService: DeviceDetectorService,
        private globalService: GlobalService,
        private requestService: RequestService,
        private toasterService: ToastrService,
        private mapsAPILoader: MapsAPILoader,) { }

    ngOnInit(): void {
        $.getScript("assets/js/script.js");
        this.getData();
        this.changeTab('1');
        
    }

    ngAfterViewInit() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();
        const isDesktopDevice = this.deviceService.isDesktop();
        console.log(this.deviceInfo);
        console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
        console.log(isTablet);  // returns if the device us a tablet (iPad etc)
        console.log(isDesktopDevice);
        if (isMobile || isTablet) {
            this.openAppDownloadModal();
        }

        // this.initAutocomplete();
    }

    openAppDownloadModal() {
        
        this.appDownloadModal.showModal();
    }

    goToProperty(id) {
        this.router.navigateByUrl("/pages/property/" + id);
    }
    getData() {
        let params = {
            // pagination: 1,
            // page: this.activePage,
            // per_page: this.limit,
            user_id: this.requestService.getLoggedInUser() ? this.requestService.getLoggedInUser().id : null,
            // is_featured: 1
        }
        this.rowsFeature = [];
        this.rowsMostFavorite = [];
        this.requestService.sendRequest(PropertyUrls.PROPERTY_HOME_PAGE_ALL_GET, 'GET', params).subscribe(res => {
            console.log("MainPageComponent -> getDataFeature -> res", res)
            this.showLoadingFeature = false;
            if (res.status) {

                this.rowsFeature = res.data.featured;
                this.rowsMostFavorite = res.data.favorite;
                this.ad = res.data.ad;
                console.log("MainPageComponent -> getDataFeature -> this.rowsFeature", this.rowsFeature)
                setTimeout(() => {
                    sliderProperty('feature_property_slider');
                    // $.getScript("assets/js/script.js");
                }, 50);

            } else {
                this.toasterService.error(res.message, "Error");
            }
        }, error => {
            this.showLoadingFeature = false;
            this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
        });
    }

    markFavorite(property, index, rowType) {
        if (!this.requestService.isAuthenticated()) {
            this.toasterService.error("Please Login First");
            return;
        }
        let params = {
            user_id: this.requestService.getLoggedInUser().id,
            property_id: rowType == 2 ? property.property_id : property.id
        }
        this.requestService.sendRequest(PropertyUrls.PROPERTY_FAVORITE_POST, 'POST', params).subscribe(res => {
            console.log("PropertyListingComponent -> markFavorite -> res", res)
            if (res.status) {
                this.toasterService.success(res.message, "Success");
                if (rowType == 2) {
                    this.rowsMostFavorite[index]['is_favorite'] = 1;
                    this.rowsMostFavorite = [...this.rowsMostFavorite];
                }
                if (rowType == 1) {
                    this.rowsFeature[index]['is_favorite'] = 1;
                    this.rowsFeature = [... this.rowsFeature];
                }
            } else {
                this.toasterService.error(res.message, "Error");
            }
        }, error => {
            this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
        });
    }
    markUnFavorite(property, index, rowType) {
        if (!this.requestService.isAuthenticated()) {
            this.toasterService.error("Please Login First");
            return;
        }

        let params = {
            user_id: this.requestService.getLoggedInUser().id,
            property_id: rowType == 2 ? property.property_id : property.id
        }
        this.requestService.sendRequest(PropertyUrls.PROPERTY_UNFAVORITE_POST, 'delete_with_body', params).subscribe(res => {
            console.log("PropertyListingComponent -> markFavorite -> res", res)
            if (res.status) {
                this.toasterService.success(res.message, "Success");
                // this.getData();
                if (rowType == 2) {
                    this.rowsMostFavorite[index]['is_favorite'] = 0;
                    this.rowsMostFavorite = [...this.rowsMostFavorite];
                }
                if (rowType == 1) {
                    this.rowsFeature[index]['is_favorite'] = 0;
                    this.rowsFeature = [... this.rowsFeature];
                }

            } else {
                this.toasterService.error(res.message, "Error");
            }
        }, error => {
            this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
        });
    }

    changeTab(value, id: string = '#search-field-rent') {
        this.type = value;
        let searchField = document.querySelector(id) as HTMLInputElement;
        searchField.value = null;
        this.formValues['property_type_id'] = this.type;
        console.log("MainPageComponent -> changeTab -> this.formValue", this.formValues);
        this.globalService.mapData$.next(this.formValues);
    }

    routeTo(route) {
        this.router.navigate([route]);
    }


    onImageClick(Property) {
        console.log("MainPageComponent -> onImageClick -> Property", Property)
        this.router.navigate(['/pages/property/' + Property.id]);
    }
    openMapModal() {
        this.mapModal.showModal(null, null);
    }

    onDoneEvent(placeData, navigate: boolean = false) {
        console.log("MainPageComponent -> onDoneEvent -> placeData", placeData);
        if (placeData && placeData.formatted_address) {
            this.value = placeData.formatted_address;
            placeData.address = placeData.formatted_address;
        }
        this.formValues = placeData;
        this.formValues['property_type_id'] = this.type;
        this.globalService.mapData$.next(placeData);

        if (navigate) {
            this.router.navigate(['/pages/property-list']);
        }
    }

    initAutocomplete(id: string) 
    {
        this.mapsAPILoader.load().then(() => {
            let searchField = document.querySelector(id) as HTMLInputElement;
            
            // Create the autocomplete object, restricting the search predictions to
        // addresses in the US and Canada.
        let autocomplete = new google.maps.places.Autocomplete(searchField, {
            componentRestrictions: { country: ["GH"] },
            fields: ["address_components", "geometry"],
          //   types: ["address"],
              types: ["geocode", "establishment"]
          });
          searchField.focus();
        
          // When the user selects an address from the drop-down, populate the
          // address fields in the form.
          autocomplete.addListener("place_changed", () => {
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
              let address = {
                  'address': '',
                  'city': '',
                  'zip': '',
                  'country': '',
                  'lat': place.geometry.location.lat(),
                  'lng': place.geometry.location.lng(),
                  'state': '',
                  "formatted_address": ''
              }
  
              if (place.address_components) {
                  for (let i = 0; i < place.address_components.length; i++) {
                      let addressType = place.address_components[i].types[0];
                      if (this.componentForm[addressType]) {
                          let val = place.address_components[i][this.componentForm[addressType]];
                          address = this.storeAddress(addressType, val, address);
                      }
                  }
              } 
              
              let route = this.address.route;
              if ("route" in this.address) {
              route = route
              }
              if (!route) {
              route = place['formatted_address'];
              }
              if ("street_number" in this.address) {
                  route = this.address.street_number + " " + route
              }
              
              address['address'] = route;
  
              console.log('final check of address => ', address)
              this.onDoneEvent(address, true);
          });
        });
    }

    storeAddress(addressType: any, val: any, form: any)
    {
        if (addressType == "street_number") {
          this.address.street_number = val;
        }
        else if (addressType == "route") {
          this.address.route = val;
        }
        else if (addressType == "locality") {
          this.address.locality = val;
          form['city'] = this.address.locality;
        }
        else if (addressType == "country") {
          this.address.country = val;
          form['country'] =this.address.country;
        }
        else if (addressType == "administrative_area_level_1") {
          this.address.administrative_area_level_1 = val;
          form['state'] = this.address.administrative_area_level_1;
        }
        else if (addressType == "neighborhood") {
          this.address.neighborhood = val;
          form['city'] = this.address.neighborhood;
        }
        else if (addressType == "postal_code") {
          this.address.postal_code = val;
          form['zip'] = this.address.postal_code;
        }
        else if (addressType == "country") {
          this.address.country = val;
        }

        return form;
    }

    preview(media) {
        const ft = media.filter(m=> ['1', 1].includes(m.is_featured));
        return ft.length ? ft[0]?.base_path+'/'+ft[0]?.system_name : media[0]?.base_path+'/'+media[0]?.system_name;
    }
    
}
