import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-app-download-modal',
    templateUrl: './app-download-modal.component.html',
    styles: [
    ]
})
export class AppDownloadModalComponent implements OnInit {
    @Output() onCancel = new EventEmitter();
    @ViewChild('appDownloadModal', { static: false }) appDownloadModal: ModalDirective;
    constructor() { }

    ngOnInit(): void {
    }

    hideModal() {
        this.appDownloadModal.hide();
    }

    showModal() {
        
        this.appDownloadModal.show();
            //this.hide();
        
    }
    goToPlayStore() {
        window.location.href = environment.playstoreUrl;
    }
    goToAppStore() {
        window.location.href = environment.appstoreUrl;
    }
    cancel() {
        this.onCancel.emit(true);
    }

    //show() {
    //    if (this.isOpenButtonHide) {
    //        $("#open").css({ "display": "block" });
    //    }
    //    if (this.isSideBarRemoved) {
    //        $("#listing").addClass("translated");
    //    }
    //    if (this.isHeaderRemoved) {
    //        $("#header_top").addClass("mainheader");
    //    }
    //}
}
