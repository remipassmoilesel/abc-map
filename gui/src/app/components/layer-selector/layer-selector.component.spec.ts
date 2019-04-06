import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerSelectorComponent } from './layer-selector.component';

describe('LayerSelectorComponent', () => {
  let component: LayerSelectorComponent;
  let fixture: ComponentFixture<LayerSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
