import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardListComponent } from './card-list/card-list.component';
import { AddCardComponent } from './add-card/add-card.component';


const routes: Routes = [

  {
    path: '',
    children: [
      { path: '', redirectTo: 'card-list', pathMatch: 'full' },
      {
        path: 'card-list',
        component: CardListComponent,
        data: {
          title: 'Card List',
          permission: "loginDefault"

        }
      },
      {
        path: 'add-card',
        component: AddCardComponent,
        data: {
          title: 'Add Card',
          permission: "loginDefault"

        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
