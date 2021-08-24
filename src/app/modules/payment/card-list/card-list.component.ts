import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/shared/services/request.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { CardUrls } from '../card-urls.enum';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  rows = [];
  constructor(private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    private requestService: RequestService) {
  }

  ngOnInit(): void {
    this.getData();
  }


  getData() {
    let params = {
      user_id: this.requestService.getLoggedInUser().id
    }
    this.requestService.sendRequest(CardUrls.ALL_GET, 'GET', params).subscribe(res => {
      console.log("MainPageComponent -> getDataFeature -> res", res);
      if (res.status) {

        this.rows = res.data;
      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }

  deleteData(card) {
    let params = {
      user_id: this.requestService.getLoggedInUser().id,
      token: this.requestService.getToken(),
      id: card.id
    }
    this.requestService.sendRequest(CardUrls.DELETE_GET, 'delete', params).subscribe(res => {
      console.log("MainPageComponent -> getDataFeature -> res", res);
      if (res.status) {
        this.toasterService.success(res.message, "Error");
        this.getData();
      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }
}
