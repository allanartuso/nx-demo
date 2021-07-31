import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

export interface DemoFormControl extends AbstractControl {
  errorMessage$: Observable<string>;
}

export enum RequestState {
  IDLE = 'IDLE',
  IN_PROGRESS = 'IN_PROGRESS',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS'
}
