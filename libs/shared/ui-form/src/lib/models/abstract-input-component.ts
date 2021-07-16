import { AfterViewInit, Directive, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NoumenaFormControl } from './form.model';

@Directive()
export abstract class AbstractInputComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  @Input() formControlName: string;
  @Input() errorMessage: string;
  @Input() label: string;
  @Input() readonly: boolean;
  @Input() required: boolean;

  protected control: NoumenaFormControl;
  protected onChange: (value: string) => void;
  protected onTouched: () => void;
  protected readonly destroy$ = new Subject<void>();

  constructor(private readonly controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.control = this.controlContainer.control.get(this.formControlName) as NoumenaFormControl;
    this.setRequiredState();
  }

  ngAfterViewInit(): void {
    this.initializeErrorListener();
  }

  private setRequiredState(): void {
    if (!this.control || !this.control.validator) {
      return;
    }

    const validators = this.control.validator({ value: '' } as AbstractControl);
    if (validators && Object.keys(validators).includes('required')) {
      this.required = true;
    }
  }

  private initializeErrorListener(): void {
    this.control?.errorMessage$.pipe(takeUntil(this.destroy$)).subscribe(errorMessage => {
      this.errorMessage = errorMessage;
    });
  }

  onBlur(): void {
    this.onTouched();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  abstract writeValue(value: unknown): void;
}
