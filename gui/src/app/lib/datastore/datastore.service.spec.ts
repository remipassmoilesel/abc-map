import { TestBed } from '@angular/core/testing';

import { DatastoreService } from './datastore.service';
import {AppModule} from '../../app.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DatastoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: DatastoreService = TestBed.get(DatastoreService);
    expect(service).toBeTruthy();
  });
});
