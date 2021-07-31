import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedAcmUiCommonVendorsFontawesomeModule } from '@demo/shared/acm/ui/common/vendors/fontawesome';
import { SharedAcmUiCommonVendorsIgniteuiModule } from '@demo/shared/acm/ui/common/vendors/igniteui';
import { SharedAcmUtilFormModule } from '@demo/shared/acm/util-form';
import { RequestState } from '@demo/shared/data-access';
import { ConfigurationService } from '@demo/shared/util-configuration';
import { SharedUtilI18nModule } from '@demo/shared/util-i18n';
import { DemoCancelButtonComponent } from '../demo-cancel-button/demo-cancel-button.component';
import { DemoInputComponent } from '../demo-input/demo-input.component';
import { DemoSubmitButtonComponent } from '../demo-submit-button/demo-submit-button.component';
import { DemoFormComponent } from './demo-form.component';

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
    imports: [
      BrowserAnimationsModule,
      SharedAcmUiCommonVendorsIgniteuiModule,
      SharedAcmUtilFormModule,
      SharedUtilI18nModule,
      SharedAcmUiCommonVendorsFontawesomeModule
    ],
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
Form.args = {
  isSubmitDisabled: false,
  isCancelDisabled: false,
  canEdit: true,
  formRequestState: RequestState.IDLE
} as DemoFormComponent;

export const FormSubmitDisabled = template.bind({});
FormSubmitDisabled.args = {
  ...Form.args,
  isSubmitDisabled: true
} as DemoFormComponent;

export const FormCancelDisabled = template.bind({});
FormCancelDisabled.args = {
  ...Form.args,
  isCancelDisabled: true
} as DemoFormComponent;

export const NotEditableForm = template.bind({});
NotEditableForm.args = {
  ...Form.args,
  canEdit: false
} as DemoFormComponent;
