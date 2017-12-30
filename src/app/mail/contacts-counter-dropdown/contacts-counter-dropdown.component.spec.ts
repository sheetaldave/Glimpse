import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsCounterDropdownComponent } from './contacts-counter-dropdown.component';

describe('ContactsCounterDropdownComponent', () => {
  let component: ContactsCounterDropdownComponent;
  let fixture: ComponentFixture<ContactsCounterDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsCounterDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsCounterDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
