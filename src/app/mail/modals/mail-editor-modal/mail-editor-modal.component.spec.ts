import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailEditorModalComponent } from './mail-editor-modal.component';

describe('MailEditorModalComponent', () => {
  let component: MailEditorModalComponent;
  let fixture: ComponentFixture<MailEditorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailEditorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
