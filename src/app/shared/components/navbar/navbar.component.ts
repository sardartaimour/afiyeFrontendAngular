import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage } from 'src/app/libs/localstorage';
declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  subscription: Subscription[] = [];
  countries = [];
  constructor(private router: Router, private route: ActivatedRoute,
    private globalService: GlobalService, public requestService: RequestService, private toasterSService: ToastrService,
    private localStorage: LocalStorage,) { }

  ngOnInit(): void {
    setTimeout(() => {
      // $.getScript("assets/js/select2.js");
    }, 50);
    this.getCountries();
  }

  getCountries() {
    this.requestService.get('assets/data/countries.json', 'get', {}).subscribe((res: any) => {
      console.log("NavbarComponent -> getCountries -> res", res)
      this.countries = res;
      $.getScript("assets/js/select2.js");
    }, error => {
      console.log("NavbarComponent -> getCountries -> error", error)

    })
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
}
