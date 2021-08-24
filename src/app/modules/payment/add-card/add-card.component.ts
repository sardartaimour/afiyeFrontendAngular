import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from 'src/app/shared/services/request.service';
import { CardUrls } from '../card-urls.enum';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {
  customStripeForm: FormGroup;
  formProcess = false;
  submitted = false;
  message = '';
  constructor(private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService) {
    this.customStripeForm = this.formBuilder.group(this.formElements());
  }

  formElements() {
    return {
      cardNumber: ["", Validators.required],
      expYear: ["", Validators.required],
      expMonth: ["", Validators.required],
      cvv: ["", Validators.required],
      name: ["", Validators.required],
    }
  }

  ngOnInit(): void {
    this.loadStripe();
  }

  loadStripe() {

    var s = window.document.createElement("script");
    s.id = "stripe-custom-form-script";
    s.type = "text/javascript";
    s.src = "https://js.stripe.com/v2/";
    s.onload = () => {
      window['Stripe'].setPublishableKey(environment.stripeKey);
    }

    window.document.body.appendChild(s);
  }

  CreateToken(form) {
    if (!window['Stripe']) {
      alert('Oops! Stripe did not initialize properly.');
      return;
    }

    console.log(this.customStripeForm);
    if (this.customStripeForm.invalid) {
      return;
    }
    this.formProcess = true;
    console.log("form");
    console.log(form);
    if (!window['Stripe']) {
      alert('Oops! Stripe did not initialize properly.');
      return;
    }

    var date = new Date(form.expiry);
    var month = date.getMonth();
    var year = date.getFullYear();
    (<any>window).Stripe.card.createToken({
      number: form.cardNumber,
      exp_month: form.expMonth,
      exp_year: form.expYear,
      cvc: form.cvc
    }, (status: number, response: any) => {
      console.log("AddCardComponent -> CreateToken -> response", response);

      this.submitted = false;
      this.formProcess = false;
      if (status === 200) {
        this.message = `Success! Card token ${response.card.id}.`;
        let data = {
          card_type: response.card.brand,
          token: response.id,
          last_4: form.cardNumber.slice(form.cardNumber.length - 4),
          full_name: form.name,
          user_id: this.requestService.getLoggedInUser().id
        }
        this.addCard(data);
      } else {
        this.message = response.error.message;
      }
    });
  }

  addCard(data) {

    this.requestService.sendRequest(CardUrls.ADD_POST, 'POST', data).subscribe(res => {
      console.log("AddCardComponent -> addCard -> res", res)
      if (res && res.status) {
        // this.localStorage.setObject("user_details", res.result.data);
        this.toasterService.success(res.message, 'Success');
        this.router.navigate(['card-list'], { relativeTo: this.route.parent });
      } else {

        this.toasterService.error(res.message, 'Error');

      }
    }, error => {
      console.log("LoginComponent -> submit -> error", error);
      this.toasterService.error(error.error ? error.error.message : error.message, 'success');

    });
  }
}
