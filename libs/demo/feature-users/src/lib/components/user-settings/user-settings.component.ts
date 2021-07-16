import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Language, Theme, UserSettingsDto } from '@arviem/shared/acm/data-access/users';
import { SelectionListItem } from '@arviem/shared/acm/ui/common/forms';
import { AbstractFormComponent, createControlValueAccessorProviders } from '@arviem/shared/acm/util-form';
import { DisplayDensity } from 'igniteui-angular';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'arviem-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  providers: createControlValueAccessorProviders(UserSettingsComponent)
})
export class UserSettingsComponent extends AbstractFormComponent<UserSettingsDto> implements AfterViewInit {
  @Input('languageListItems') set setLanguageListItems(languageListItems: SelectionListItem[]) {
    this.languageListItems = languageListItems;
    this.updateTranslatedControl('language');
  }

  @Input('displayDensityListItems') set setDisplayDensityListItems(displayDensityListItems: SelectionListItem[]) {
    this.displayDensityListItems = displayDensityListItems;
    this.updateTranslatedControl('displayDensity');
  }

  @Input('themeListItems') set setThemeListItems(themeListItems: SelectionListItem[]) {
    this.themeListItems = themeListItems;
    this.updateTranslatedControl('theme');
  }

  languageListItems: SelectionListItem[];
  displayDensityListItems: SelectionListItem[];
  themeListItems: SelectionListItem[];

  @Output() languageChanged: EventEmitter<Language> = new EventEmitter();
  @Output() themeChanged: EventEmitter<Theme> = new EventEmitter();
  @Output() displayDensityChanged: EventEmitter<DisplayDensity> = new EventEmitter();

  constructor(private readonly formBuilder: FormBuilder) {
    super();
  }

  protected createForm(settings?: UserSettingsDto): FormGroup {
    return this.formBuilder.group({
      language: [settings?.language, [Validators.required]],
      displayDensity: [settings?.displayDensity, [Validators.required]],
      theme: [settings?.theme, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.initializeThemeChangeListeners();
  }

  private initializeThemeChangeListeners(): void {
    this.form
      .get('language')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        filter(value => !!value)
      )
      .subscribe(language => this.languageChanged.emit(language));
    this.form
      .get('displayDensity')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        filter(value => !!value)
      )
      .subscribe(displayDensity => this.displayDensityChanged.emit(displayDensity));
    this.form
      .get('theme')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        filter(value => !!value)
      )
      .subscribe(theme => this.themeChanged.emit(theme));
  }

  private updateTranslatedControl(controlName: string): void {
    if (this.form?.dirty) {
      const control = this.form.get(controlName);
      control.setValue(control.value, { emitEvent: false });
    }
  }
}
