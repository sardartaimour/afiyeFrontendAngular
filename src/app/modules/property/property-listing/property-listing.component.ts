import { Component, OnInit } from '@angular/core';
import { oneGridOwlCarousel, mergeRecursive, removeEmptyKeysFromObject } from 'src/app/shared/utils/common-functions';
import { GlobalService } from 'src/app/shared/services/global.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/shared/services/request.service';
import { PropertyUrls } from '../property-urls.enum';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-property-listing',
  templateUrl: './property-listing.component.html',
  styleUrls: ['./property-listing.component.scss']
})
export class PropertyListingComponent implements OnInit {
  myLatLng = { lat: 7.8984774, lng: -3.2749614 };
  form: FormGroup;
    iconObject: any;
    labelOptions: any;
  rows: any = [];
  limit: number = 10;
  activePage: number = 1;
  total: number = 0;
  offset: number = 0;
  rotate = false;
  showLoading = true;
  formValues = {};
  zoom = 8;
    constructor(private globalService: GlobalService,
        private router: Router,
    private requestService: RequestService,
    private toasterService: ToastrService,
    private fb: FormBuilder) {
    this.globalService.mapData$.subscribe(res => {
      console.log("PropertyListingComponent -> constructor -> res", res);
      this.formValues = res;
    })
    // this.form = this.fb.group(this.formElements());
  }


  formElements(): Object {
    return {
      "user_id": [""],
      '"user_id_by"': [""],
      "property_category_id": [""],
      "property_type_id": [""],
      "name": [""],
      "no_of_bath_room": [""],
      "no_of_bed_room": [""],
      "garage": [""],
      "kitchen": [""],
      "pool": [""],
      "garden": [""],
      "furniture": [""],
      "is_available": [""],
      "lat": [""],
      "lng": [""],
      "radius": [""],
      "property_area": [""],
      "lot_size": [""],
      "from_price": [""],
      "to_price": [""],
      "property_status_i": [""],
      "air_conditioner": [""],
    }
  }
    ngOnInit(): void {
        this.iconObject = {
            url: '../assets/images/square.png',
            scaledSize: {
                width: 10,
                height: 15
            }
        };
        this.labelOptions = {
            color: 'white',
            fontFamily: '',
            fontSize: '14px',
            fontWeight: 'bold',
            text: "some text"
        }

    toggle();
    oneGridOwlCarousel();
    // $.getScript("assets/js/script.js");
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 500);
    this.getData();
  }
  eventEmitter(form) {
    console.log("PropertyListingComponent -> eventEmitter -> form", form)
    this.formValues = form;
    this.activePage = 1;
    this.getData();
  }

  pageChanged(event) {
    console.log(event);
    this.limit = event.itemsPerPage;
    this.activePage = event.page
    let params = {};
    params['pagination'] = 1;
    params['page'] = this.activePage;
    params['per_page'] = this.limit;
    this.getData();
  }

  getData() {
    let params = {
      pagination: 1,
      page: this.activePage,
      per_page: this.limit,
      user_id: this.requestService.getLoggedInUser() ? this.requestService.getLoggedInUser().id : null
    }
    params = mergeRecursive(params, this.formValues);
    this.requestService.sendRequest(PropertyUrls.ALL_GET, 'GET', removeEmptyKeysFromObject(params)).subscribe(res => {
      if (res.status) {
        // this.toasterService.success(res.message, "Success");
        this.rows = res.data.data;
        this.total = res.data.total;
        setTimeout(() => {
          oneGridOwlCarousel()
        }, 1000);

      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }

  markFavorite(property) {
    if (!this.requestService.isAuthenticated()) {
      this.toasterService.error("Please Login First");
      return;
    }
    let params = {
      user_id: this.requestService.getLoggedInUser().id,
      property_id: property.id
    }
    this.requestService.sendRequest(PropertyUrls.PROPERTY_FAVORITE_POST, 'POST', params).subscribe(res => {
      console.log("PropertyListingComponent -> markFavorite -> res", res)
      if (res.status) {
        this.toasterService.success(res.message, "Success");
        this.getData();
      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }
  markUnFavorite(property) {
    if (!this.requestService.isAuthenticated()) {
      this.toasterService.error("Please Login First");
      return;
    }

    let params = {
      user_id: this.requestService.getLoggedInUser().id,
      property_id: property.id
    }
    this.requestService.sendRequest(PropertyUrls.PROPERTY_UNFAVORITE_POST, 'delete_with_body', params).subscribe(res => {
      console.log("PropertyListingComponent -> markFavorite -> res", res)
      if (res.status) {
        this.toasterService.success(res.message, "Success");
        this.getData();

      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }
    goToProperty(id) {
        this.router.navigateByUrl("/pages/property/" + id);
    }
  onViewMap(property) {
    this.myLatLng.lat = parseFloat(property.lat);
    this.myLatLng.lng = parseFloat(property.lng);
    this.zoom = 8;
    setTimeout(() => {
      this.zoom = 17;
    }, 500);

  }

  preview(media) {
    const ft = media.filter(m=> ['1', 1].includes(m.is_featured));
    return ft.length ? ft[0]?.base_path+'/'+ft[0]?.system_name : media[0]?.base_path+'/'+media[0]?.system_name;
  }
}



export function toggle() {
  // extending for text toggle
  $.fn.extend({
    toggleText: function (a, b) {
      return this.text(this.text() == b ? a : b);
    }
  });
  if ($('.showFilter').length) {
    $('.showFilter').on('click', function () {
      $(this).toggleText('Show Filter', 'Hide Filter');
      $(this).toggleClass('flaticon-close flaticon-filter-results-button sidebarOpended sidebarClosed');
      $('.listing_toogle_sidebar.sidenav').toggleClass('opened');
      $('.body_content').toggleClass('translated');
    });
  }

  $.fn.extend({
    toggleText2: function (a, b) {
      return this.text(this.text() == b ? a : b);
    }
  });

  if ($('.showBtns').length) {
    $('.showBtns').on('click', function () {
      $(this).toggleText2('Show Filter', 'Hide Filter');
      $(this).toggleClass('flaticon-close flaticon-filter-results-button sidebarOpended2 sidebarClosed2');
      $('.sidebar_content_details').toggleClass('is-full-width');
    });
  }
}