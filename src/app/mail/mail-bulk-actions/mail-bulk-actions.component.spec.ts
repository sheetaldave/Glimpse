import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailBulkActionsComponent } from './mail-bulk-actions.component';

describe('MailBulkActionsComponent', () => {
  let component: MailBulkActionsComponent;
  let fixture: ComponentFixture<MailBulkActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailBulkActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailBulkActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
