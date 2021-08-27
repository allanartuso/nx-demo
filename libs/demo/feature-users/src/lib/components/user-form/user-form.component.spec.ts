import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DemoInputComponent, FormControlInjectorDirective } from '@demo/shared/ui-form';
import { UserDto } from '../../models/user.dto';
import { createPersistentUser } from '../../models/user.dto.fixture';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let testUser: UserDto;
  const onChangeMock = jest.fn();
  const onTouchedMock = jest.fn();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, NoopAnimationsModule],
        declarations: [UserFormComponent, DemoInputComponent, FormControlInjectorDirective],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    testUser = createPersistentUser();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchedMock);
  });

  it('creates the form', () => {
    component.formViewModel = testUser;
    fixture.detectChanges();
    const expectedFormValue = { ...testUser };
    delete expectedFormValue.id;

    expect(component.form).toBeTruthy();
    expect(component.form.value).toStrictEqual(expectedFormValue);
  });

  it('creates an empty form when the form model is undefined', () => {
    fixture.detectChanges();
    const expectedFormValue: UserDto = { email: null, firstName: null, lastName: null };

    expect(component.form).toBeTruthy();
    expect(component.form.value).toStrictEqual(expectedFormValue);
  });
});
