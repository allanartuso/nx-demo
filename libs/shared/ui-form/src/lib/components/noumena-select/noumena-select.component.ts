import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '../../models/abstract-input-component';

@Component({
  selector: 'noumena-select',
  templateUrl: './noumena-select.component.html',
  styleUrls: ['./noumena-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NoumenaSelectComponent),
      multi: true
    }
  ]
})
export class NoumenaSelectComponent extends AbstractInputComponent {
  @Input() items: { value: string; text?: string }[];

  value = '';

  writeValue(value: string): void {
    this.value = value;
  }

  updateModel(): void {
    this.onChange(this.value);
  }
}
