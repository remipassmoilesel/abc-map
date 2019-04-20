import { TestBed } from '@angular/core/testing';

import { MapService } from './map.service';
import {AppModule} from '../../app.module';

describe('MapService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule]
  }));

  it('should be created', () => {
    const service: MapService = TestBed.get(MapService);
    expect(service).toBeTruthy();
  });
});
