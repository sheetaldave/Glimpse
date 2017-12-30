import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSyncMailsComponent } from './account-sync-mails.component';

describe('AccountSyncMailsComponent', () => {
  let component: AccountSyncMailsComponent;
  let fixture: ComponentFixture<AccountSyncMailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSyncMailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSyncMailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
