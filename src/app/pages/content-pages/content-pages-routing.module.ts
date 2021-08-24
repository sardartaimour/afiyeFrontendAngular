import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
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
import { PropertyDetailComponent } from 'src/app/modules/property/property-detail/property-detail.component';
import { SearchPropertyComponent } from 'src/app/modules/property/search-property/search-property.component';
import { PropertyListingComponent } from 'src/app/modules/property/property-listing/property-listing.component';
import { PropertySharedComponent } from 'src/app/modules/property/property-shared/property-shared.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'Login',
          permission: "loginDefault",
          isShowHeader: false,
          isShowFooter: false,
        }
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: {
          title: 'Register',
          permission: "loginDefault",

        }
      },
      {
        path: 'main',
        component: MainPageComponent,
        data: {
          title: 'Main page',
          permission: "loginDefault",

        }
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
          title: 'Forgot Password',
          permission: "loginDefault",

        }
      },
      {
        path: 'agents',
        component: AgentListComponent,
        data: {
          title: 'Agent List',
          permission: "loginDefault",

        }
      },
      {
        path: 'agent/:id',
        component: AgentProfileComponent,
        data: {
          title: 'Agent Profile',
          permission: "loginDefault",

        }
      },
      {
        path: 'about-us',
        component: AboutUsComponent,
        data: {
          title: 'About Us',
          permission: "loginDefault",

        }
      },
      {
        path: 'contact-us',
        component: ContactUsComponent,
        data: {
          title: 'Contact us',
          permission: "loginDefault",

        }
      },
      {
        path: 'faq',
        component: FaqComponent,
        data: {
          title: "FAQ's",
          permission: "loginDefault",

        }
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        data: {
          title: "Privacy policy",
          permission: "loginDefault",

        }
      },
      {
        path: 'terms',
        component: TermsComponent,
        data: {
          title: "Terms",
          permission: "loginDefault",

        }
      },
      {
        path: 'property/:id',
        component: PropertyDetailComponent,
        data: {
          title: "Property Details",
          permission: "loginDefault",

        }
      },
      {
        path: 'search-property',
        component: SearchPropertyComponent,
        data: {
          title: "Property Search",
          permission: "loginDefault",

        }
      },
      {
        path: 'property-list',
        component: PropertyListingComponent,
        data: {
          title: "Property List",
          permission: "loginDefault",

        }
      },
      {
        path: 'featured-properties',
        component: PropertySharedComponent,
        data: {
          title: "Featured Properties",
          permission: "loginDefault",
          showFilter: false,
          isFavorite: false,
          isFeatured: true
        }
      },
      {
        path: 'most-favorite-properties',
        component: PropertySharedComponent,
        data: {
          title: "Most Favorite Properties",
          permission: "loginDefault",
          showFilter: false,
          isFavorite: false,
          isFeatured: true,
          isMostFavorite: true
        }
      },
    ],
    // resolve: { route: AclResolverService, state: AclResolverService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentPagesRoutingModule { }
