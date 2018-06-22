/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MainDataService } from './main-data.service';

describe('Service: MainData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainDataService]
    });
  });

  it('should ...', inject([MainDataService], (service: MainDataService) => {
    expect(service).toBeTruthy();
  }));
});
