import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModalMapComponent } from 'src/app/shared/components/shared-modal-map/shared-modal-map.component';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/shared/services/request.service';
import { PropertyUrls } from 'src/app/modules/property/property-urls.enum';
import { LooseObject, oneGridOwlCarousel, sliderProperty } from 'src/app/shared/utils/common-functions';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppDownloadModalComponent } from 'src/app/shared/components/app-download-modal/app-download-modal.component';
declare var $: any;
declare var jQuery: any;
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

    deviceInfo = null;
    value = "Search";
    formValues: LooseObject = {};
    type = "1";

    rowsFeature: any = [];
    rowsMostFavorite: any = [];
    limit: number = 10;
    activePage: number = 1;
    total: number = 0;
    offset: number = 0;
    rotate = false;
    showLoadingFeature = true;
    showLoadingFavorite = true;
    ad = null;
    @ViewChild(SharedModalMapComponent) mapModal: SharedModalMapComponent;
    @ViewChild(AppDownloadModalComponent) appDownloadModal: AppDownloadModalComponent;

    constructor(private router: Router,
        private deviceService: DeviceDetectorService,
        private globalService: GlobalService,
        private requestService: RequestService,
        private toasterService: ToastrService,) { }

    ngOnInit(): void {
        $.getScript("assets/js/script.js");
        this.getData();
        this.changeTab('1');
        
    }
    ngAfterViewInit() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();
        const isDesktopDevice = this.deviceService.isDesktop();
        console.log(this.deviceInfo);
        console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
        console.log(isTablet);  // returns if the device us a tablet (iPad etc)
        console.log(isDesktopDevice);
        if (isMobile || isTablet) {
            this.openAppDownloadModal();
        }
    }

    openAppDownloadModal() {
        
        this.appDownloadModal.showModal();
    }

    goToProperty(id) {
        this.router.navigateByUrl("/pages/property/" + id);
    }
    getData() {
        let params = {
            // pagination: 1,
            // page: this.activePage,
            // per_page: this.limit,
            user_id: this.requestService.getLoggedInUser() ? this.requestService.getLoggedInUser().id : null,
            // is_featured: 1
        }
        this.rowsFeature = [];
        this.rowsMostFavorite = [];
        this.requestService.sendRequest(PropertyUrls.PROPERTY_HOME_PAGE_ALL_GET, 'GET', params).subscribe(res => {
            console.log("MainPageComponent -> getDataFeature -> res", res)
            this.showLoadingFeature = false;
            if (res.status) {

                this.rowsFeature = res.data.featured;
                this.rowsMostFavorite = res.data.favorite;
                this.ad = res.data.ad;
                console.log("MainPageComponent -> getDataFeature -> this.rowsFeature", this.rowsFeature)
                setTimeout(() => {
                    sliderProperty('feature_property_slider');
                    // $.getScript("assets/js/script.js");
                }, 50);

            } else {
                this.toasterService.error(res.message, "Error");
            }
        }, error => {
            this.showLoadingFeature = false;
            this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
        });
    }

    markFavorite(property, index, rowType) {
        if (!this.requestService.isAuthenticated()) {
            this.toasterService.error("Please Login First");
            return;
        }
        let params = {
            user_id: this.requestService.getLoggedInUser().id,
            property_id: rowType == 2 ? property.property_id : property.id
        }
        this.requestService.sendRequest(PropertyUrls.PROPERTY_FAVORITE_POST, 'POST', params).subscribe(res => {
            console.log("PropertyListingComponent -> markFavorite -> res", res)
            if (res.status) {
                this.toasterService.success(res.message, "Success");
                if (rowType == 2) {
                    this.rowsMostFavorite[index]['is_favorite'] = 1;
                    this.rowsMostFavorite = [...this.rowsMostFavorite];
                }
                if (rowType == 1) {
                    this.rowsFeature[index]['is_favorite'] = 1;
                    this.rowsFeature = [... this.rowsFeature];
                }
            } else {
                this.toasterService.error(res.message, "Error");
            }
        }, error => {
            this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
        });
    }
    markUnFavorite(property, index, rowType) {
        if (!this.requestService.isAuthenticated()) {
            this.toasterService.error("Please Login First");
            return;
        }

        let params = {
            user_id: this.requestService.getLoggedInUser().id,
            property_id: rowType == 2 ? property.property_id : property.id
        }
        this.requestService.sendRequest(PropertyUrls.PROPERTY_UNFAVORITE_POST, 'delete_with_body', params).subscribe(res => {
            console.log("PropertyListingComponent -> markFavorite -> res", res)
            if (res.status) {
                this.toasterService.success(res.message, "Success");
                // this.getData();
                if (rowType == 2) {
                    this.rowsMostFavorite[index]['is_favorite'] = 0;
                    this.rowsMostFavorite = [...this.rowsMostFavorite];
                }
                if (rowType == 1) {
                    this.rowsFeature[index]['is_favorite'] = 0;
                    this.rowsFeature = [... this.rowsFeature];
                }

            } else {
                this.toasterService.error(res.message, "Error");
            }
        }, error => {
            this.toasterService.error(error['error'] ? error['error']['message'] : error['error'] ? error['error']['message'] : error.message, "Error");
        });
    }

    changeTab(value) {
        this.type = value;
        this.formValues['property_type_id'] = this.type;
        console.log("MainPageComponent -> changeTab -> this.formValue", this.formValues);
        this.globalService.mapData$.next(this.formValues);
    }

    routeTo(route) {
        this.router.navigate([route]);
    }


    onImageClick(Property) {
        console.log("MainPageComponent -> onImageClick -> Property", Property)
        this.router.navigate(['/pages/property/' + Property.id]);
    }
    openMapModal() {
        this.mapModal.showModal(null, null);
    }
    onDoneEvent(placeData) {
        console.log("MainPageComponent -> onDoneEvent -> placeData", placeData);
        if (placeData && placeData.formatted_address) {
            this.value = placeData.formatted_address;
            placeData.address = placeData.formatted_address;
        }
        this.formValues = placeData;
        this.formValues['property_type_id'] = this.type;
        this.globalService.mapData$.next(placeData);
    }

}
