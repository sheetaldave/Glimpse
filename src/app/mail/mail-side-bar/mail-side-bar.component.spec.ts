import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSideBarComponent } from './mail-side-bar.component';

describe('MailSideBarComponent', () => {
  let component: MailSideBarComponent;
  let fixture: ComponentFixture<MailSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
