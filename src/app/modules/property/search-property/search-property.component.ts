import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-property',
  templateUrl: './search-property.component.html',
  styleUrls: ['./search-property.component.scss']
})
export class SearchPropertyComponent implements OnInit {
  myLatLng = { lat: 51.510280, lng: -0.084028 };
  constructor() { }

  ngOnInit(): void {
  }

}
