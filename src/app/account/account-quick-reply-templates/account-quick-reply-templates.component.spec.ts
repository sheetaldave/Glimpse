import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountQuickReplyTemplatesComponent } from './account-quick-reply-templates.component';

describe('AccountQuickReplyTemplatesComponent', () => {
  let component: AccountQuickReplyTemplatesComponent;
  let fixture: ComponentFixture<AccountQuickReplyTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountQuickReplyTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountQuickReplyTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
