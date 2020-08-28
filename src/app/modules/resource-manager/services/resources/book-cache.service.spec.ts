import { TestBed } from '@angular/core/testing';

import { BookCacheService } from './book-cache.service';

describe('BookCacheService', () => {
  let service: BookCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
