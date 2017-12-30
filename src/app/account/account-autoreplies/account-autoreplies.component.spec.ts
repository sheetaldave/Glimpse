import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAutorepliesComponent } from './account-autoreplies.component';

describe('AccountAutorepliesComponent', () => {
  let component: AccountAutorepliesComponent;
  let fixture: ComponentFixture<AccountAutorepliesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAutorepliesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAutorepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
