import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  myLatLng = { lat: 4.9280888, lng: - 1.7468221 };
  constructor() { }

  ngOnInit(): void {
  }

}
