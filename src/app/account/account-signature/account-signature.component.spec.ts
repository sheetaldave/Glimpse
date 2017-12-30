import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSignatureComponent } from './account-signature.component';

describe('AccountSignatureComponent', () => {
  let component: AccountSignatureComponent;
  let fixture: ComponentFixture<AccountSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
