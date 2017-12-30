import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailKnowledgeComponent } from './mail-knowledge.component';

describe('MailKnowledgeComponent', () => {
  let component: MailKnowledgeComponent;
  let fixture: ComponentFixture<MailKnowledgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailKnowledgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailKnowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
