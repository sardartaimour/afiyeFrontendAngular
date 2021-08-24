import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import { MySubscriptionsComponent } from './my-subscriptions/my-subscriptions.component';
import { SelectSubscriptionsComponent } from './select-subscriptions/select-subscriptions.component';
import { AddSubscriptionsComponent } from './add-subscriptions/add-subscriptions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [MySubscriptionsComponent, SelectSubscriptionsComponent, AddSubscriptionsComponent],
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
    SharedModule,
    NgbTypeaheadModule,
    NgxMaskModule.forRoot(),
    PaginationModule.forRoot(),
  ]
})
export class SubscriptionsModule { }
