import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { getErrorMessage } from './error-messages';
import { DemoFormControl } from './models/form.model';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[formControlName]'
})
export class FormControlInjectorDirective implements OnInit, AfterViewInit {
  @Input() label!: string;
  private readonly destroy$ = new Subject<void>();
  private control!: DemoFormControl;
  private errorMessage$ = new Subject<string>();

  constructor(private readonly el: ElementRef, private readonly formControlName: FormControlName) {}

  ngOnInit(): void {
    const control = this.formControlName.control as unknown as DemoFormControl;
    control.errorMessage$ = this.errorMessage$ as Observable<string>;
    this.control = control;
    this.isInvalidField();
  }

  ngAfterViewInit(): void {
    this.addFormControlListeners();
  }

  private addFormControlListeners(): void {
    let blurEvents$: Observable<unknown> = fromEvent(this.el.nativeElement, 'blur');
    if (this.el.nativeElement.localName !== 'input') {
      const inputElement = this.el.nativeElement.querySelector('input');
      blurEvents$ = inputElement ? fromEvent(inputElement, 'blur') : blurEvents$;
    }

    merge(this.control.statusChanges, blurEvents$?.pipe(tap(() => this.removeEmptyStrings())))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isInvalidField();
      });
  }

  private removeEmptyStrings(): void {
    const value = this.control.value;
    let transformedValue = value;
    if (typeof value === 'string' && value !== value.trim()) {
      transformedValue = value.trim();
    }

    if (value === '') {
      transformedValue = null;
    }

    if (transformedValue !== value) {
      this.control.setValue(transformedValue);
    }
  }

  private isInvalidField(): void {
    if (this.control.errors?.serverError) {
      return;
    }

    let secondCondition: boolean;
    switch (this.control.updateOn) {
      case 'change':
        secondCondition = this.control.touched || this.control.dirty;
        break;
      case 'blur':
        secondCondition = this.control.touched;
        break;
      case 'submit':
        secondCondition = false;
        break;
    }

    let errorMessage = '';
    if (this.control.errors && secondCondition) {
      errorMessage = this.getErrorMessageText();
    }

    this.errorMessage$.next(errorMessage);
  }

  private getErrorMessageText(): string {
    const errorKey = Object.keys(this.control.errors)[0];
    const errorObj = this.control.errors[`${errorKey}`];

    return getErrorMessage(errorKey, {
      fieldName: this.label,
      ...errorObj
    });
  }
}
