import { TestBed } from '@angular/core/testing';

import { OperatorTransitionerService } from './operator-transitioner.service';

describe('OperatorTransitionerService', () => {
  let service: OperatorTransitionerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperatorTransitionerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
