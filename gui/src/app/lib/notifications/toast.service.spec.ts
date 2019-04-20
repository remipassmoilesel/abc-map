import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import {AppModule} from '../../app.module';

describe('ToastService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule]
  }));

  it('should be created', () => {
    const service: ToastService = TestBed.get(ToastService);
    expect(service).toBeTruthy();
  });
});
