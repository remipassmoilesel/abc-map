import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentListItemComponent} from './document-list-item.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppModule} from '../../app.module';

describe('DocumentListItemComponent', () => {
  let component: DocumentListItemComponent;
  let fixture: ComponentFixture<DocumentListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule]
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
