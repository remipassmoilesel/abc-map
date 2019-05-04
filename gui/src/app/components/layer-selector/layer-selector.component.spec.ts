import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LayerSelectorComponent} from './layer-selector.component';
import {AppModule} from '../../app.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('LayerSelectorComponent', () => {
  let component: LayerSelectorComponent;
  let fixture: ComponentFixture<LayerSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule]
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
