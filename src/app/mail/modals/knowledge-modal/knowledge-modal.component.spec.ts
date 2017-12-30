import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeModalComponent } from './knowledge-modal.component';

describe('KnowledgeModalComponent', () => {
  let component: KnowledgeModalComponent;
  let fixture: ComponentFixture<KnowledgeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
