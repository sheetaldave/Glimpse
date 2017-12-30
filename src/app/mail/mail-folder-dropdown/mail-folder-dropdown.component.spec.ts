import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailFolderDropdownComponent } from './mail-folder-dropdown.component';

describe('MailFolderDropdownComponent', () => {
  let component: MailFolderDropdownComponent;
  let fixture: ComponentFixture<MailFolderDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailFolderDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailFolderDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
