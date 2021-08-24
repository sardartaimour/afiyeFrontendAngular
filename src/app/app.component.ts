import { Component } from '@angular/core';
import { preloaderLoad } from './shared/utils/common-functions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'medical-app';
  myLatLng = { lat: 5.376964, lng: 100.399383 };
  constructor() {
    preloaderLoad();
  }
}
