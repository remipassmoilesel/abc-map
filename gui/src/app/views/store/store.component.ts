import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../../lib/authentication/authentication.service';

@Component({
  selector: 'abc-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  searchForm?: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.initForm();
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
