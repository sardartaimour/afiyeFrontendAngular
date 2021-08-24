import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from 'src/app/breadcrumb/breadcrumb.module';
import { Router, NavigationEnd, ActivatedRoute, ActivationEnd, ActivatedRouteSnapshot, RoutesRecognized } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {
  @ViewChild('breadCrumb', { static: false }) breadcumb: BreadcrumbComponent;
  title = "";
  isShowHeader = true;
  page = 'pages/login';
  constructor(public router: Router, private route: ActivatedRoute, private globalService: GlobalService) {


    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        this.page = this.router.url;
        this.globalService.routePage$.next(this.page);
        //console.log(this.router.url);
        let title: string = this.getTitle(router.routerState, router.routerState.root).join(',');
        let titleStringFullView: string[] = title.split(",");
        //console.log('title', titleStringFullView.filter(Boolean).slice(-1)[0]);
        this.title = titleStringFullView.filter(Boolean).slice(-1)[0];
      }
    });
  }

  ngOnInit(): void {

    setTimeout(() => {
      if (this.breadcumb) {
        this.breadcumb.ngOnChanges(new Object());
      }
    }, 500)


  }

  getTitle(state, parent) {
    var data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      let value = this.getTitle(state, state.firstChild(parent));
      data.push(this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
}
