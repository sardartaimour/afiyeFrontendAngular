import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss']
})
export class ChatModalComponent implements OnInit {
  @ViewChild('chatModal', { static: false }) chatModal: ModalDirective;
  selectedUser = null;
  showComp = false;
  constructor() { }

  ngOnInit(): void {
  }

  show() {
    this.chatModal.show();
  }

  hideModal() {
    this.chatModal.hide();
  }

  setData(data) {
    this.selectedUser = data;
  }
}
