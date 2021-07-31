import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

export interface DemoFormControl extends AbstractControl {
  errorMessage$: Observable<string>;
}
