import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '../../models/abstract-input-component';

@Component({
  selector: 'noumena-input',
  templateUrl: './noumena-input.component.html',
  styleUrls: ['./noumena-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NoumenaInputComponent),
      multi: true
    }
  ]
})
export class NoumenaInputComponent extends AbstractInputComponent {
  @ViewChild('input', { static: true }) inputRef: ElementRef;

  @Input() type = 'text';

  writeValue(value: string): void {
    this.inputRef.nativeElement.value = value;
  }

  onChangeInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.value || this.control.value !== input.value) {
      this.onChange(input.value);
    }
  }
}
