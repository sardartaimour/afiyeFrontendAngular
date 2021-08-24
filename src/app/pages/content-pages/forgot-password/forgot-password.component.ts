import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from 'src/app/shared/services/request.service';
import { LocalStorage } from 'src/app/libs/localstorage';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationUrls } from 'src/app/shared/enums/authentication-urls.enum';
import { markFormGroupTouched } from 'src/app/shared/utils/common-functions';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  disableButton: boolean = false;

  form: FormGroup;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private requestService: RequestService,
    private fb: FormBuilder,
    private localStorage: LocalStorage,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group(this.formElements());
  }

  ngOnInit(): void {
  }

  formElements(): Object {
    // let phoneValidation = this.type == LoginType.doctor ? [Validators.required] : [];
    return {
      'email': ['', Validators.required],
    }

  }

  onSubmit() {
    markFormGroupTouched(this.form);
    if (!this.form.valid) {
      return;
    }

    let form = this.form.getRawValue();
    this.disableButton = true;
    this.requestService.sendRequest(AuthenticationUrls.FORGOT_PASSWORD_GET, 'get', { email: form.email }).subscribe(res => {

      console.log("ForgotPasswordComponent -> submit -> res", res);
      this.disableButton = false;

      if (res && res.status) {

        this.toastr.success(res.message, 'Forgot Password!');
        // this.goBack();

      } else {

        this.toastr.error(res.message, 'Error');

      }
    }, error => {
      this.disableButton = false;
      console.log("ForgotPasswordComponent -> submit -> error", error);
      this.toastr.error(error.error ? error.error.message : error.message, 'success');

    });
  }

}
