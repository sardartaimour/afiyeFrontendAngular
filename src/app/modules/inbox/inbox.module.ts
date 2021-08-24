import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InboxRoutingModule } from './inbox-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { InboxMessagesComponent } from './inbox-messages/inbox-messages.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChatModalComponent } from './chat-modal/chat-modal.component';

@NgModule({
  declarations: [MessagesComponent, InboxMessagesComponent, ChatModalComponent],
  imports: [
    CommonModule,
    InboxRoutingModule,
    SharedModule,
    InfiniteScrollModule,
    ModalModule.forRoot()
  ],
  exports: [ChatModalComponent]
})
export class InboxModule { }
