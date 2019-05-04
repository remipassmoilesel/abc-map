import { TestBed } from '@angular/core/testing';

import { RoutingService } from './routing.service';
import {AppModule} from '../../app.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('RoutingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: RoutingService = TestBed.get(RoutingService);
    expect(service).toBeTruthy();
  });
});
