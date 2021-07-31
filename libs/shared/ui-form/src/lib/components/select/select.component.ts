import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '../../models/abstract-input-component';

@Component({
  selector: 'demo-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DemoSelectComponent),
      multi: true
    }
  ]
})
export class DemoSelectComponent extends AbstractInputComponent {
  @Input() items: { value: string; text?: string }[];

  value = '';

  writeValue(value: string): void {
    this.value = value;
  }

  updateModel(): void {
    this.onChange(this.value);
  }
}
