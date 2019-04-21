import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NewLayerDialogComponent} from './new-layer-dialog.component';
import {AppModule} from '../../app.module';

describe('NewLayerDialogComponent', () => {
  let component: NewLayerDialogComponent;
  let fixture: ComponentFixture<NewLayerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLayerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
