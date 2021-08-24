import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MySubscriptionsComponent } from './my-subscriptions/my-subscriptions.component';
import { SelectSubscriptionsComponent } from './select-subscriptions/select-subscriptions.component';
import { AddSubscriptionsComponent } from './add-subscriptions/add-subscriptions.component';


const routes: Routes = [

  {
    path: '',
    children: [
      { path: '', redirectTo: 'my-subscription', pathMatch: 'full' },
      {
        path: 'my-subscription',
        component: MySubscriptionsComponent,
        data: {
          title: 'my Subscription',
          permission: "loginDefault"

        }
      },
      {
        path: 'select-subscription',
        component: SelectSubscriptionsComponent,
        data: {
          title: 'Select Subscription',
          permission: "loginDefault"

        }
      },

      {
        path: 'add-subscription',
        component: AddSubscriptionsComponent,
        data: {
          title: 'Add Subscription',
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
export class SubscriptionsRoutingModule { }
