import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestState } from '@demo/shared/ui-form';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { UserFormComponent } from './user-form.component';

export default {
  title: 'UserFormComponent',
  component: UserFormComponent,
  argTypes: {
    onSubmitted: { action: 'onSubmitted' },
    initialFormModel: { control: { type: 'object' } },
    formRequestState: {
      control: {
        type: 'select',
        options: RequestState
      }
    }
  }
};

const template = (args: UserFormComponent) => ({
  moduleMetadata: {
    imports: [BrowserAnimationsModule, ReactiveFormsModule],
    declarations: [UserFormComponent, UserSettingsComponent]
  },
  template: `
      <demo-user-form
        [formViewModel]="formViewModel"
        [formRequestState]="formRequestState"
        (submitted)="onSubmitted($event)"
      ></demo-user-form>
  `,
  props: args
});

export const InitializedUserForm = template.bind({});
InitializedUserForm.args = {
  formViewModel: { form: user },
  formRequestState
} as Partial<UserFormComponent>;
