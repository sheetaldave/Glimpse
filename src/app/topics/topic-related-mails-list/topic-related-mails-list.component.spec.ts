import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicRelatedMailsListComponent } from './topic-related-mails-list.component';

describe('TopicRelatedMailsListComponent', () => {
  let component: TopicRelatedMailsListComponent;
  let fixture: ComponentFixture<TopicRelatedMailsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicRelatedMailsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicRelatedMailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
