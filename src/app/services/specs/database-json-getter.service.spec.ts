import { TestBed } from '@angular/core/testing';

import { DatabaseJsonGetterService } from './database-json-getter.service';

describe('DatabaseJsonGetterService', () => {
  let service: DatabaseJsonGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseJsonGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
