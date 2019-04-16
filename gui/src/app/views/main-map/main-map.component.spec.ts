import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainMapComponent} from './main-map.component';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../../store';
import {AppModule} from '../../app.module';

describe('MainMapComponent', () => {
  let component: MainMapComponent;
  let fixture: ComponentFixture<MainMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
