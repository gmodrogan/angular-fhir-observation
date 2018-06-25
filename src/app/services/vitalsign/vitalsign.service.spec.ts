import { TestBed, inject } from '@angular/core/testing';

import { VitalsignService } from './vitalsign.service';

describe('VitalsignService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VitalsignService]
    });
  });

  it('should be created', inject([VitalsignService], (service: VitalsignService) => {
    expect(service).toBeTruthy();
  }));
});
