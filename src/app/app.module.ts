import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { RequestService } from './shared/services/request.service';
import { HttpClientModule } from '@angular/common/http';
import { Config } from './config/config';
import { LocalStorage } from './libs/localstorage';
import { Ng5BreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { GlobalService } from './shared/services/global.service';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { ToastrModule } from 'ngx-toastr';

// for HttpClient import:
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, AmazonLoginProvider } from 'angularx-social-login';
import { NgPopupsModule } from 'ng-popups';

@NgModule({
    declarations: [
        AppComponent,
        FullLayoutComponent,
        ContentLayoutComponent,
        HeaderComponent,
        NavbarComponent,
        FooterComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        Ng5BreadcrumbModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.mapKey,
            libraries: ['places'],
            // region: ''
        }),

        ToastrModule.forRoot({
            positionClass: 'toast-top-center', progressAnimation: 'decreasing', progressBar: true, preventDuplicates: true
        }), // ToastrModule added



        // for HttpClient use:
        LoadingBarHttpClientModule,

        // for Router use:
        LoadingBarRouterModule,

        // for Core use:
        LoadingBarModule,

        SocialLoginModule,

        NgPopupsModule.forRoot({
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'Yes',
            cancelButtonText: 'No',
            color: '#8030c3',
            titles: {
                alert: 'Danger!',
                confirm: 'Confirmation',
                prompt: 'Website asks...'
            }
        }),

    ],
    providers: [RequestService, Config, LocalStorage, GlobalService,
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            environment.googleId, { prompt: 'select_account' }
                        ),
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider(environment.facebookId
                            //   , {
                            //   status: true,
                            //   xfbml: true,
                            //   version: "v3,3",
                            //   auth_type: 'reauthenticate'
                            // }
                        ),
                    },
                    // {
                    //   id: AmazonLoginProvider.PROVIDER_ID,
                    //   provider: new AmazonLoginProvider(
                    //     'clientId'
                    //   ),
                    // },
                ],
            } as SocialAuthServiceConfig,
        }],
    bootstrap: [AppComponent]
})
export class AppModule { }
