import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from 'src/app/shared/services/request.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, ObservableInput, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { PropertyUrls } from '../../property/property-urls.enum';
import { SubscriptionUrls } from '../subscription-urls.enum';
import { deepCopy, markFormGroupTouched, changeDateFormat, DaysBetween } from 'src/app/shared/utils/common-functions';
import { isObject } from 'util';
import { CardUrls } from '../../payment/card-urls.enum';
declare var $: any;
import * as moment from 'moment';
@Component({
  selector: 'app-add-subscriptions',
  templateUrl: './add-subscriptions.component.html',
  styleUrls: ['./add-subscriptions.component.scss']
})
export class AddSubscriptionsComponent implements OnInit {
  form: FormGroup;
  subscriptionType = null;
  selectedProperty = null;

  searching = false;
  searchFailed = false;

  cards = [];
  showCard = false;
  constructor(
    private toasterService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private formBuilder: FormBuilder,) {
    this.form = this.formBuilder.group(this.formElements());
    this.route.queryParams.subscribe(params => {
      this.subscriptionType = params['type'];
      if (this.subscriptionType == 1) {
        this.form.get('property_id').setValidators(Validators.required);
      } else {
        this.form.get('property_id').clearValidators();
      }
      this.form.get('subscription_type').setValue(this.subscriptionType);
      this.form.valueChanges.subscribe(values => {
        if (values.duration && values.per_day_charges) {
          this.form.get('total_amount').setValue(+values.duration * +values.per_day_charges, { emitEvent: false })
        } else {
          this.form.get('total_amount').setValue(null, { emitEvent: false })
        }
      })
    });
  }

  formElements() {
    return {
      "property_id": [null, Validators.required],
      "user_id": [this.requestService.getLoggedInUser().id, Validators.required],
      "card_id": [null, Validators.required],
      "start_date": [null, Validators.required],
      "end_date": [null, Validators.required],
      "duration": [null, Validators.required],
      "per_day_charges": [null, Validators.required],
      "discount_amount": [0, Validators.required],
      "total_amount": [, Validators.required],
      "subscription_type": [null, Validators.required],
      "subscription_payment_type": [1, Validators.required],
      "auto_renew": [1, Validators.required],
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 500);
    this.getData();
  }

  selectedItem(item) {
    this.selectedProperty = item.item;
    console.log(item);
  }

  getData() {
    let params = {
      user_id: this.requestService.getLoggedInUser().id
    }
    this.requestService.sendRequest(CardUrls.ALL_GET, 'GET', params).subscribe(res => {
      console.log("MainPageComponent -> getDataFeature -> res", res);
      this.showCard = true;
      if (res.status) {

        this.cards = res.data;
        console.log("AddSubscriptionsComponent -> getData -> this.cards", this.cards)

      } else {
        this.toasterService.error(res.message, "Error");
      }
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 50);
    }, error => {
      this.showCard = true;
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }

  onSubmit() {
    markFormGroupTouched(this.form);
    console.log("onSubmit -> this.form)", this.form.controls);
    if (!this.form.valid) {
      this.toasterService.error("Please fill All required properties");
      return;

    }
    let formValues = deepCopy(this.form.getRawValue());
    if (formValues && formValues['property_id'] && isObject(formValues['property_id'])) {
      formValues['property_id'] = formValues['property_id']['id'];
    }
    this.addCard(formValues);
  }

  addCard(data) {

    this.requestService.sendRequest(SubscriptionUrls.ADD_POST, 'POST', data).subscribe(res => {
      console.log("AddCardComponent -> addCard -> res", res)
      if (res && res.status) {
        // this.localStorage.setObject("user_details", res.result.data);
        this.toasterService.success(res.message, 'Success');
        this.router.navigate(['my-subscription'], { relativeTo: this.route.parent });
      } else {

        this.toasterService.error(res.message, 'Error');

      }
    }, error => {
      console.log("LoginComponent -> submit -> error", error);
      this.toasterService.error(error.error ? error.error.message : error.message, 'success');

    });
  }

  searchProperty = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searchFailed = true),
      switchMap(term =>
        term.length <= 2 ? this.returnEmpty() : this.doApiCall(PropertyUrls.ALL_GET, { search: term, pagination: 1, per_page: 50, page: 1 })
      ),
      tap(() => this.searchFailed = false)
    )
  propertyFormatter = (x) => x['name'];

  doApiCall(url, data): ObservableInput<any[]> {
    console.log("SkillFormComponent -> data", data)

    console.log("SkillFormComponent -> url", url)
    return <any>this.requestService.sendRequest(url, 'get', data)
      .pipe(
        tap(() => this.searchFailed = false),
        map((res) => {
          if (res['data']['data'].length == 0) {
            this.showNotFoundMessage();
          }
          return res['data']['data']
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

  getStartDate() {
    if (this.form.value.start_date) {
      // let mom = <any>moment(this.form.value.start_date, "DD-MM-YYYY").add(1, 'days');
      // let date = mom._d;
      let d = new Date(this.form.value.start_date).toISOString().split('T')[0];
      return d;
    }
  }
  getEndDate() {
    if (this.form.value.end_date) {
      let mom = <any>moment(this.form.value.end_date, "DD-MM-YYYY").add(1, 'days');
      let date = mom._d;
      let d = new Date(this.form.value.end_date).toISOString().split('T')[0];
      return d;
    }
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  updateDurationAndEndDate() {
    debugger;
    if (this.form.value.duration) {
      this.updateEndDate();
    }
    else {
      this.updateDuration();
    }
  }

  updateDuration() {
    let date1 = changeDateFormat(this.form.value.start_date ? this.form.value.start_date : null);
    let date2 = changeDateFormat(this.form.value.end_date ? this.form.value.end_date : null);
    console.log(date1, date2);

    if (date1 && date2) {
      let days = DaysBetween(date2, date1);
      if (days < 0) {
        days = days - 1;
      } else {
        days = days + 1;
      }
      console.log('days', days);
      this.form.controls['duration'].setValue(days);
    }
  }

  updateEndDate() {

    if (this.form.value.start_date) {
      let mom = <any>moment(this.form.value.start_date, "YYYY-MM-DD").add(+this.form.value.duration - 1, 'days');
      // let mom = <any>moment(this.form.value.start_date, "DD-MM-YYYY").add(+this.form.value.duration, 'days');
      let date = mom._d;
      console.log(date.toISOString().substring(0, 10));
      this.form.controls['end_date'].setValue(date.toISOString().substring(0, 10));
    }
  }

  setDate(date) {
    const currentDate = new Date(date);

    return currentDate.toISOString().substring(0, 10);
  }
}
