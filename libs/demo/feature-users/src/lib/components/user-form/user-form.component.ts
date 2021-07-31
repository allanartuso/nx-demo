import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractFormComponent } from '@demo/shared/ui-form';
import { UserDto } from '../../models/user.dto';

@Component({
  selector: 'demo-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends AbstractFormComponent<UserDto> {
  constructor(private readonly formBuilder: FormBuilder) {
    super();
  }

  protected createForm(user: UserDto): FormGroup {
    return this.formBuilder.group({
      email: [user.email, [Validators.required, Validators.email]],
      firstName: [user.firstName],
      lastName: [user.lastName, [Validators.maxLength(40)]]
    });
  }

  protected getFormDefaultValue(user?: UserDto): UserDto {
    return {
      ...super.getFormDefaultValue(user),
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName
    };
  }
}
