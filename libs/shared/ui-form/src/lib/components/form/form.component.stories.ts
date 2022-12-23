import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestState } from '@demo/shared/data-model/common';
import { ConfigurationService } from '@demo/shared/util-configuration';
import { DemoCancelButtonComponent } from '../cancel-button/cancel-button.component';
import { DemoInputComponent } from '../input/input.component';
import { DemoSubmitButtonComponent } from '../submit-button/submit-button.component';
import { DemoFormComponent } from './form.component';

export default {
  title: 'DemoFormComponent',
  parameters: { actions: { argTypesRegex: '^on.*' } },
  argTypes: {
    onSubmitted: { action: 'onSubmitted' },
    onCancelled: { action: 'onCancelled' },
    formRequestState: {
      control: {
        type: 'select',
        options: RequestState
      }
    }
  }
};

const template = (args: DemoFormComponent) => ({
  moduleMetadata: {
    imports: [BrowserAnimationsModule],
    declarations: [DemoFormComponent, DemoInputComponent, DemoCancelButtonComponent, DemoSubmitButtonComponent],
    providers: [
      {
        provide: ConfigurationService,
        useValue: {
          getConfiguration: () => ({
            i18n: {
              availableLanguages: ['en'],
              defaultLanguage: 'en',
              production: false
            }
          })
        }
      }
    ]
  },
  template: `
  <demo-form
    [formRequestState]="formRequestState"
    [isSubmitDisabled]="isSubmitDisabled"
    [isCancelDisabled]="isCancelDisabled"
    [canEdit]="canEdit"
    (submitted)="onSubmitted()"
    (cancelled)="onCancelled()"
  >
    <demo-input name="firstName" [readonly]="!canEdit" label="Fist name"></demo-input>
    <demo-input name="lastName" [readonly]="!canEdit" label="Last name"></demo-input>
  </demo-form>
  `,
  props: args
});

export const Form = template.bind({});
// Form.args = {
//   isSubmitDisabled: false,
//   isCancelDisabled: false,
//   canEdit: true,
//   formRequestState: RequestState.IDLE
// } as DemoFormComponent;

// export const FormSubmitDisabled = template.bind({});
// FormSubmitDisabled.args = {
//   ...Form.args,
//   isSubmitDisabled: true
// } as DemoFormComponent;

// export const FormCancelDisabled = template.bind({});
// FormCancelDisabled.args = {
//   ...Form.args,
//   isCancelDisabled: true
// } as DemoFormComponent;

// export const NotEditableForm = template.bind({});
// NotEditableForm.args = {
//   ...Form.args,
//   canEdit: false
// } as DemoFormComponent;
