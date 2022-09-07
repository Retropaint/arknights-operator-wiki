import { TestBed } from '@angular/core/testing';

import { ManualJsonParserService } from '../manual-json-parser.service';

describe('ManualParserService', () => {
  let service: ManualJsonParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManualJsonParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
