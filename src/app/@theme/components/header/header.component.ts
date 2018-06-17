import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../../auth/login/login.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  providers: [AngularFirestore, AngularFireAuth],
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any;
  private currentUser: firebase.User;

  userMenu = [{ title: 'Profile'  }, { title: 'Log out', link: 'logout()' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private modalService: NgbModal,
              private changeDetectorRef: ChangeDetectorRef,
              private db: AngularFirestore,
              private auth: AngularFireAuth) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        changeDetectorRef.detectChanges();
      }
    });
}

  ngOnInit() {
    this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
  showLargeModal() {
    const activeModal = this.modalService.open(LoginComponent, { size: 'lg', container: 'nb-layout' });
  }

  logout(){
    console.log("[DEBUG] User attempts to log out");
    firebase.auth().signOut()
    .then(() =>{
      this.currentUser = undefined;
      console.log("[DEBUG] User has logged out successfully");
      this.changeDetectorRef.detectChanges();
    })
    .catch((message) => {
      console.log("[DEBUG] Singout Error:",message);
    })
    
  }

  onMenuClick($even){
    console.log($even);
  }
}
