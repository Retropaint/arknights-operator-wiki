import { TestBed } from '@angular/core/testing';

import { TooltipTextService } from '../tooltip-text.service';

describe('TooltipTextService', () => {
  let service: TooltipTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TooltipTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
