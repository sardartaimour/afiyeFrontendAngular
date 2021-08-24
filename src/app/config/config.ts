import {Inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';


@Injectable()
export class Config {

  private config: Object = null;

  constructor() {
    this.config = environment;
  }

  public getConfig(key: any) {
    return this.config[key];
  }

}
