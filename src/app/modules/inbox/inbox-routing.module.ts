import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InboxMessagesComponent } from './inbox-messages/inbox-messages.component';
import { MessagesComponent } from './messages/messages.component';


const routes: Routes = [

  {
    path: '',
    children: [
      { path: '', redirectTo: 'messages', pathMatch: 'full' },
      {
        path: 'messages',
        component: MessagesComponent,
        data: {
          title: 'MESSAGES ',
          permission: "loginDefault"

        }
      },
      {
        path: 'inbox-messages',
        component: InboxMessagesComponent,
        data: {
          title: 'inbox Messages',
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
export class InboxRoutingModule { }
