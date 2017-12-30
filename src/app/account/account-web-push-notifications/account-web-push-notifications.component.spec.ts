import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountWebPushNotificationsComponent } from './account-web-push-notifications.component';

describe('AccountWebPushNotificationsComponent', () => {
  let component: AccountWebPushNotificationsComponent;
  let fixture: ComponentFixture<AccountWebPushNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountWebPushNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWebPushNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
