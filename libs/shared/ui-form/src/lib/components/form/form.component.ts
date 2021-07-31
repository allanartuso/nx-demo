import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RequestState } from '@demo/shared/data-access';

@Component({
  selector: 'demo-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class DemoFormComponent {
  @Input() isSubmitDisabled: boolean;
  @Input() isCancelDisabled: boolean;
  @Input() canEdit = true;
  @Input() formRequestState: RequestState | RequestState[] = RequestState.IDLE;

  @Output() submitted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onSubmit(): void {
    if (!this.isSubmitDisabled) {
      this.submitted.emit();
    }
  }

  onCancel(): void {
    if (!this.isCancelDisabled) {
      this.cancelled.emit();
    }
  }
}
