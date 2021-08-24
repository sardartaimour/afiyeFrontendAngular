import { Routes, RouterModule } from '@angular/router';
// import {ContentPagesModule} from '@appDir/pages/content-pages/content-pages.module';

// Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const CONTENT_ROUTES: Routes = [
    // {
    //     path: 'pages',
    //     loadChildren: './pages/content-pages/content-pages.module#ContentPagesModule'
    // }

    {
        // path: 'pages',
        path: 'pages', loadChildren: () => import('../../pages/content-pages/content-pages.module').then(m => m.ContentPagesModule),
        // loadChildren: '@appDir/pages/content-pages/content-pages.module#ContentPagesModule'
    },
    {
        // path: 'pages',
        path: 'users', loadChildren: () => import('../../modules/users/users.module').then(m => m.UsersModule),
        // loadChildren: '@appDir/pages/content-pages/content-pages.module#ContentPagesModule'
    },
    {
        // path: 'pages',
        path: 'inbox', loadChildren: () => import('../../modules/inbox/inbox.module').then(m => m.InboxModule),
        // loadChildren: '@appDir/pages/content-pages/content-pages.module#ContentPagesModule'
    },
    {
        // path: 'pages',
        path: 'property', loadChildren: () => import('../../modules/property/property.module').then(m => m.PropertyModule),
        // loadChildren: '@appDir/pages/content-pages/content-pages.module#ContentPagesModule'
    },
    {
        // path: 'pages',
        path: 'subscriptions', loadChildren: () => import('../../modules/subscriptions/subscriptions.module').then(m => m.SubscriptionsModule),
        // loadChildren: '@appDir/pages/content-pages/content-pages.module#ContentPagesModule'
    },
    {
        // path: 'pages',
        path: 'payment', loadChildren: () => import('../../modules/payment/payment.module').then(m => m.PaymentModule),
        // loadChildren: '@appDir/pages/content-pages/content-pages.module#ContentPagesModule'
    }
];
