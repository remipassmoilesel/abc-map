import { TestBed } from '@angular/core/testing';

import { RoutingService } from './routing.service';

describe('RoutingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutingService = TestBed.get(RoutingService);
    expect(service).toBeTruthy();
  });
});
