import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AbcValidators} from '../../lib/utils/AbcValidators';
import {AuthenticationService} from '../../lib/authentication/authentication.service';
import {IUserCreationRequest} from 'abcmap-shared';

@Component({
  selector: 'abc-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private registerForm?: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authentication: AuthenticationService) {
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', AbcValidators.USERNAME],
      email: ['', AbcValidators.EMAIL],
      password: ['', AbcValidators.PASSWORD],
    });
  }

  register() {
    if (!this.registerForm) {
      return;
    }

    const formValue: IUserCreationRequest = this.registerForm.value;

    this.authentication.registerUser(formValue).subscribe();

  }
}
