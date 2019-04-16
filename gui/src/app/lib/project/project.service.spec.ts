import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';
import {AppModule} from '../../app.module';

describe('ProjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule]
  }));

  it('should be created', () => {
    const service: ProjectService = TestBed.get(ProjectService);
    expect(service).toBeTruthy();
  });
});
