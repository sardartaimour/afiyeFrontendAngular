import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/shared/services/request.service';
import { PropertyUrls } from '../property-urls.enum';
import { oneGridOwlCarousel, removeEmptyKeysFromObject, mergeRecursive } from 'src/app/shared/utils/common-functions';
//import { debug } from 'console';

@Component({
  selector: 'app-property-shared',
  templateUrl: './property-shared.component.html',
  styleUrls: ['./property-shared.component.scss']
})
export class PropertySharedComponent implements OnInit {
  title = '';
  rows: any = [];
  limit: number = 12;
  activePage: number = 1;
  total: number = 0;
  offset: number = 0;
  rotate = false;
  showLoading = true;
  formValues = {};
  url = PropertyUrls.ALL_GET;
  showFilter = false;
  isManage = false;
  constructor(public route: ActivatedRoute,
    private requestService: RequestService,
    private toasterService: ToastrService,
    public router: Router,
  ) {
    this.title = this.route.snapshot.data['title'];
    console.log("PropertySharedComponent -> this.title", this.title)
    this.showFilter = this.route.snapshot.data['showFilter'];
    console.log("PropertySharedComponent -> this.showFilter ", this.showFilter)
    if (this.route.snapshot.data['isFavorite']) {
      this.url = PropertyUrls.USER_FAVORITE_PROPERTY;
    }
    if (this.route.snapshot.data['isMostFavorite']) {
      this.url = PropertyUrls.MOST_FAVORITE_PROPERTY;
    }
    if (this.route.snapshot.data['isManage']) {
      this.isManage = this.route.snapshot.data['isManage'];
    }
    console.log("PropertySharedComponent -> constructor ->  this.title", this.title)
  }

  ngOnInit(): void {
    this.getData();
  }
    goToProperty(item) {
        debugger;
        var id = item.property_id;
        if (id == undefined) {
            id = item.id;
        }
        this.router.navigateByUrl("/pages/property/" + id);
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
    console.log("PropertySharedComponent -> getData -> this.requestService.getLoggedInUser()", this.requestService.getLoggedInUser())
    let params = {
      pagination: 1,
      page: this.activePage,
      per_page: this.limit,
      user_id: this.requestService.getLoggedInUser() ? this.requestService.getLoggedInUser().id : null
    }
    if (this.requestService.getLoggedInUser() && !this.route.snapshot.data['isFeatured']) {
      params['user_id_by'] = 1;
    }
    if (this.route.snapshot.data['isFavorite']) {
      params['is_featured'] = 1;
    }
    params = mergeRecursive(params, this.formValues);
    params['user_id'] = this.requestService.getLoggedInUser() ? this.requestService.getLoggedInUser().id : null;
    this.requestService.sendRequest(this.url, 'GET', removeEmptyKeysFromObject(params)).subscribe(res => {
      if (res.status) {
        // this.toasterService.success(res.message, "Success");
        // this.rows = res.data ? res.data.data : res.result.data;
        // this.total = res.data ? res.data.data : res.result.total;

        this.rows = res.data.data;
        this.total = res.data.total;
        console.log("PropertySharedComponent -> getData -> this.total", this.total)
        setTimeout(() => {
          oneGridOwlCarousel()
        }, 500);

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
      property_id: this.route.snapshot.data['isFavorite'] ? property.property_id : property.id
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


  deleteProperty(property) {
    if (!this.requestService.isAuthenticated()) {
      this.toasterService.error("Please Login First");
      return;
    }
    this.requestService.sendRequest(PropertyUrls.DELETE_POST_PROPERTY, 'delete_with_body', { ids: [property.id] }).subscribe(res => {
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

  onEdit(property) {
    console.log(property);
    // console.log(this.requestService.getLoggedInUser());
    if (!this.requestService.isAuthenticated()) {
      this.toasterService.error("Please Login First");
      return;
    }

    this.router.navigate(["/property/edit/" + property.id])
  }


}
