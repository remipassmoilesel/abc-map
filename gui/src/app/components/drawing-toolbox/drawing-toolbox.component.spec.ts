import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DrawingToolboxComponent} from './drawing-toolbox.component';
import {AppModule} from '../../app.module';

describe('DrawingToolboxComponent', () => {
  let component: DrawingToolboxComponent;
  let fixture: ComponentFixture<DrawingToolboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingToolboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
