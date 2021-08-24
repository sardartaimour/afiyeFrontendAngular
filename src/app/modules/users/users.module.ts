import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CurrentUserProfileComponent } from './current-user-profile/current-user-profile.component';

import { NgxMaskModule } from 'ngx-mask';
@NgModule({
  declarations: [UserProfileComponent, CurrentUserProfileComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot(),
  ]
})
export class UsersModule { }
