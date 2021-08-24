import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location, LocationStrategy } from "@angular/common";
import { Router } from '@angular/router';
import { Config } from 'src/app/config/config';
import { LocalStorage } from 'src/app/libs/localstorage';
import { Observable } from 'rxjs';
import { makeParamsFromFormData } from '../utils/helpers';
import { removeEmptyKeysFromObject, isEmptyObject, replaceKeySandValues } from '../utils/common-functions';
@Injectable({
  providedIn: 'root'
})

// @Injectable()
export class RequestService {
  url: string;
  constructor(private httpClient: HttpClient,
    private config: Config,
    private _location: Location,
    private locationStrategy: LocationStrategy,
    private _router: Router,
    private localStorage: LocalStorage,) {
  }


  private makeUrl(url) {
    return this.config.getConfig('apiUrl') + url;
  }

  sendRequest(url, type, formData?): Observable<any> {
    const apiUrl = this.makeUrl(url);
    const params = makeParamsFromFormData(formData || {});
    switch (type.toLowerCase()) {
      case 'get':
        return this.httpClient.get(apiUrl, { params: params });
      case 'post':
        return this.httpClient.post(apiUrl, formData);
      case 'put':
        return this.httpClient.put(apiUrl, formData);
      case 'delete':
        return this.httpClient.delete(apiUrl, { params: params });
      case 'delete_with_body':
        const header: HttpHeaders = new HttpHeaders()
        const httpOptions = {
          headers: header,
          body: formData
        };
        return this.httpClient.delete(apiUrl, httpOptions);
      case 'post_file':
        return this.httpClient.post(apiUrl, formData, {
          reportProgress: true,
          observe: 'events'
        });
    }
  }

  getToken() {
    return this.localStorage.get('token');
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
      this._router.createUrlTree([], {
        queryParams: params,
      }
      ).toString()
    );
  }




  getLoggedInUserId() {
    return this.localStorage.getObject('user_details') ? this.localStorage.getObject('user_details').id : '';
  }

  getLoggedInUser() {
    return this.localStorage.getObject('user_details');
  }


  public isAuthenticated(): boolean {
    const token = this.localStorage.get('token');
    // Check whether the token is expired and return
    // true or false
    if (token) {
      return true;
      // return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }
  public getLocation(loc): Observable<any> {
    this.url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + loc.lat + ',' + loc.lng + '&key= ' + this.config.getConfig('mapKey');
    // this.url = this.url+"?token="+this.getToken();

    return this.httpClient.get(this.url);
  }

}

