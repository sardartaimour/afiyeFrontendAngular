import { Component, OnInit } from '@angular/core';
import { LocalStorage } from 'src/app/libs/localstorage';
import { Router } from '@angular/router';
// using es modules
import device from "current-device";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from 'src/app/shared/services/request.service';
import { ToastrService } from 'ngx-toastr';
import { emailRegEx } from 'src/app/shared/utils/email-validation_pattern.config';
import { Subscription } from 'rxjs';
import { isEmptyObject, markFormGroupTouched } from 'src/app/shared/utils/common-functions';
import { AuthenticationUrls } from 'src/app/shared/enums/authentication-urls.enum';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  subscriptions: Subscription[] = [];
    disableButton = false;
    

  constructor(    
    private localStorage: LocalStorage,
    private router: Router,
    private requestService: RequestService,
    private toasterService: ToastrService,
    private authService: SocialAuthService,
    private formBuilder: FormBuilder) {
    console.log('check Device ', device.type);
    this.form = this.formBuilder.group({
      "email": ['', [Validators.required, Validators.pattern(emailRegEx)]],
      "password": ['', [Validators.required, Validators.maxLength(15)]],
      "current_device": [device.type, Validators.required],
      "fcm_token": ["tokens", Validators.required],
    })

  }

  ngOnInit(): void {
      
  }

  doLogin() {
    markFormGroupTouched(this.form);
    if (!this.form.valid) {
      return;
    }

    let formValues = this.form.getRawValue();
    this.requestService.sendRequest(AuthenticationUrls.LOGIN_POST, "PUT", formValues).subscribe(res => {
      console.log("LoginComponent -> doLogin -> res", res);
      this.disableButton = false;
      if (res && res.status) {

        this.toasterService.success('User Login SuccessFully!', 'Login!');
        this.localStorage.set("token", res.data.data.active_jwt_token);
        this.localStorage.set("email", res.data.data.email);
        this.localStorage.setObject("user_details", res.data.data);
        this.router.navigate(['pages/main']);
      } else {
        this.toasterService.error(res.message, 'Error');
      }
    }, error => {
      this.disableButton = false;
      console.log("LoginComponent -> submit -> error", error);
      this.toasterService.error(error.error ? error.error.message : error.message, 'Error');
    });

    // this.localStorage.set("token", "true");
    // this.router.navigate(['pages/main']);
  }


  submitSocialSignUp(formValues) {
    this.requestService.sendRequest(AuthenticationUrls.SOCIAL_LOGIN_POST, "PUT", formValues).subscribe(res => {
      console.log("LoginComponent -> doLogin -> res", res);
      this.disableButton = false;
      if (res && res.status) {

        this.toasterService.success('User Login SuccessFully!', 'Login!');
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

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res => {
      console.log("LoginComponent -> signInWithGoogle -> res", res);
      let form = this.form.getRawValue();
      form['first_name'] = res.firstName;
      form['last_name'] = res.lastName;
      form['email'] = res.email;
      form['fcm_token'] = "tokens";
      form['social_type'] = res.provider == "FACEBOOK" ? 1 : 2;
      form['social_id'] = res.id;
      form['role_id'] = form['role_id'];
      this.submitSocialSignUp(form);
    }, error => {
      console.log("LoginComponent -> signInWithGoogle -> error", error)

    });
  }


  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
      console.log("LoginComponent -> signInWithFB -> res", res)
      let form = this.form.getRawValue();
      form['first_name'] = res.firstName;
      form['last_name'] = res.lastName;
      form['email'] = res.email;
      form['fcm_token'] = "tokens";
      form['social_type'] = res.provider == "FACEBOOK" ? 1 : 2;
      form['social_id'] = res.id;
      form['role_id'] = form['role_id'];
      this.submitSocialSignUp(form);
    }, error => {
      console.log("LoginComponent -> signInWithFB -> error", error)

    });
  }

}

// markFormGroupTouched(this.form);
// if (!this.form.valid) {
//   return;
// }

// let formValues = this.form.getRawValue();
// this.requestService.sendRequest(AuthenticationUrls.LOGIN_POST, "POST", formValues).subscribe(res => {
//   if (res && res.status) {

//   } else {

//   }
// }, error => {

// });