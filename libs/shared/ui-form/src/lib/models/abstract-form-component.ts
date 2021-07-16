import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RequestState } from './form.model';

@Directive()
export abstract class AbstractFormComponent<T> implements ControlValueAccessor, OnDestroy, OnInit {
  @Input() formControlName: string;
  @Input() formViewModel: T;

  @Input() set formRequestState(requestState: RequestState) {
    this._formRequestState = requestState;

    if (requestState === RequestState.SUCCESS) {
      this.writeValue(this.formViewModel);
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }

    this.requestState$.next(requestState);
  }
  get formRequestState(): RequestState {
    return this._formRequestState;
  }
  private _formRequestState: RequestState;

  @Output() submitted: EventEmitter<T> = new EventEmitter();

  form: FormGroup;
  requestState$ = new BehaviorSubject<RequestState>(RequestState.IDLE);

  protected readonly destroy$ = new Subject<void>();
  protected onChange: (value: T) => void;
  protected onTouched: () => void;

  get isSubmitDisabled(): boolean {
    return !this.form?.valid || this.form?.pristine;
  }

  protected abstract createForm(model?: T): FormGroup;

  protected getFormDefaultValue(model?: T): T {
    return model;
  }

  ngOnInit(): void {
    this.form = this.createForm(this.getFormDefaultValue(this.formViewModel));
    this.listenValueChanges();
  }

  protected listenValueChanges() {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.onChange(this.form.getRawValue());
    });
  }

  submit(): void {
    if (this.form.valid && this.form.dirty) {
      this.submitted.emit({
        ...this.formViewModel,
        ...this.form.value
      });
    }
  }

  cancel(): void {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.writeValue(this.formViewModel);
  }

  protected activatePreventLeaveConfirmation(): void {
    window.addEventListener('beforeunload', this.leaveConfirmation);
  }

  deactivatePreventLeaveConfirmation(): void {
    window.removeEventListener('beforeunload', this.leaveConfirmation);
  }

  private leaveConfirmation(event: Event): void {
    event.preventDefault();
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable({ emitEvent: false }) : this.form.enable({ emitEvent: false });
  }

  writeValue(model: T): void {
    const formValue = this.getFormDefaultValue(model);

    if (model) {
      this.form.patchValue(formValue);
    } else {
      this.form.reset(formValue || undefined);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
