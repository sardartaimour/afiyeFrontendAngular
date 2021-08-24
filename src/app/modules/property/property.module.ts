import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRoutingModule } from './property-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { SearchPropertyComponent } from './search-property/search-property.component';
import { PropertyListingComponent } from './property-listing/property-listing.component';
import { PropertySharedComponent } from './property-shared/property-shared.component';
import { PropertyAddComponent } from './property-add/property-add.component';
import { PropertyEditComponent } from './property-edit/property-edit.component';
import { PropertyFormComponent } from './property-form/property-form.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { InboxModule } from '../inbox/inbox.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
@NgModule({
  declarations: [PropertyDetailComponent, SearchPropertyComponent, PropertyListingComponent, PropertySharedComponent, PropertyAddComponent, PropertyEditComponent, PropertyFormComponent],
  imports: [
    CommonModule,
    PropertyRoutingModule,
    SharedModule,
    NgbTypeaheadModule,
    NgxMaskModule.forRoot(),
    PaginationModule.forRoot(),
    InboxModule,
    PopoverModule.forRoot()
    // AgmCoreModule,
    // AgmCoreModule.forRoot({
    //   apiKey: environment.mapKey,
    //   libraries: ['places'],
    //   // region: ''
    // })
  ]
})
export class PropertyModule { }
