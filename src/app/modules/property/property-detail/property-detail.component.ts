import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { RequestService } from 'src/app/shared/services/request.service';
import { ToastrService } from 'ngx-toastr';
import { PropertyUrls } from '../property-urls.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatUrls } from '../../inbox/messages/chat-urls.enum';
import { ChatModalComponent } from '../../inbox/chat-modal/chat-modal.component';
import { AgentUrl } from '../../../pages/content-pages/agent-list/agent-url.enum';
declare var $: any;
@Component({
    selector: 'app-property-detail',
    templateUrl: './property-detail.component.html',
    styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
    iconUrl = "../assets/images/logo-blue.png";
    iconObject: any;
    myLatLng = { lat: 7.8984774, lng: -3.2749614 };
    singleProperty = null;
    id = null;
    selectedImage = null;
    images = [];
    allImages = [];
    agents: any = [];
    showAllImages = false;
    showImageBtnText = "Show More";
    @ViewChild(ChatModalComponent) chatComp: ChatModalComponent;
    protected map: any;
    constructor(
        public requestService: RequestService,        
        private route: ActivatedRoute,
        private router: Router,
        private toasterService: ToastrService,) {

        this.id = this.route.snapshot.params['id'];
        this.iconObject = {
            url: '../assets/images/square.png',
            scaledSize: {
                width: 10,
                height: 15
            }
        };
        // this.requestService.isAuthenticated()
    }

    public mapReady(map) {
        this.map = map;
    }

    ngOnInit(): void {
        // $.getScript("assets/js/google-maps.js");
        this.getData();
        this.getAgents();
    }

    isShowAllImages() {
        this.showAllImages = !this.showAllImages;
        this.images = [];
        if (this.showAllImages == true) {     
            this.showImageBtnText = "Show Less";
            for (var i = 0; i < this.allImages.length; i++) {
                this.images.push(this.allImages[i]);
            }
        }
        else {
            this.showImageBtnText = "Show More";
            for (var i = 0; i < this.allImages.length; i++) {
                if (i == 6)
                    break;
                this.images.push(this.allImages[i]);
            }
        }
    }

    getData() {
        let params = {
            id: this.id
        }
        this.requestService.sendRequest(PropertyUrls.SINGLE_GET, 'GET', params).subscribe(res => {
            if (res.status) {
                this.singleProperty = res.data.data;
                this.allImages = res.data.data.media;
                for (var i = 0; i < this.allImages.length; i++) {
                    if (i == 6)
                        break;

                    this.images.push(this.allImages[i]);
                }
                

                this.myLatLng.lat = this.singleProperty.lat;
                this.myLatLng.lng = this.singleProperty.lng;
                this.map.setCenter({ lat: parseFloat(<any>this.myLatLng.lat), lng: parseFloat(<any>this.myLatLng.lng) });
                debugger;
                if (res.data.data && res.data.data.media.length > 0) {
                    this.selectedImage = res.data.data.media[0];
                }
                this.handleChange();
            } else {
                this.toasterService.error(res.message, "Error");
            }
        }, error => {
            this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
        });
    }

    handleChange() {

        setTimeout(() => {
            $('.fancybox').fancybox({
                type: "iframe"
            });
            popupImage();
        }, 1000);
    }

    markFavorite(property) {
        if (!this.requestService.isAuthenticated()) {
            this.toasterService.error("Please Login First");
            return;
        }
        let params = {
            user_id: this.requestService.getLoggedInUser().id,
            property_id: property.id
        }
        this.requestService.sendRequest(PropertyUrls.PROPERTY_FAVORITE_POST, 'POST', params).subscribe(res => {
            console.log("PropertyListingComponent -> markFavorite -> res", res)
            if (res.status) {
                this.toasterService.success(res.message, "Success");
                this.getData();

            } else {
                this.toasterService.error(res.message, "Error");
            }
        }, error => {
            this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
        });
    }


    deleteProperty() {
        if (!this.requestService.isAuthenticated()) {
            this.toasterService.error("Please Login First");
            return;
        }
        if (this.requestService.getLoggedInUser().id != this.singleProperty.user.id) {
            this.toasterService.error("You are mot authorized to do it");
            return;
        }
        this.requestService.sendRequest(PropertyUrls.DELETE_POST_PROPERTY, 'delete_with_body', { ids: [this.singleProperty.id] }).subscribe(res => {
            if (res.status) {
                this.toasterService.success(res.message, "Success");
            } else {
                this.toasterService.error(res.message, "Error");
            }
        }, error => {
            this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
        });
    }

    onEdit() {
        console.log(this.singleProperty);
        // console.log(this.requestService.getLoggedInUser());
        if (!this.requestService.isAuthenticated()) {
            this.toasterService.error("Please Login First");
            return;
        }
        if (this.requestService.getLoggedInUser().id != this.singleProperty.user.id) {
            this.toasterService.error("You are mot authorized to do it");
            return;
        }
        this.router.navigate(["/property/edit/" + this.singleProperty.id])
    }

    changeImage(image) {
        this.selectedImage = image;
    }

    onChangeImage(ac: 'NEXT' | 'PREVIOUS') {
        const idx = this.allImages.findIndex(img=> this.selectedImage?.system_name === img?.system_name);
        
        const i = ac === 'NEXT' ? 1 : -1;
        let nxtIdx = idx + i;
        if (nxtIdx >= this.allImages.length) {
            nxtIdx = 0;
        }
        else if (nxtIdx < 0) {
            nxtIdx = this.allImages.length - 1;
        }
        
        this.selectedImage = this.allImages[nxtIdx];
    }

    markUnFavorite(property) {
        if (!this.requestService.isAuthenticated()) {
            this.toasterService.error("Please Login First");
            return;
        }
        if (this.requestService.getLoggedInUser().id != this.singleProperty.user.id) {
            this.toasterService.error("You are mot authorized to do it");
            return;
        }
        let params = {
            user_id: this.requestService.getLoggedInUser().id,
            property_id: property.id
        }
        this.requestService.sendRequest(PropertyUrls.PROPERTY_UNFAVORITE_POST, 'delete_with_body', params).subscribe(res => {
            console.log("PropertyListingComponent -> markFavorite -> res", res)
            if (res.status) {
                this.toasterService.success(res.message, "Success");
                this.getData();

            } else {
                this.toasterService.error(res.message, "Error");
            }
        }, error => {
            this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
        });
    }

    openChat(id) {
        if (id == this.requestService.getLoggedInUserId()) {
            this.toasterService.error("You cannot send message to yourself");
            return;
        };
        this.requestService.sendRequest(ChatUrls.Chat_HEAD_CHECK, "Get", { user_one: id, user_two: this.requestService.getLoggedInUserId(), user_id: this.requestService.getLoggedInUserId() }).subscribe(res => {
            console.log("AgentProfileComponent -> getData -> res", res)

            if (res && res.status) {
                this.chatComp.setData(res.data)
                this.chatComp.show();
            } else {
                this.toasterService.error(res.message, 'Error');
            }
        }, error => {
            console.log("LoginComponent -> submit -> error", error);
            this.toasterService.error(error.error ? error.error.message : error.message, 'Error');
        });

    }

    getAgents() {
        
        let params = {
            "pagination": 1,
            "page": 1,
            "per_page": 10000,
            "role_id": 3,
            search: '',
            agent_request: 3
        };
        this.requestService.sendRequest(AgentUrl.ALL_GET, 'GET', params).subscribe(res => {

            if (res.status) {
                this.agents = res.data.data;
                console.log('Agents');                
                console.log(this.agents);
                //this.total = res.result.total;
            } else {
                this.toasterService.error(res.message, "Error");
            }
        }, error => {

            this.toasterService.error(error['error'] ? error['error']['message'] : error.message, "Error");
        });
            
    }

    goToAgent(id) {
        this.router.navigateByUrl("/pages/agent/" + id);
    }

}

function popupImage() {
    /* ----- MagnificPopup ----- */
    if (($(".popup-img").length > 0) || ($(".popup-iframe").length > 0) || ($(".popup-img-single").length > 0)) {
        $(".popup-img").magnificPopup({
            type: "image",
            gallery: {
                enabled: true,
            }
        });
        $(".popup-img-single").magnificPopup({
            type: "image",
            gallery: {
                enabled: false,
            }
        });
        $('.popup-iframe').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            preloader: false,
            fixedContentPos: false
        });
        $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });
    };
}