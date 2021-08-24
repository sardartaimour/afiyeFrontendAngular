import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { AgmCoreModule } from '@agm/core';
import { SharedModalMapComponent } from './components/shared-modal-map/shared-modal-map.component';
import { SharedFilterComponent } from './components/shared-filter/shared-filter.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { UTCTimePipe } from './pipes/utc-time.pipe';
import { AppDownloadModalComponent } from './components/app-download-modal/app-download-modal.component';
@NgModule({
  declarations: [
    // NavbarComponent, HeaderComponent, FooterComponent
    SharedFilterComponent,
    SharedModalMapComponent,
    TimeAgoPipe,
    UTCTimePipe,
    AppDownloadModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    AgmCoreModule,
    ModalModule.forRoot()
  ],
  exports: [
    SharedModalMapComponent, SharedFilterComponent,
      FormsModule, ReactiveFormsModule, AgmCoreModule, TimeAgoPipe, UTCTimePipe, AppDownloadModalComponent
  ]
})
export class SharedModule { }
