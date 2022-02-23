import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';

import { ModalModule } from 'ngx-bootstrap/modal';
import { AgmCoreModule } from '@agm/core';
import { SharedModalMapComponent } from './components/shared-modal-map/shared-modal-map.component';
import { SharedFilterComponent } from './components/shared-filter/shared-filter.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { UTCTimePipe } from './pipes/utc-time.pipe';
import { AppDownloadModalComponent } from './components/app-download-modal/app-download-modal.component';
import { AfiyeFilePickerComponent } from './file-picker/file.component';
import { AfiyeImageCropperPickerComponent } from './file-picker/image-cropper/image.cropper.component';
@NgModule({
  declarations: [
    // NavbarComponent, HeaderComponent, FooterComponent
    SharedFilterComponent,
    SharedModalMapComponent,
    TimeAgoPipe,
    UTCTimePipe,
    AppDownloadModalComponent,
    AfiyeFilePickerComponent,
    AfiyeImageCropperPickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    AgmCoreModule,
    ImageCropperModule,
    ModalModule.forRoot()
  ],
  exports: [
    ImageCropperModule,
    AfiyeFilePickerComponent,AfiyeImageCropperPickerComponent,
    SharedModalMapComponent, SharedFilterComponent,
      FormsModule, ReactiveFormsModule, AgmCoreModule, TimeAgoPipe, UTCTimePipe, AppDownloadModalComponent
  ]
})
export class SharedModule { }
