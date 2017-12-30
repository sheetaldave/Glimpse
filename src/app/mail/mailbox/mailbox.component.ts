import { Component, OnInit, OnDestroy } from '@angular/core';
import { SideMenuService } from "../../nav-bar/side-menu.service";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.css']
})
export class MailboxComponent implements OnInit, OnDestroy {
  minimizeMenu: boolean = true;
  splitSidebarSize: number = null;
  sideMenuSubscription: Subscription;
  recalcSideMenuSubscription: Subscription;

  constructor(private sideMenuService: SideMenuService) {
  }

  ngOnInit() {
    this.splitSidebarSize = Number(localStorage.getItem('sidebar.size'));

    this.sideMenuSubscription = this.sideMenuService.isMinimized.subscribe(data => {
      this.minimizeMenu = data;
    });
    this.recalcSideMenuSubscription = this.sideMenuService.recalcMenuSize.subscribe(() => {
      this.splitSidebarSize = null;
      localStorage.setItem('sidebar.size', String(this.splitSidebarSize));
    });
  }

  ngOnDestroy() {
    this.sideMenuSubscription.unsubscribe();
    this.recalcSideMenuSubscription.unsubscribe();
  }

  onDragProgress(event) {
    if (event[0] < 6) {
      this.minimizeMenu = true;
    } else {
      this.minimizeMenu = false;
    }
    this.sideMenuService.updateMinimizedState(this.minimizeMenu);
  }

  onDragEnd(splitSizes: Array<number>) {
    this.splitSidebarSize = splitSizes[0];
    localStorage.setItem('sidebar.size', String(this.splitSidebarSize));
    this.sideMenuService.updateMinimizedState(this.minimizeMenu);
  }
}
