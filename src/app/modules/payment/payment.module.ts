import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { CardListComponent } from './card-list/card-list.component';
import { AddCardComponent } from './add-card/add-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [CardListComponent, AddCardComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot(),
  ]
})
export class PaymentModule { }
