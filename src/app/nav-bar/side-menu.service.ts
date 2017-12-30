import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class SideMenuService {

  isMinimized = new BehaviorSubject<boolean>(true);
  recalcMenuSize = new Subject();

  constructor() {
    const value = localStorage.getItem('sidebar.minimized');
    if (value === null || value === undefined) {
      this.updateMinimizedState(true);
    } else {
      this.updateMinimizedState(value === 'true');
    }
  }

  updateMinimizedState(nextState: boolean) {
    localStorage.setItem('sidebar.minimized', String(nextState));
    this.isMinimized.next(nextState);
  };
}
