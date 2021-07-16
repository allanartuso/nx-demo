import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RequestState } from '@noumena/shared/ui-form';
import { Observable } from 'rxjs';
import { formActions } from '../../+state/user/user.actions';
import { formSelectors } from '../../+state/user/user.selectors';
import { UserDto } from '../../models/user.dto';

@Component({
  selector: 'noumena-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  user$: Observable<UserDto> = this.store.pipe(select(formSelectors.getResource));

  requestState$: Observable<RequestState> = this.store.pipe(select(formSelectors.getRequestState));

  constructor(private readonly store: Store) {}

  onUserSaved(user: UserDto): void {
    this.store.dispatch(formActions.save({ resource: user }));
  }
}
