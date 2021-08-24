import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { CONTENT_ROUTES } from './shared/routes/content-layout.routes';



const appRoutes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },

  // {
  //   path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES,
  //   canActivate: [AuthGuard],
  // },

  // { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },


  {
    path: '',
    redirectTo: 'pages/main',
    pathMatch: 'full',
  },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
  { path: '**', redirectTo: 'pages/main' },

];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
