import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Location, LocationStrategy } from "@angular/common";
import { Router } from "@angular/router";
import { Config } from "src/app/config/config";
import { LocalStorage } from "src/app/libs/localstorage";
import { Observable } from "rxjs";
import { makeParamsFromFormData } from "../utils/helpers";
import {
  removeEmptyKeysFromObject,
  isEmptyObject,
  replaceKeySandValues,
} from "../utils/common-functions";
import { PropertyUrls } from "src/app/modules/property/property-urls.enum";
import { ChatUrls } from "src/app/modules/inbox/messages/chat-urls.enum";
import { CardUrls } from "src/app/modules/payment/card-urls.enum";
import { CommonUrls } from "../enums/common-urls.enum";
import { AuthenticationUrls } from "../enums/authentication-urls.enum";
import { ReviewUrls } from "../enums/review-urls.enum";
import { UsersUrls } from "src/app/modules/users/users-urls.enum";
import { SubscriptionUrls } from "src/app/modules/subscriptions/subscription-urls.enum";
@Injectable({
  providedIn: "root",
})

// @Injectable()
export class RequestService {
  url: string;
  constructor(
    private httpClient: HttpClient,
    private config: Config,
    private _location: Location,
    private locationStrategy: LocationStrategy,
    private _router: Router,
    private localStorage: LocalStorage
  ) {}

  private makeUrl(url) {
    return this.config.getConfig("apiUrl") + url;
  }

  sendRequest(url, type, formData?): Observable<any> {
    const apiUrl = this.makeUrl(url);
    const params = makeParamsFromFormData(formData || {});

	const addToken = [
		PropertyUrls.DELETE_POST, ChatUrls.CHAT_HEADS_GET_ALL, ChatUrls.ADD_POST, ChatUrls.ALL_GET,
		ChatUrls.DELETE_POST, ChatUrls.Chat_HEAD_CHECK, CardUrls.USER_PROFILE_GET, 
		AuthenticationUrls.LOGOUT_GET,  CommonUrls.USER_MEDIA_ADD, ReviewUrls.ADD_POST,
		PropertyUrls.ADD_POST, PropertyUrls.UPDATE_PUT, CardUrls.UPDATE_PUT, SubscriptionUrls.UPDATE_PUT, UsersUrls.UPDATE_PUT, PropertyUrls.PROPERTY_FAVORITE_POST,
		PropertyUrls.PROPERTY_MEDIA_ADD, PropertyUrls.DELETE_POST_PROPERTY, PropertyUrls.USER_FAVORITE_PROPERTY,
		PropertyUrls.PROPERTY_UNFAVORITE_POST
	].includes(url);

	let header: HttpHeaders = new HttpHeaders({
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${this.localStorage.get("token")}`,
	});

  if (url === CommonUrls.USER_MEDIA_ADD || url === PropertyUrls.PROPERTY_MEDIA_ADD) {
    header = new HttpHeaders({
      'Authorization': `Bearer ${this.localStorage.get("token")}`,
    });
  }

    switch (type.toLowerCase()) {
		case "get":
			const body = {params: params};
			if (addToken) {
				body['headers'] = header;
				// body['observe'] = 'response';
			}
			return this.httpClient.get(apiUrl, body);
		case "post":
			let options = {}
			if (addToken) {
				options = { headers: header };
			}
			return this.httpClient.post(apiUrl, formData, options);
		case "put":
			let options1 = {}
			if (addToken) {
				options1 = { headers: header };
			}
			return this.httpClient.put(apiUrl, formData, options1);
		case "delete":
			let deleteBody = { params: params };
			if (addToken) {
				deleteBody['headers'] = header;
			}
			return this.httpClient.delete(apiUrl, deleteBody);
		case "delete_with_body":
			let httpOptions = {
				params: formData
			};
			if (addToken) {
				httpOptions['headers'] = header;
			}
			
			return this.httpClient.delete(apiUrl, httpOptions);
		case "post_file":

			return this.httpClient.post(apiUrl, formData, {
				reportProgress: true,
				observe: "events",
				headers: header
			});
    }
  }

  getToken() {
    return this.localStorage.get("token");
  }

  get(url, type, formData?) {
    return this.httpClient.get(url);
  }

  addUrlQueryParams(params) {
    params = removeEmptyKeysFromObject(params);
    console.log(isEmptyObject(params));
    if (!isEmptyObject(params)) {
      params = replaceKeySandValues(params);
    }

    this._location.replaceState(
      this._router
        .createUrlTree([], {
          queryParams: params,
        })
        .toString()
    );
  }

  getLoggedInUserId() {
    return this.localStorage.getObject("user_details")
      ? this.localStorage.getObject("user_details").id
      : "";
  }

  getLoggedInUser() {
    return this.localStorage.getObject("user_details");
  }

  public isAuthenticated(): boolean {
    const token = this.localStorage.get("token");
    // Check whether the token is expired and return
    // true or false
    if (token) {
      return true;
      // return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }
  public getLocation(loc): Observable<any> {
    this.url =
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      loc.lat +
      "," +
      loc.lng +
      "&key= " +
      this.config.getConfig("mapKey");
    // this.url = this.url+"?token="+this.getToken();

    return this.httpClient.get(this.url);
  }
}
