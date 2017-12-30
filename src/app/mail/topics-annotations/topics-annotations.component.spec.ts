import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsAnnotationsComponent } from './topics-annotations.component';

describe('TopicsAnnotationsComponent', () => {
  let component: TopicsAnnotationsComponent;
  let fixture: ComponentFixture<TopicsAnnotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsAnnotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
