import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import {AppModule} from '../../app.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AuthenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });
});
