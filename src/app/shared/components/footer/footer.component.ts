import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    scroll();
  }

}

export function scroll() {
  //Click event to scroll to top
  $('.scrollToHome').on('click', function () {
    console.log('up');
    $('html, body').animate({ scrollTop: 0 }, 800);
    return false;
  });
}