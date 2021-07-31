import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Language, Theme } from '@demo/shared/acm/data-access/users';
import {
    DemoComboBoxComponent,
    DemoInfoIconComponent,
    DemoInputComponent
} from '@demo/shared/acm/ui/common/forms';
import { SharedAcmUtilFormModule } from '@demo/shared/acm/util-form';
import { getI18nTestingModule } from '@demo/shared/util-i18n/test';
import { DisplayDensity, IgxComboModule, IgxSelectModule, IgxTooltipModule } from 'igniteui-angular';
import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        getI18nTestingModule(),
        SharedAcmUtilFormModule,
        IgxSelectModule,
        IgxTooltipModule,
        IgxComboModule
      ],
      declarations: [UserSettingsComponent, DemoInputComponent, DemoInfoIconComponent, DemoComboBoxComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    component.translate = jest.fn();
    component.formViewModel = { form: undefined };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emit an event when changing the language', () => {
    const themeChanged = spyOn(component.themeChanged, 'emit');
    const expectedTheme = Theme.light;
    const control = component.form.get('theme');

    control.setValue(expectedTheme);

    expect(themeChanged).toHaveBeenCalledWith(expectedTheme);
  });

  it('emit an event when changing the display density', () => {
    const displayDensityChanged = spyOn(component.displayDensityChanged, 'emit');
    const expectedDisplayDensity = DisplayDensity.compact;
    const control = component.form.get('displayDensity');

    control.setValue(expectedDisplayDensity);

    expect(displayDensityChanged).toHaveBeenCalledWith(expectedDisplayDensity);
  });

  it('emit an event when changing the language', () => {
    const languageChanged = spyOn(component.languageChanged, 'emit');
    const expectedLanguage = Language.english;
    const control = component.form.get('language');

    control.setValue(expectedLanguage);

    expect(languageChanged).toHaveBeenCalledWith(expectedLanguage);
  });

  it('resets control value when receiving new list items', () => {
    const control = component.form.get('theme');
    control.setValue(Theme.dark);
    component.form.markAsDirty();
    spyOn(control, 'setValue');

    component.setThemeListItems = [
      { text: 'Claro', value: Theme.light },
      { text: 'Oscuro', value: Theme.dark }
    ];

    expect(control.setValue).toHaveBeenCalledWith(control.value, { emitEvent: false });
  });
});
