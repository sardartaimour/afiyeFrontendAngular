import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/shared/services/request.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Router } from '@angular/router';
import { LocalStorage } from 'src/app/libs/localstorage';
import { PropertyUrls } from '../../property/property-urls.enum';
import { ChatUrls } from './chat-urls.enum';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgPopupsService } from 'ng-popups';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { isEmptyObject } from 'src/app/shared/utils/common-functions';
declare var $: any;
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  loggedInUser = null;
  chatHeads = [];
  showLoading = false;
  messages = [];

  @Input() selectedUserHead = null;
  selectedMessage = null;
  form: FormGroup;

  @ViewChild('scrollMessage', { static: false }) private myScrollContainer: ElementRef;

  isPagination = 1;
  dataPerPage = 50;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  finished = false  // boolean when end of database is reached
  presentPage: number = 1;
  pageData = null;
  infiniteScrollDisabled = false;
  hideAnimation = false;
  infiniteScroll: any;
  scrollToBottomIconShow = false;
  @ViewChild(InfiniteScrollDirective, { static: false })
  set appScroll(directive: InfiniteScrollDirective) {
    this.infiniteScroll = directive;
  }
  constructor(private router: Router,
    private globalService: GlobalService,
    public requestService: RequestService,
    private toasterService: ToastrService,
    private ngPopups: NgPopupsService,
    private fb: FormBuilder,
    private localStorage: LocalStorage) {
    this.form = this.fb.group(this.formElements());
    this.loggedInUser = this.requestService.getLoggedInUser();
    this.globalService.currentUserMessage$.subscribe(user => {

    })
  }

  formElements() {
    return {
      message: ['', Validators.required],
    }
  }

  ngOnInit(): void {
    console.log("MessagesComponent -> ngOnInit -> this.selectedUserHead", this.selectedUserHead);
    if (this.selectedUserHead && !isEmptyObject(this.selectedUserHead)) {
      this.chatHeads = [this.selectedUserHead];
      this.getMessages();
    } else {
      this.getChatHeads();
    }

  }

  getChatHeads() {
    let params = {
      user_id: this.requestService.getLoggedInUser() ? this.requestService.getLoggedInUser().id : null,
    }
    this.requestService.sendRequest(ChatUrls.CHAT_HEADS_GET_ALL, 'GET', params).subscribe(res => {
      console.log("MessagesComponent -> getChatHeads -> res", res)
      this.showLoading = false;
      if (res.status) {

        this.chatHeads = res.data;
        console.log("MessagesComponent -> getChatHeads -> this.chatHeads", this.chatHeads)

      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.showLoading = false;
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }

  getMessages() {
    let params = {
      id: this.selectedUserHead.id,
      pagination: 1,
      per_page: 5,
      page: this.presentPage
    }
    this.requestService.sendRequest(ChatUrls.ALL_GET, 'GET', params).subscribe(res => {
      this.showLoading = false;
      if (res.status) {

        this.messages = res.data.data.concat(this.messages);
        this.pageData = res.data;
        if (this.presentPage == 1) {
          this.scrollToBottom(300);
        }
        console.log("MessagesComponent -> getMessages ->  this.messages", this.messages)
        console.log("MessagesComponent -> getMessages -> this.messages", this.messages)

      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.showLoading = false;
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }

  sendMessage() {
    if (!this.selectedUserHead) {
      this.toasterService.error('Please Select user to Chat', 'User');
      return;
    }
    let params = {
      sender_id: this.requestService.getLoggedInUser() ? this.requestService.getLoggedInUser().id : null,
      receiver_id: this.selectedUserHead.user.id,
      conversation_id: this.selectedUserHead.id,
      message: this.form.value.message
    }
    this.requestService.sendRequest(ChatUrls.ADD_POST, 'POST', params).subscribe(res => {
      this.showLoading = false;
      if (res.status) {
        this.form.reset();
        this.messages.push(res.data);
        this.selectedMessage = null;
        if (!this.selectedUserHead.last_message) {
          this.selectedUserHead.last_message = {
            message: res.data['message']
          }
        } else {
          this.selectedUserHead.last_message.message = res.data['message'];
        }

        this.scrollToBottom(300);
        // this.getMessages();
        console.log("MessagesComponent -> getMessages -> this.messages", this.messages)

      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.showLoading = false;
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }

  editMessage() {
    let params = {
      id: this.selectedMessage.id,
      message: this.form.value.message
    }
    this.requestService.sendRequest(ChatUrls.ADD_POST, 'POST', params).subscribe(res => {
      this.showLoading = false;
      if (res.status) {
        this.form.reset();
        // this.messages = res.data.data;
        this.selectedMessage = null;
        this.getMessages();
        console.log("MessagesComponent -> getMessages -> this.messages", this.messages)

      } else {
        this.toasterService.error(res.message, "Error");
      }
    }, error => {
      this.showLoading = false;
      this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
    });
  }


  selectUser(user) {
    this.selectedUserHead = user;
    this.pageData = null;
    this.presentPage = 1;
    this.messages = [];
    this.getMessages();
  }

  scrollToBottom(time = 1500): void {
    try {
      setTimeout(() => {
        $('.inbox_chatting_box').animate({
          scrollTop: this.myScrollContainer.nativeElement.scrollHeight
        }, time);
      }, 0);

    } catch (err) { }
  }

  onMessageEditClick(message) {
    this.selectedMessage = message;
    this.form.patchValue({ message: message.message });
    this.scrollToBottom(300);
  }

  onDelete(row) {

    this.ngPopups.confirm('Do you  really want to delete this Message?')
      .subscribe(res => {
        if (res) {
          console.log('You clicked OK. You dumb.');
          let delete_params_ids = [row['id']];
          this.requestService.sendRequest(ChatUrls.DELETE_POST, 'Delete', { ids: [row.id] }).subscribe(res => {
            console.log('apiresponse', res);
            if (res.status) {
              this.getMessages();
            } else {
              this.toasterService.error(res.message, "Error");
            }
          });
        } else {
          console.log('You clicked Cancel. You smart.');
        }
      });
  }

  onUp() {
    console.log('scrolled up!');
    if (this.isPagination == 1) {
      if (this.messages.length !== this.pageData['total']) {
        this.presentPage = this.presentPage + 1;
        this.infiniteScrollDisabled = true;
        // this.activities = [];
        this.pageData = null;
        this.hideAnimation = false;
        this.getMessages();
      }
      this.direction = 'up'
    }
  }

  onScrollDown() {
    console.log('down');
  }
}
