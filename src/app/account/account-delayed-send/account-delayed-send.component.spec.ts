import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDelayedSendComponent } from './account-delayed-send.component';

describe('AccountDelayedSendComponent', () => {
  let component: AccountDelayedSendComponent;
  let fixture: ComponentFixture<AccountDelayedSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountDelayedSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDelayedSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
