import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertySharedComponent } from './property-shared/property-shared.component';
import { PropertyAddComponent } from './property-add/property-add.component';
import { PropertyEditComponent } from './property-edit/property-edit.component';


const routes: Routes = [

  {
    path: '',
    children: [
      { path: '', redirectTo: 'manage-properties', pathMatch: 'full' },
      {
        path: 'manage-properties',
        component: PropertySharedComponent,
        data: {
          title: 'Manage Properties',
          permission: "loginDefault",
          showFilter: true,
          isFavorite: false,
          isManage: true
        }
      },
      {
        path: 'favorite-properties',
        component: PropertySharedComponent,
        data: {
          title: 'Favorite Properties',
          permission: "loginDefault",
          showFilter: false,
          isFavorite: true,
        }
      },
      {
        path: 'add',
        component: PropertyAddComponent,
        data: {
          title: 'Property Add',
          permission: "loginDefault"

        }
      },
      {
        path: 'edit/:id',
        component: PropertyEditComponent,
        data: {
          title: 'Property Edit',
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
export class PropertyRoutingModule { }
