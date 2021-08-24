import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentPagesRoutingModule } from './content-pages-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainPageComponent } from './main-page/main-page.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { AgentProfileComponent } from './agent-profile/agent-profile.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FaqComponent } from './faq/faq.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsComponent } from './terms/terms.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { PropertyModule } from 'src/app/modules/property/property.module';
import { NgxMaskModule } from 'ngx-mask';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InboxModule } from 'src/app/modules/inbox/inbox.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
@NgModule({
  declarations: [LoginComponent, MainPageComponent, AgentListComponent, AgentProfileComponent, AboutUsComponent, ContactUsComponent, RegisterComponent, ForgotPasswordComponent, FaqComponent, PrivacyPolicyComponent, TermsComponent],
  imports: [
    CommonModule,
    ContentPagesRoutingModule,
    ModalModule.forRoot(),
    AgmCoreModule,
    PropertyModule,
    NgxMaskModule.forRoot(),
    PaginationModule.forRoot(),
    NgbRatingModule,
    SharedModule,
    InboxModule,
    PopoverModule.forRoot(),
  ]
})
export class ContentPagesModule { }
