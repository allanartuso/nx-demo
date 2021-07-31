import { Component, Input } from '@angular/core';
import { RequestState } from '@demo/shared/data-access';

@Component({
  selector: 'demo-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss']
})
export class DemoSubmitButtonComponent {
  state: RequestState;

  @Input() disabled = false;
  @Input() type = 'submit';
  @Input() text = 'Save';
  @Input() retryText = 'Retry';

  @Input() set requestState(state: RequestState | RequestState[]) {
    if (state instanceof Array) {
      this.state = this.setRequestStateFromArray(state);
    } else {
      this.state = state;
    }

    if (this.isSuccess) {
      setTimeout(() => {
        this.state = RequestState.IDLE;
      }, 1000);
    }
  }

  get isIdle() {
    return this.state === RequestState.IDLE;
  }

  get isFailure() {
    return this.state === RequestState.FAILURE;
  }

  get isSuccess() {
    return this.state === RequestState.SUCCESS;
  }

  get isInProgress() {
    return this.state === RequestState.IN_PROGRESS;
  }

  private setRequestStateFromArray(states: RequestState[]) {
    if (states.includes(RequestState.IN_PROGRESS)) {
      return RequestState.IN_PROGRESS;
    }

    if (states.includes(RequestState.FAILURE)) {
      return RequestState.FAILURE;
    }

    if (states.includes(RequestState.SUCCESS)) {
      return RequestState.SUCCESS;
    }

    return RequestState.IDLE;
  }
}
