import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'noumena-input',
  templateUrl: './sg-input.component.html',
  styleUrls: ['./sg-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NoumenaInputComponent),
      multi: true
    }
  ]
})
export class NoumenaInputComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  @ViewChild('input', { static: true }) inputRef: ElementRef;

  @Input() formControlName: string;
  @Input() errorMsg: string;
  @Input() label: string;
  @Input() readonly: boolean;
  @Input() type = 'text';

  private control: SgFormControl;
  private onTouchedCallback: () => void;
  private onChangeCallback: (_: any) => void;

  constructor(private readonly controlContainer: ControlContainer) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.control = this.controlContainer.control.get(this.formControlName) as SgFormControl;
  }

  onBlur(): void {
    this.onTouchedCallback();
  }

  onFocus(): void {
    // this.onTouchedCallback();
  }

  writeValue(value: string): void {
    this.inputRef.nativeElement.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  onChangeInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.value || this.control.value !== input.value) {
      this.control.markAsDirty();
      this.onChangeCallback(input.value);
    }
  }
}
