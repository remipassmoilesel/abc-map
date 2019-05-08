import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentListItemComponent } from './document-list-item.component';
import {AppComponent} from '../../app.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DocumentListItemComponent', () => {
  let component: DocumentListItemComponent;
  let fixture: ComponentFixture<DocumentListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppComponent, HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
