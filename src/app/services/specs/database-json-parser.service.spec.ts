import { TestBed } from '@angular/core/testing';

import { DatabaseJsonParserService } from './database-json-parser.service';

describe('DatabaseJsonParserService', () => {
  let service: DatabaseJsonParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseJsonParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
