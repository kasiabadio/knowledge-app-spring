import { TestBed } from '@angular/core/testing';

import { CategoryknowledgegroupService } from './categoryknowledgegroup.service';

describe('CategoryknowledgegroupService', () => {
  let service: CategoryknowledgegroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryknowledgegroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
