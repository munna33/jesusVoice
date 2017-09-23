import { TestBed, inject } from '@angular/core/testing';

import { GetEventServiceService } from './get-event-service.service';

describe('GetEventServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetEventServiceService]
    });
  });

  it('should be created', inject([GetEventServiceService], (service: GetEventServiceService) => {
    expect(service).toBeTruthy();
  }));
});
