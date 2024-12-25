import { TestBed } from '@angular/core/testing';

import { CategoryKnowledgeGroupService } from './categoryknowledgegroup.service';

describe('CategoryKnowledgeGroupService', () => {
  let service: CategoryKnowledgeGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryKnowledgeGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
