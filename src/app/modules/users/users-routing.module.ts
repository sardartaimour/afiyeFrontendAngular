import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CurrentUserProfileComponent } from './current-user-profile/current-user-profile.component';


const routes: Routes = [

  {
    path: '',
    children: [
      { path: '', redirectTo: 'view-profile', pathMatch: 'full' },
      {
        path: 'profile/:id',
        component: UserProfileComponent,
        data: {
          title: 'Doctor List',
          permission: "loginDefault"

        }
      },
      {
        path: 'view-profile',
        component: CurrentUserProfileComponent,
        data: {
          title: 'Doctor Profile',
          permission: "loginDefault"

        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
