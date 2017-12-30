import { TestBed, inject } from '@angular/core/testing';

import { KnowledgeGraphService } from './knowledge-graph.service';

describe('KnowledgeGraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KnowledgeGraphService]
    });
  });

  it('should be created', inject([KnowledgeGraphService], (service: KnowledgeGraphService) => {
    expect(service).toBeTruthy();
  }));
});
