import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingToolboxComponent } from './drawing-toolbox.component';

describe('DrawingToolboxComponent', () => {
  let component: DrawingToolboxComponent;
  let fixture: ComponentFixture<DrawingToolboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingToolboxComponent ]
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
