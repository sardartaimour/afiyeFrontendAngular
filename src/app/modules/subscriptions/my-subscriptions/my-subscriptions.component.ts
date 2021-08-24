import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/shared/services/request.service';
import { SubscriptionUrls } from '../subscription-urls.enum';

@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.scss']
})
export class MySubscriptionsComponent implements OnInit {
  rows: any = [];
  limit: number = 10;
  activePage: number = 1;
  total: number = 0;
  offset: number = 0;
  rotate = false;
  showLoading = true;
  constructor(private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    private requestService: RequestService) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    let params = {
      pagination: 1,
      page: this.activePage,
      per_page: this.limit,
      user_id: this.requestService.getLoggedInUser() ? this.requestService.getLoggedInUser().id : null,
    }
    this.showLoading = true;
    this.requestService.sendRequest(SubscriptionUrls.ALL_GET, 'GET', params).subscribe(res => {
      console.log("MainPageComponent -> getDataFeature -> res", res);
      this.showLoading = false;
      if (res.status) {

        this.rows = res.result.data;
        this.total = res.result.total;
      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.showLoading = false;
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
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
}
