import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocalStorage } from 'src/app/libs/localstorage';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/shared/services/request.service';
import { ToastrService } from 'ngx-toastr';
import { emailRegEx } from 'src/app/shared/utils/email-validation_pattern.config';
import device from "current-device";
import { markFormGroupTouched } from 'src/app/shared/utils/common-functions';
import { AuthenticationUrls } from 'src/app/shared/enums/authentication-urls.enum';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  subscriptions: Subscription[] = [];
  disableButton = false;
  constructor(
    private localStorage: LocalStorage,
    private router: Router,
    private requestService: RequestService,
    private toasterService: ToastrService,
    private formBuilder: FormBuilder) {
    console.log('check Device ', device.type);
    this.form = this.formBuilder.group({
      "email": ['', [Validators.required, Validators.pattern(emailRegEx)]],
      "password": ['', [Validators.required, Validators.maxLength(15)]],
      "current_device": [device.type, Validators.required],
      "first_name": ["", Validators.required],
      "last_name": ["", Validators.required],
      "phone_no": ["", Validators.required],
      "fcm_token": ["tokens", Validators.required],
      "role_id": [3, Validators.required],
      "gender": ["", Validators.required],
      repeat: [null, Validators.required],
    }, { validator: this.checkIfMatchingPasswords('password', 'repeat') });

  }

  private checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  ngOnInit(): void {
  }

  doRegister() {
    markFormGroupTouched(this.form);
    if (!this.form.valid) {
      return;
    }

    let formValues = this.form.getRawValue();
    this.requestService.sendRequest(AuthenticationUrls.REGISTER_POST, "POST", formValues).subscribe(res => {
      console.log("RegisterComponent -> doRegister -> res", res)
      this.disableButton = false;
      if (res && res.status) {
        this.localStorage.set("token", res.result.data.active_jwt_token);
        this.localStorage.set("email", res.result.data.email);
        this.localStorage.setObject("user_details", res.result.data);
        this.router.navigate(['pages/main']);

      } else {
        this.toasterService.error(res.message, 'Error');
      }
    }, error => {
      this.disableButton = false;
      console.log("LoginComponent -> submit -> error", error);
      this.toasterService.error(error.error ? error.error.message : error.message, 'Error');
    });
  }

}
