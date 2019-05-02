import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../../lib/authentication/authentication.service';
import {AbcValidators} from '../../lib/utils/AbcValidators';
import {ILoginRequest} from 'abcmap-shared';

@Component({
  selector: 'abc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginForm?: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authentication: AuthenticationService) {
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', AbcValidators.USERNAME],
      password: ['', AbcValidators.PASSWORD],
    });
  }

  login() {
    if (!this.loginForm) {
      return;
    }

    const formValue: ILoginRequest = this.loginForm.value;

    this.authentication.login(formValue).subscribe();

  }
}
