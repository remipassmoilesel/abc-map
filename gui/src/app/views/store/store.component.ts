import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatastoreService} from '../../lib/datastore/datastore.service';
import {IDocument} from 'abcmap-shared';

@Component({
  selector: 'abc-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  searchForm?: FormGroup;
  items: IDocument[] = [];

  constructor(private formBuilder: FormBuilder,
              private datastore: DatastoreService) {
  }

  ngOnInit() {
    this.initForm();
    this.initList();
  }

  private initForm() {
    this.searchForm = this.formBuilder.group({
      query: [''],
    });
  }

  private initList() {
    this.datastore.listMyDocuments()
      .subscribe(res => this.items = res);
  }

  register() {
    if (!this.searchForm) {
      return;
    }

    // TODO
  }

  search() {
    // TODO
  }

}
