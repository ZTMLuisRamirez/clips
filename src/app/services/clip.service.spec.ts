import { TestBed } from '@angular/core/testing';

import { ClipService } from './clip.service';

describe('ClipService', () => {
  let service: ClipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
