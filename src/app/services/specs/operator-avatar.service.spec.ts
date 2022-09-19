import { TestBed } from '@angular/core/testing';

import { OperatorAvatarService } from './operator-avatar.service';

describe('OperatorAvatarService', () => {
  let service: OperatorAvatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperatorAvatarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
