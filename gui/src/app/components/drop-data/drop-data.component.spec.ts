import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDataComponent } from './drop-data.component';

describe('DropDataComponent', () => {
  let component: DropDataComponent;
  let fixture: ComponentFixture<DropDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
