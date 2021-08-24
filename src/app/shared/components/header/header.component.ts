import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivationStart } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { GlobalService } from '../../services/global.service';
import { RequestService } from '../../services/request.service';
import { LocalStorage } from 'src/app/libs/localstorage';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { AuthenticationUrls } from '../../enums/authentication-urls.enum';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  page = '';
  changeHeader = false;
  userDetails = null;
  constructor(private router: Router, private route: ActivatedRoute,
    private globalService: GlobalService,
    private toasterService: ToastrService,
    public requestService: RequestService, private toasterSService: ToastrService,
    private localStorage: LocalStorage,) {
    //console.log('test');
    this.globalService.userUpdate$.subscribe(user => {
      if (user) {
        this.userDetails = user;
      }
    })
    this.globalService.routePage$.subscribe(res => {
      this.page = res;
      let self = this;
      self.userDetails = this.localStorage.getObject('user_details');
      console.log("HeaderComponent -> this.userDetails", this.userDetails)
      //console.log("HeaderComponent -> this.page", this.page)
      if (this.page == '/pages/about-us' || this.page == '/pages/contact-us' || this.page == '/pages/agents' || this.page == '/pages/faq' || this.page == '/pages/privacy-policy' || this.page == '/pages/terms'
        || this.page == '/pages/search-property' || this.page == '/pages/property-list' || this.page == '/pages/featured-properties' || this.page == '/inbox/messages' || this.page == '/property/favorite-properties' || this.page == '/property/manage-properties' || this.ifInRoute('/users/profile') || this.ifInRoute('/pages/agent')
        || this.page == '/subscriptions/my-subscription' || this.page == '/subscriptions/select-subscription' || this.ifInRoute('/subscriptions/add-subscription')
        || this.page == '/payment/card-list' || this.page == '/payment/add-card' || this.page == '/property/add' || this.page == '/pages/most-favorite-properties' || this.ifInRoute('/property/edit') || this.ifInRoute('/pages/property/')) {
        this.changeHeader = true;
      } else {
        this.changeHeader = false;
      }
    })
  }
  ifInRoute(str) {
    if (<any>this.page.includes(str)) {
      return true
    }
    return false
  }
  ngOnInit(): void {
    let self = this;
    self.userDetails = this.localStorage.getObject('user_details');
    $.getScript("assets/js/script.js");
  }

  logout() {
    window.localStorage.clear();
    this.router.navigate(['pages/main']);
  }

  addProperty() {
    console.log('test add');
    if (!this.requestService.isAuthenticated()) {
      this.toasterSService.error('Please first Login then add property', 'Login');
      return false;
    }
    this.router.navigate(['property/add']);

  }

  onLogout() {
    let email = this.localStorage.get('email');
    this.requestService.sendRequest(AuthenticationUrls.LOGOUT_GET, 'GET', { email: email, token: this.localStorage.get('token') }).subscribe(res => {
      if (res && res.status) {
        window.localStorage.clear();
        this.toasterService.success(res.message, 'success');
        this.router.navigate(['pages/main']);

      } else {
        this.toasterService.error(res.message, 'Error');
      }
    }, error => {
      window.localStorage.clear();
      this.router.navigate(['pages/main']);
      this.toasterService.error(error.error ? error.error.message : error.message, 'Error');
    })
  }

  getLink() {
    let id = '';
    if (this.userDetails) {
      id = this.userDetails.id;
    }
    return "/users/profile/" + id
  }
}
