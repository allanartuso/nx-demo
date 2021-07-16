import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Language, Theme, UserDto } from '@arviem/shared/acm/data-access/users';
import { userDtoFixture } from '@arviem/shared/acm/data-access/users/test';
import {
  ArviemComboBoxComponent,
  ArviemCountryContainsAutocompletePipe,
  ArviemImageInputComponent,
  ArviemImageInputFormComponent,
  ArviemInfoIconComponent,
  ArviemInputComponent,
  ArviemPhoneNumberInputComponent
} from '@arviem/shared/acm/ui/common/forms';
import { AbstractFormComponent, SharedAcmUtilFormModule } from '@arviem/shared/acm/util-form';
import { Image } from '@arviem/shared/data-access';
import { getI18nTestingModule } from '@arviem/shared/util-i18n/test';
import {
  DisplayDensity,
  IgxComboModule,
  IgxInputGroupModule,
  IgxSelectModule,
  IgxTooltipModule
} from 'igniteui-angular';
import { of } from 'rxjs';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { UserFormComponent, UserFormViewModel } from './user-form.component';

describe('UserProfileFormComponent', () => {
  let userForm: UserFormComponent;
  let userFormFixture: ComponentFixture<UserFormComponent>;
  let testUser: UserDto;
  const mockAvatarForm: Partial<ArviemImageInputFormComponent> = {
    save: jest.fn(),
    cancel: jest.fn(),
    deactivatePreventLeaveConfirmation: jest.fn()
  };

  const image: Image = {
    resourceId: '/image/resource/id',
    mediaType: 'testMediaType',
    stringData: 'testData'
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          FormsModule,
          NoopAnimationsModule,
          getI18nTestingModule(),
          SharedAcmUtilFormModule,
          IgxSelectModule,
          IgxTooltipModule,
          IgxComboModule,
          IgxInputGroupModule
        ],
        declarations: [
          UserFormComponent,
          ArviemCountryContainsAutocompletePipe,
          ArviemPhoneNumberInputComponent,
          ArviemInputComponent,
          ArviemInfoIconComponent,
          ArviemComboBoxComponent,
          ArviemImageInputFormComponent,
          ArviemImageInputComponent,
          UserSettingsComponent
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    testUser = userDtoFixture.createPersistentUser();

    userFormFixture = TestBed.createComponent(UserFormComponent);
    userForm = userFormFixture.componentInstance;
    userForm.translate = jest.fn();
    userForm.formViewModel = {
      form: testUser,
      avatarFormViewModel: { form: { image: undefined } },
      displaySettingsFormViewModel: { form: testUser.settings }
    } as UserFormViewModel;

    userFormFixture.detectChanges();
  });

  it('update the form when receiving the user data', () => {
    (userForm.formViewModel as UserFormViewModel).avatarFormViewModel.form.image = undefined;
    userFormFixture.detectChanges();
    const expectedFormValue = {
      avatar: { image: undefined },
      ...testUser
    };
    delete expectedFormValue.avatarReference;
    delete expectedFormValue.resourceId;
    delete expectedFormValue.version;
    delete expectedFormValue.email;

    expect(userForm.form.value).toStrictEqual(expectedFormValue);
  });

  it('emit an event when changing the theme', () => {
    const themeChanged = spyOn(userForm.themeChanged, 'emit');
    const expectedTheme = Theme.light;

    userForm.onThemeChanged(expectedTheme);

    expect(themeChanged).toHaveBeenCalledWith(expectedTheme);
  });

  it('emit an event when changing the display density', () => {
    const displayDensityChanged = spyOn(userForm.displayDensityChanged, 'emit');
    const expectedDisplayDensity = DisplayDensity.compact;

    userForm.onDisplayDensityChanged(expectedDisplayDensity);

    expect(displayDensityChanged).toHaveBeenCalledWith(expectedDisplayDensity);
  });

  it('emit an event when changing the language', () => {
    const languageChanged = spyOn(userForm.languageChanged, 'emit');
    const expectedLanguage = Language.english;

    userForm.onLanguageChanged(expectedLanguage);

    expect(languageChanged).toHaveBeenCalledWith(expectedLanguage);
  });

  it('save avatar and profile changes on save', () => {
    spyOn(userForm.avatarSaved, 'emit');
    spyOn(userForm.submitted, 'emit');
    const expectedUser = { ...testUser, ...userForm.form.value };
    delete expectedUser.avatar;
    const testAvatar = { image };
    const avatarControl = userForm.form.get('avatar');
    avatarControl.setValue(testAvatar);
    userForm.form.markAllAsTouched();
    userFormFixture.detectChanges();

    userForm.save();

    expect(userForm.avatarSaved.emit).toHaveBeenCalledWith(testAvatar.image);
    expect(userForm.submitted.emit).toHaveBeenCalledWith(expectedUser);
  });

  it('emits an event when deleting the avatar', () => {
    const avatarDeleted = spyOn(userForm.avatarDeleted, 'emit');
    userForm.userFormViewModel.avatarFormViewModel.form.image = image;
    userFormFixture.detectChanges();
    const avatarControl = userForm.form.get('avatar');
    avatarControl.setValue({ image: null });

    userForm.onAvatarSaved();

    expect(avatarDeleted).toHaveBeenCalledWith(image.resourceId);
  });

  it('check if avatar and user forms can be deactivated', done => {
    const canDeactivateAvatar = spyOn(userForm.avatarUploadForm, 'canDeactivate$').and.returnValue(of(true));
    const canDeactivateUser = spyOn(AbstractFormComponent.prototype, 'canDeactivate$').and.returnValue(of(true));

    userForm.canDeactivate$().subscribe(canDeactivate => {
      expect(canDeactivate).toBe(true);
      expect(canDeactivateAvatar).toHaveBeenCalledTimes(1);
      expect(canDeactivateUser).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('cannot deactivate the form if avatar or user forms cannot be deactivated', done => {
    spyOn(userForm.avatarUploadForm, 'canDeactivate$').and.returnValue(of(true));
    spyOn(AbstractFormComponent.prototype, 'canDeactivate$').and.returnValue(of(false));

    userForm.canDeactivate$().subscribe(canDeactivate => {
      expect(canDeactivate).toBe(false);
      done();
    });
  });
});
