import { TestBed, inject } from '@angular/core/testing';

import { MotionService } from './motion.service';

describe('MotionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotionService]
    });
  });

  it('should be created', inject([MotionService], (service: MotionService) => {
    expect(service).toBeTruthy();
  }));
});
