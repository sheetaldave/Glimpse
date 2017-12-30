import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSideBarComponent } from './topic-side-bar.component';

describe('TopicSideBarComponent', () => {
  let component: TopicSideBarComponent;
  let fixture: ComponentFixture<TopicSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
