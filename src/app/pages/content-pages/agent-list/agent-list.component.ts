import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from 'src/app/shared/services/request.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AgentUrl } from './agent-url.enum';
import { ChatUrls } from 'src/app/modules/inbox/messages/chat-urls.enum';
import { ChatModalComponent } from 'src/app/modules/inbox/chat-modal/chat-modal.component';
import { UsersUrls } from '../../../modules/users/users-urls.enum';

@Component({
    selector: 'app-agent-list',
    templateUrl: './agent-list.component.html',
    styleUrls: ['./agent-list.component.scss']
})
export class AgentListComponent implements OnInit {

    public subscription: Subscription[] = [];
    search = '';
    rows: any = [];
    limit: number = 10;
    activePage: number = 1;
    total: number = 0;
    offset: number = 0;
    rotate = false;
    showLoading = true;
    @ViewChild(ChatModalComponent) chatComp: ChatModalComponent;
    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
        private requestService: RequestService,
    ) {
        let params = {
            "pagination": 1,
            "page": this.activePage,
            "per_page": this.limit,
            "role_id": 3,
            "agent_request": 3
        };
        this.getData(params);
    }

    ngOnInit() { }

    goToAgent(id) {
        this.router.navigateByUrl("/pages/agent/" + id);
    }
    onFilter() {
        let params = {
            "pagination": 1,
            "page": this.activePage,
            "per_page": this.limit,
            "role_id": 3,
            search: this.search,
            "agent_request": 3
        };
        this.getData(params);
    }

    onReset() {
        this.search = '';
        this.activePage = 1;
        let params = {
            "pagination": 1,
            "page": this.activePage,
            "per_page": this.limit,
            "role_id": 3,
            "agent_request": 3
        };
        this.getData(params);
    }

    getData(params) {
        this.showLoading = true;
        this.subscription.push(
            this.requestService.sendRequest(AgentUrl.ALL_GET, 'GET', params).subscribe(res => {
                this.showLoading = false;
                if (res.status) {                    
                    this.rows = res.data.data;                                       
                    this.total = res.data.total;
                } else {
                    this.toastrService.error(res.message, "Error");
                }
            }, error => {
                this.showLoading = false;
                this.toastrService.error(error['error'] ? error['error']['message'] : error.message, "Error");
            }));
    }


    public getAgent(id) {
        
        this.requestService.sendRequest(UsersUrls.USER_PROFILE_GET, "Get", { id: id }).subscribe(res => {
            console.log("AgentProfileComponent -> getData -> res", res)
            
            if (res && res.status) {
                if (res.result.data.licence_media_id != null && res.result.data.agent_certificate_media_id != null)
                    this.rows.push(res.result.data);
            } else {
                
            }
        }, error => {
            console.log("LoginComponent -> submit -> error", error);            
        });
    }

    pageChanged(event) {
        console.log(event);
        this.limit = event.itemsPerPage;
        this.activePage = event.page
        let params = {};
        params['pagination'] = 1;
        params['page'] = this.activePage;
        params['per_page'] = this.limit;
        params['role_id'] = 3;
        params['agent_request'] = 3;
        this.getData(params);
    }



    onDelete(row: any): void {

    }



    //========================================================================================
    /*                                                                                      *
     *                    Called once, before the instance is destroyed.                    *
     *                       Add 'implements OnDestroy' to the class.                       *
     *                                                                                      */
    //========================================================================================

    ngOnDestroy(): void {
        this.subscription.forEach(sub => {
            sub.unsubscribe();
        });
    }

    openChat(user) {
        if (user.id == this.requestService.getLoggedInUserId()) {
            this.toastrService.error("You cannot send message to yourself");
            return;
        };
        this.requestService.sendRequest(ChatUrls.Chat_HEAD_CHECK, "Get", { user_one: user.id, user_two: this.requestService.getLoggedInUserId(), user_id: this.requestService.getLoggedInUserId() }).subscribe(res => {
            console.log("AgentProfileComponent -> getData -> res", res)
            if (res && res.status) {
                this.chatComp.setData(res.data)
                this.chatComp.show();
            } else {
                this.toastrService.error(res.message, 'Error');
            }
        }, error => {
            console.log("LoginComponent -> submit -> error", error);
            this.toastrService.error(error.error ? error.error.message : error.message, 'Error');
        });

    }

}
