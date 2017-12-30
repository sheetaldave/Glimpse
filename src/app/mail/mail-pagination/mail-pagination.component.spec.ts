import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailPaginationComponent } from './mail-pagination.component';

describe('MailPaginationComponent', () => {
  let component: MailPaginationComponent;
  let fixture: ComponentFixture<MailPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
