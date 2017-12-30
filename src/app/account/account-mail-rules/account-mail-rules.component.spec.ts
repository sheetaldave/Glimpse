import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMailRulesComponent } from './account-mail-rules.component';

describe('AccountMailRulesComponent', () => {
  let component: AccountMailRulesComponent;
  let fixture: ComponentFixture<AccountMailRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMailRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMailRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
