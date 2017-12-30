import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account';
import { SideMenuService } from "./side-menu.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  account: Account;
  minimizeMenu: boolean;
  @Input() search: boolean;

  constructor(private auth: AuthService,
              private router: Router,
              private accountService: AccountService,
              private sideMenuService: SideMenuService) {}

  emit() {
    this.minimizeMenu = !this.minimizeMenu;
    this.sideMenuService.updateMinimizedState(this.minimizeMenu);
    this.sideMenuService.recalcMenuSize.next();
  }

  ngOnInit() {
    this.auth.authenticated.subscribe(authenticated => {
      if (authenticated) {
        this.accountService.getAccount()
          .subscribe(account => this.account = account)
      }
    });
    this.sideMenuService.isMinimized.subscribe(data => {
      this.minimizeMenu = data;
    });
  }

  isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  signOut() {
    this.auth.signOut()
      .then(() => this.router.navigate(['signin']));
  }

}
