import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestState } from '@demo/shared/data-access';
import { cold } from '@nrwl/angular/testing';
import { AbstractFormComponent } from './abstract-form-component';

interface TestFormModel {
  name: string;
  jobTitle?: string;
  address: { city: string };
}

@Component({
  template: `
    <form [formGroup]="form">
      <input formControlName="name" label="Name" />
      <input formControlName="jobTitle" label="Job title" />
      <div formGroupName="address">
        <input formControlName="city" label="City" />
      </div>
    </form>
  `
})
class MockFormComponent extends AbstractFormComponent<TestFormModel> {
  i18nScope = 'testI18nScope';

  constructor(private readonly fb: FormBuilder) {
    super();
  }

  createForm(model: TestFormModel) {
    return this.fb.group({
      name: [model.name, [Validators.required, Validators.minLength(3)]],
      jobTitle: [model.jobTitle],
      address: this.fb.group({
        city: [
          model.address.city,
          {
            validators: [Validators.required],
            updateOn: 'blur'
          }
        ]
      })
    });
  }
}

describe('AbstractFormComponent', () => {
  let component: MockFormComponent;
  let fixture: ComponentFixture<MockFormComponent>;
  let testFormValues: TestFormModel;
  const onChangeMock = jest.fn();
  const onTouchedMock = jest.fn();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [MockFormComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    component = fixture.componentInstance;

    testFormValues = {
      name: 'testName',
      jobTitle: '',
      address: { city: 'testCity' }
    };
    component.formViewModel = testFormValues;
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchedMock);

    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('creates the form', () => {
      expect(component.form).toBeDefined();
      expect(component.form.value).toStrictEqual(testFormValues);
    });
  });

  describe('formRequestState', () => {
    it('updates form values when receiving success', () => {
      const newFormValues = { ...testFormValues, name: 'newTestName' };
      component.formViewModel = newFormValues;

      component.formRequestState = RequestState.SUCCESS;

      expect(component.form.value).toStrictEqual(newFormValues);
    });

    it('emits new value to the request state observable', () => {
      const requestState = RequestState.SUCCESS;
      component.formRequestState = requestState;
      const expected = cold('a', { a: requestState });

      expect(component.requestState$).toBeObservable(expected);
    });
  });

  describe('submit', () => {
    it('emit form submitted event when submitting a valid form.', () => {
      jest.spyOn(component.submitted, 'emit');
      const formValues = { ...testFormValues, name: 'newTestName' };
      component.form.patchValue(formValues);
      component.form.markAsDirty();

      component.submit();

      expect(component.submitted.emit).toHaveBeenCalledWith(formValues);
    });

    it('disable submit button if the form is invalid', () => {
      expect(component.isSubmitDisabled).toBe(true);
    });

    it('disable submit button if the form was not modified by the user', () => {
      component.form.patchValue(testFormValues);

      expect(component.isSubmitDisabled).toBe(true);
    });

    it('submit is enable when receiving a request state failure', () => {
      component.form.patchValue({ ...testFormValues, name: 'newTestName' });
      component.form.markAsDirty();

      component.formRequestState = RequestState.FAILURE;

      expect(component.isSubmitDisabled).toBe(false);
    });
  });

  describe('cancel', () => {
    it('path the received form model values to the form when cancel the current changes', () => {
      component.formViewModel = testFormValues;
      component.form.get('name').setValue('newTestValue');
      expect(component.form.value.name).not.toBe(testFormValues.name);

      component.cancel();

      expect(component.form.value).toStrictEqual(testFormValues);
      expect(component.form.pristine).toBe(true);
      expect(component.form.untouched).toBe(true);
    });
  });

  it('disables the control', () => {
    component.setDisabledState(true);

    expect(component.form.disabled).toBe(true);
  });

  it('enables the control', () => {
    component.setDisabledState(false);

    expect(component.form.enabled).toBe(true);
  });

  it('writes value to the form', () => {
    const newFormValues = {
      ...testFormValues,
      name: 'newTestName'
    };

    component.writeValue(newFormValues);

    expect(component.form.value).toStrictEqual(newFormValues);
  });

  it('resets the form when writing an undefined value', () => {
    jest.spyOn(component.form, 'reset');

    component.writeValue(undefined);

    expect(component.form.reset).toHaveBeenCalled();
  });
});
