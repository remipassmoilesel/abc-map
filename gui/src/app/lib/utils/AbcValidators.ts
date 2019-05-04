import {Validators} from '@angular/forms';

export class AbcValidators {

  public static readonly PASSWORD = Validators.compose([
    Validators.required,
    Validators.minLength(6),
  ]);

  public static readonly USERNAME = Validators.compose([
    Validators.required,
    Validators.minLength(6),
  ]);

  public static readonly EMAIL = Validators.compose([
    Validators.required,
    Validators.email,
  ]);

  public static readonly FIRST_NAME = Validators.compose([
    Validators.required,
    Validators.minLength(2),
  ]);

  public static readonly LAST_NAME = Validators.compose([
    Validators.required,
    Validators.minLength(2),
  ]);

  public static readonly PHONE_NUMBER = Validators.compose([
    Validators.required,
    Validators.pattern('^\\+?[0-9]{8,12}$'),
  ]);

  public static readonly REQUIRED = Validators.required;

  public static readonly UNIT_ID = Validators.compose([
    Validators.required,
    Validators.pattern('^\\+?[a-zA-Z0-9-]{6,25}$'),
  ]);

}
