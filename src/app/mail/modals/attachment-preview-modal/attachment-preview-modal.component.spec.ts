import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentPreviewModalComponent } from './attachment-preview-modal.component';

describe('AttachmentPreviewModalComponent', () => {
  let component: AttachmentPreviewModalComponent;
  let fixture: ComponentFixture<AttachmentPreviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentPreviewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
