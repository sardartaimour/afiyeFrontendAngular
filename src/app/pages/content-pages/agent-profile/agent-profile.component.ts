import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/shared/services/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from 'src/app/libs/localstorage';
import { UsersUrls } from 'src/app/modules/users/users-urls.enum';
import { Subscription } from 'rxjs';
import { PropertyUrls } from 'src/app/modules/property/property-urls.enum';
import { oneGridOwlCarousel } from 'src/app/shared/utils/common-functions';
import { ReviewUrls } from 'src/app/shared/enums/review-urls.enum';
import { ChatModalComponent } from 'src/app/modules/inbox/chat-modal/chat-modal.component';
import { ChatUrls } from 'src/app/modules/inbox/messages/chat-urls.enum';

@Component({
  selector: 'app-agent-profile',
  templateUrl: './agent-profile.component.html',
  styleUrls: ['./agent-profile.component.scss']
})
export class AgentProfileComponent implements OnInit {
  id = null;
  subscription: Subscription[] = [];
  disableButton = false;
  user = null;
  // propertyInfo

  rows: any = [];
  limit: number = 10;
  activePage: number = 1;
  total: number = 0;
  offset: number = 0;
  rotate = false;
  showLoading = true;
  // end property info

  //region reviews
  reviews = [];
  showLoadingReviews = true;
  currentRate = 0;
  comments = '';
  //endregion

  @ViewChild(ChatModalComponent) chatComp: ChatModalComponent;
  constructor(
    private localStorage: LocalStorage,
    private router: Router,
    private route: ActivatedRoute,
    public requestService: RequestService,
    private toasterService: ToastrService,
  ) {
    this.id = this.route.snapshot.params['id'];
    console.log('this.id ', this.id);
  }

  ngOnInit(): void {
    this.getData();
    this.onPropertiesAgent();
  }
    goToProperty(id) {
        this.router.navigateByUrl("/pages/property/" + id);
    }
  getData() {
    this.requestService.sendRequest(UsersUrls.USER_PROFILE_GET, "Get", { id: this.id }).subscribe(res => {
      console.log("AgentProfileComponent -> getData -> res", res)
      this.disableButton = false;
      if (res && res.status) {
        res.data.data["gender"] = res.data.data["gender"] ? res.data.data["gender"].toString() : res.data.data["gender"];
        this.user = res.data.data;
        console.log("AgentProfileComponent -> getData -> this.user", this.user)
      } else {
        this.toasterService.error(res.message, 'Error');
      }
    }, error => {
      console.log("LoginComponent -> submit -> error", error);
      this.toasterService.error(error.error ? error.error.message : error.message, 'Error');
    });
  }


  onPropertiesAgent() {
    let params = {
      user_id: this.id,
      user_id_by: 1,
      pagination: 1,
      per_page: this.limit,
      page: this.activePage,
      agent_properties: 1,
      login_id: this.requestService.getLoggedInUserId()
    }
    this.getDataProperty(params);
  }

  getDataProperty(params) {
    console.log("getDataProperty -> params", params)
    this.showLoading = true;
    this.subscription.push(
      this.requestService.sendRequest(PropertyUrls.ALL_GET, 'GET', params).subscribe(res => {
        console.log("getDataProperty -> res", res)
        this.showLoading = false;
        if (res.status) {
          this.rows = res.data.data;
          console.log("getDataProperty -> this.rows ", this.rows)
          this.total = res.data.to;
        } else {
          this.toasterService.error(res.message, "Error");
        }
      }, error => {
        this.showLoading = false;
        this.toasterService.error(error['error'] ? error['error']['message'] : error.message, "Error");
      }));
  }

  getReviews() {
    this.showLoadingReviews = true;
    this.subscription.push(
      this.requestService.sendRequest(ReviewUrls.ALL_GET, 'GET', { user_id: this.id }).subscribe(res => {
        this.showLoadingReviews = false;
        if (res.status) {
          this.reviews = res.data.data;
        } else {
          this.toasterService.error(res.message, "Error");
        }
      }, error => {
        this.showLoadingReviews = false;
        this.toasterService.error(error['error'] ? error['error']['message'] : error.message, "Error");
      }));
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

  addReview() {
    let formData = null;
    console.log("addReview -> this.comments", this.comments)
    if (this.id) {
      formData = {
        "user_id": this.id,
        "rated_by_id": this.requestService.getLoggedInUser().id,
        "comments": this.comments,
        "rating": this.currentRate
      }
    }
    // else {
    //   this.toastrService.error('Something Went Wrong !', 'Error');
    //   return false;
    // }
    if (!this.currentRate) {
      this.toasterService.error('please Select Rating !', 'Error');
      return false;
    }
    if (!this.comments) {
      this.toasterService.error('please add review description !', 'Error');
      return false;
    }
    this.disableButton = true;
    this.requestService.sendRequest(ReviewUrls.ADD_POST, 'Post', formData).subscribe(res => {
      this.disableButton = false
      if (res && res.status) {
        this.toasterService.success(res.message, 'Success');
        this.currentRate = 0;
        this.comments = '';
        this.getReviews();
      } else {

        this.toasterService.error(res.message, 'Error');

      }
    }, error => {
      this.disableButton = false
      this.toasterService.error(error.error ? error.error.message : error.message, 'success');

    });
  }


  openChat() {
    if (this.id == this.requestService.getLoggedInUserId()) {
      this.toasterService.error("You cannot send message to yourself");
      return;
    };
    this.requestService.sendRequest(ChatUrls.Chat_HEAD_CHECK, "Get", { user_one: this.id, user_two: this.requestService.getLoggedInUserId(), user_id: this.requestService.getLoggedInUserId() }).subscribe(res => {
      console.log("AgentProfileComponent -> getData -> res", res)
      if (res && res.status) {
        this.chatComp.setData(res.data)
        this.chatComp.show();
      } else {
        this.toasterService.error(res.message, 'Error');
      }
    }, error => {
      console.log("LoginComponent -> submit -> error", error);
      this.toasterService.error(error.error ? error.error.message : error.message, 'Error');
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
        this.onPropertiesAgent();
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
        this.onPropertiesAgent();

      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }
}
