import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSidebarMailsContactsComponent } from './topic-sidebar-mails-contacts.component';

describe('TopicSidebarMailsContactsComponent', () => {
  let component: TopicSidebarMailsContactsComponent;
  let fixture: ComponentFixture<TopicSidebarMailsContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicSidebarMailsContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicSidebarMailsContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
