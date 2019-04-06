import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightMenuComponent } from './right-menu.component';

describe('RightMenuComponent', () => {
  let component: RightMenuComponent;
  let fixture: ComponentFixture<RightMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
