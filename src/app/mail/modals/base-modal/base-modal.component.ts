import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

declare const $: any;

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.less']
})
export class BaseModalComponent implements OnInit, OnDestroy {

  private routerObserver: any;

  modal: BsModalRef;

  // Constructor

  constructor(protected element: ElementRef, protected router: Router) {
    // Subscribe for route changes and hide modal after any route
    this.routerObserver = router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.modal.hide();
      }
    });
  }

  // Component lifecycle

  ngOnInit() {
    this.makeResizableAndDraggable();
  }

  ngOnDestroy() {
    this.routerObserver.unsubscribe();
  }

  // Methods

  close() {
    if (this.modal) {
      this.modal.hide();
    }
  }

  makeResizableAndDraggable() {
    $('.modal-content')
      .draggable({
        handle: '.modal-header',
        drag: function(e, ui) {
          if (ui.position.left < 0) {
            ui.position.left = 0;
          }
          if (ui.position.top < 0) {
            ui.position.top = 0;
          }
        }
      })
      .resizable();
  }

}
