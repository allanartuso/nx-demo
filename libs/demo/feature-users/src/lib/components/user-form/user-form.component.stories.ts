import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Language, Theme, UserDto } from '@arviem/shared/acm/data-access/users';
import { avatarDtoFixture, userDtoFixture } from '@arviem/shared/acm/data-access/users/test';
import { SelectionListItem, SharedAcmUiCommonFormsModule } from '@arviem/shared/acm/ui/common/forms';
import { SharedAcmUiCommonVendorsFontawesomeModule } from '@arviem/shared/acm/ui/common/vendors/fontawesome';
import { SharedAcmUiCommonVendorsIgniteuiModule } from '@arviem/shared/acm/ui/common/vendors/igniteui';
import { Image, RequestState } from '@arviem/shared/data-access';
import 'hammerjs';
import { DisplayDensity } from 'igniteui-angular';
import { MockI18nModule, ninjaStringData } from '../../../../.storybook/fixtures/users.fixture';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { UserFormComponent } from './user-form.component';
import { translate } from './user-form.component.fixture';

export default {
  title: 'UserFormComponent',
  component: UserFormComponent,
  argTypes: {
    onSubmitted: { action: 'onSubmitted' },
    onLanguageChanged: { action: 'onLanguageChanged' },
    onThemeChanged: { action: 'onThemeChanged' },
    onDisplayDensityChanged: { action: 'onDisplayDensityChanged' },
    onAvatarDeleted: { action: 'onAvatarDeleted' },
    onAvatarSaved: { action: 'onAvatarSaved' },
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
    imports: [
      BrowserAnimationsModule,
      ReactiveFormsModule,
      SharedAcmUiCommonFormsModule,
      SharedAcmUiCommonVendorsFontawesomeModule,
      SharedAcmUiCommonVendorsIgniteuiModule,
      MockI18nModule
    ],
    declarations: [UserFormComponent, UserSettingsComponent]
  },
  template: `
      <arviem-user-form
        [translate]="translate"
        [formViewModel]="formViewModel"
        [canEdit]="canEdit"
        [serverFieldErrors]="serverFieldErrors"
        [formRequestState]="formRequestState"

        [avatar]="avatar"
        [avatarRequestState]="avatarRequestState"
        [avatarLoadingState]="avatarLoadingState"
        [avatarServerFieldErrors]="avatarServerFieldErrors"
        (avatarSaved)="onAvatarSaved($event)"
        (avatarDeleted)="onAvatarDeleted($event)"

        [languageListItems]="languageListItems"
        [displayDensityListItems]="displayDensityListItems"
        [themeListItems]="themeListItems"

        (displayDensityChanged)="onDisplayDensityChanged($event)"
        (themeChanged)="onThemeChanged($event)"
        (languageChanged)="onLanguageChanged($event)"
        (submitted)="onSubmitted($event)"
      ></arviem-user-form>
  `,
  props: args
});

const user: UserDto = userDtoFixture.createPersistentUser();
const languageListItems: SelectionListItem[] = [
  {
    value: Language.english,
    text: 'English'
  },
  {
    value: Language.spanish,
    text: 'Spanish'
  }
];
const displayDensityListItems: SelectionListItem[] = [
  {
    value: DisplayDensity.compact,
    text: 'Compact'
  },
  {
    value: DisplayDensity.cosy,
    text: 'Regular'
  },
  {
    value: DisplayDensity.comfortable,
    text: 'Spacious'
  }
];
const themeListItems: SelectionListItem[] = [
  {
    value: Theme.light,
    text: 'Light'
  },
  {
    value: Theme.dark,
    text: 'Dark'
  }
];

const formRequestState = RequestState.IDLE;

const avatar: Image = avatarDtoFixture.createAvatarImage();
avatar.stringData = ninjaStringData;

const avatarRequestState = RequestState.IDLE;
const avatarLoadingState = RequestState.IDLE;

export const InitializedUserForm = template.bind({});
InitializedUserForm.args = {
  translate: translate,
  formViewModel: { form: user },
  languageListItems,
  displayDensityListItems,
  themeListItems,
  canEdit: true,
  formRequestState,
  avatar: { form: avatar },
  avatarLoadingState,
  avatarRequestState
} as Partial<UserFormComponent>;

export const NotEditableUserForm = template.bind({});
NotEditableUserForm.args = {
  ...InitializedUserForm.args,
  canEdit: false
} as Partial<UserFormComponent>;
