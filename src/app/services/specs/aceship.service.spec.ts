import { TestBed } from '@angular/core/testing';

import { AceshipService } from './aceship.service';

describe('AceshipService', () => {
  let service: AceshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AceshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
