import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCancelComponent } from './account-cancel.component';

describe('AccountCancelComponent', () => {
  let component: AccountCancelComponent;
  let fixture: ComponentFixture<AccountCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
