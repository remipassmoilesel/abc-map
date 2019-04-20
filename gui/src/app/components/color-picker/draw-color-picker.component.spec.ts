import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DrawColorPickerComponent} from './draw-color-picker.component';
import {AppModule} from '../../app.module';

describe('DrawColorPickerComponent', () => {
  let component: DrawColorPickerComponent;
  let fixture: ComponentFixture<DrawColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
