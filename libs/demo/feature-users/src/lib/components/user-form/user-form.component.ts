import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldErrors } from '@arviem/shared/acm/data-access/common';
import { Language, Theme, UserDto, UserSettingsDto } from '@arviem/shared/acm/data-access/users';
import { ArviemImageInputFormComponent, SelectionListItem } from '@arviem/shared/acm/ui/common/forms';
import {
  AbstractFormComponent,
  ArviemFormViewModel,
  phoneNumberValidator,
  trimValidator
} from '@arviem/shared/acm/util-form';
import { Image, RequestState } from '@arviem/shared/data-access';
import { DisplayDensity } from 'igniteui-angular';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserFormViewModel extends ArviemFormViewModel<UserDto> {
  avatarFormViewModel: ArviemFormViewModel<{ image: Image }>;
  displaySettingsFormViewModel: ArviemFormViewModel<UserSettingsDto>;
}

@Component({
  selector: 'arviem-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends AbstractFormComponent<UserDto> implements OnInit {
  @ViewChild('avatarUploadForm', { static: true })
  avatarUploadForm: ArviemImageInputFormComponent;

  @Input() avatarLoadingState: RequestState;
  @Input() avatarServerFieldErrors: FieldErrors;
  @Input() languageListItems: SelectionListItem[];
  @Input() displayDensityListItems: SelectionListItem[];
  @Input() themeListItems: SelectionListItem[];

  @Output() avatarSaved: EventEmitter<Image> = new EventEmitter();
  @Output() avatarDeleted: EventEmitter<string> = new EventEmitter();
  @Output() languageChanged: EventEmitter<Language> = new EventEmitter();
  @Output() displayDensityChanged: EventEmitter<DisplayDensity> = new EventEmitter();
  @Output() themeChanged: EventEmitter<Theme> = new EventEmitter();

  get userFormViewModel(): UserFormViewModel {
    return this.formViewModel as UserFormViewModel;
  }

  constructor(private readonly formBuilder: FormBuilder) {
    super();
  }

  protected createForm(user: UserDto & { avatar: { image: Image } }): FormGroup {
    return this.formBuilder.group({
      avatar: [user.avatar],
      email: [
        {
          value: user.email,
          disabled: true
        },
        [Validators.required, Validators.email]
      ],
      firstName: [user.firstName, [trimValidator()]],
      lastName: [user.lastName, [Validators.maxLength(40), trimValidator()]],
      jobTitle: [user.jobTitle, [Validators.maxLength(60), trimValidator()]],
      phoneNumber: [
        user.phoneNumber,
        {
          validators: [phoneNumberValidator()],
          updateOn: 'blur'
        }
      ],
      settings: [user.settings]
    });
  }

  protected getFormDefaultValue(user?: UserDto): UserDto & { avatar: { image: Image } } {
    return {
      ...super.getFormDefaultValue(user),
      avatar: this.userFormViewModel.avatarFormViewModel.form,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      jobTitle: user?.jobTitle,
      phoneNumber: user?.phoneNumber,
      settings: user?.settings
    };
  }

  save(): void {
    if (this.form.valid && this.formValuesChanged) {
      this.onAvatarSaved();

      const user = {
        ...this.formViewModel.form,
        ...this.form.value
      };
      delete user.avatar;

      this.submitted.emit(user);
    }
  }

  onAvatarSaved(): void {
    if (this.avatarUploadForm.form.valid && this.avatarUploadForm.formValuesChanged) {
      const avatar = this.form.value.avatar;
      const avatarViewModel = this.userFormViewModel.avatarFormViewModel.form.image;

      if (avatar.image) {
        this.avatarSaved.emit({ ...avatar.image });
      } else if (avatarViewModel?.resourceId) {
        this.avatarDeleted.emit(avatarViewModel.resourceId);
      }
    }
  }

  canDeactivate$(): Observable<boolean> {
    return combineLatest([super.canDeactivate$(), this.avatarUploadForm.canDeactivate$()]).pipe(
      map(canDeactivateAll => canDeactivateAll.every(canDeactivate => !!canDeactivate))
    );
  }

  onLanguageChanged(language: Language): void {
    this.languageChanged.emit(language);
  }

  onDisplayDensityChanged(displayDensity: DisplayDensity): void {
    this.displayDensityChanged.emit(displayDensity);
  }

  onThemeChanged(theme: Theme): void {
    this.themeChanged.emit(theme);
  }
}
