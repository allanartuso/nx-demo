import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sg-select',
  templateUrl: './sg-select.component.html',
  styleUrls: ['./sg-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SgSelectComponent),
      multi: true
    }
  ]
})
export class SgSelectComponent implements ControlValueAccessor {
  @Input() formControlName: string;
  @Input() errorMsg: string;
  @Input() label: string;
  @Input() items: { value: string; text?: string }[];

  ngControl: NgControl;
  value = '';

  private onChangeCallback = (_: any) => {};

  private onTouchedCallback = () => {};

  onBlur(): void {
    this.onTouchedCallback();
  }

  onFocus(): void {
    this.onTouchedCallback();
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  updateModel() {
    this.onChangeCallback(this.value);
  }
}
