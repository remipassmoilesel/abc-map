import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../../lib/authentication/authentication.service';
import {DatastoreService} from '../../lib/datastore/datastore.service';

@Component({
  selector: 'abc-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  searchForm?: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private datastore: DatastoreService) {
  }

  ngOnInit() {
    this.initForm();
    this.datastore.listDocuments().subscribe(res => console.log(res));
  }

  private initForm() {
    this.searchForm = this.formBuilder.group({
      query: [''],
    });
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
