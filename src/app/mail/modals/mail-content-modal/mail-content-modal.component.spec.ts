import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailContentModalComponent } from './mail-content-modal.component';

describe('MailContentModalComponent', () => {
  let component: MailContentModalComponent;
  let fixture: ComponentFixture<MailContentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailContentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailContentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
