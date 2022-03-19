import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { PropertyUrls } from 'src/app/modules/property/property-urls.enum';
import { ToastrService } from 'ngx-toastr';
import { SharedModalMapComponent } from '../shared-modal-map/shared-modal-map.component';
import { GlobalService } from '../../services/global.service';
declare var $: any;
@Component({
  selector: 'app-shared-filter',
  templateUrl: './shared-filter.component.html',
  styleUrls: ['./shared-filter.component.scss']
})
export class SharedFilterComponent implements OnInit {
  form: FormGroup;
  attributes = null;

  @ViewChild(SharedModalMapComponent, { static: false }) public mapModal: SharedModalMapComponent;
  @Output() eventEmitter = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private toasterService: ToastrService,
    private globalService: GlobalService,
  ) {
    this.form = this.fb.group(this.formElements());
    this.globalService.mapData$.subscribe(res => {
      if (res) {
        this.form.patchValue(res);
        console.log("SharedFilterComponent -> this.form", this.form.value)
      }

      console.log("PropertyListingComponent -> constructor -> res", res);
    })
  }

  ngOnInit(): void {
    this.getAttributes();
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 500);
  }

  getAttributes() {
    this.requestService.sendRequest(PropertyUrls.ATTRIBUTES_GET, 'GET', {}).subscribe(res => {
      if (res.status) {
        this.attributes = res.data.data;
        console.log("SharedFilterComponent -> getAttributes -> this.attributes", this.attributes)
        // this.toasterService.success(res.message, "Success");
      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }

  formElements(): Object {
    return {
      "name": [null],
      "from_price": [null],
      "to_price": [null],
      "lot_size": [null],
      "property_area": [null],
      "property_type_id": [null],
      "property_category_id": [null],
      "air_conditioner": [null],
      "property_status_id": [null],
      "no_of_bath_room": [null],
      "no_of_bed_room": [null],
      "garage": [null],
      "kitchen": [null],
      "pool": [null],
      "garden": [null],
      "furniture": [null],
      "lat": [null],
      "lng": [null],
      "radius": [25],
      "search": [null],
      "user_id": [null],
      "address": [null],
    }
  }

  onFilter() {
    this.eventEmitter.emit(this.form.getRawValue());
  }
  setLocationOnMap() {
    console.log('called');
    this.mapModal.showModal(parseFloat(this.form.get('lat').value), parseFloat(this.form.get('lng').value));
    this.mapModal.setValues(this.form.value);
  }

  onCancel(event) {
    this.form.patchValue({
      "lat": null,
      "lng": null,
      "address": null
    })
  }

  onDoneEvent(placeData) {
    let form = this.form.value;
    console.log("MainPageComponent -> onDoneEvent -> placeData", placeData);
    for (const property in placeData) {
      if (form.hasOwnProperty(property)) {
        if (property == "formatted_address") {
          this.form.get("address").setValue(placeData[property]);
        } else {
          this.form.get(property).setValue(placeData[property]);
        }
      }
      this.form.get("address").setValue(placeData["formatted_address"]);

      console.log(`${property}: ${placeData[property]}`);
    }
  }
}
