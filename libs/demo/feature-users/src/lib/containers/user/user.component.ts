import { Component } from '@angular/core';
import { RequestState } from '@demo/shared/data-access';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { formActions } from '../../+state/user/user.actions';
import { formSelectors } from '../../+state/user/user.selectors';
import { UserDto } from '../../models/user.dto';

@Component({
  selector: 'demo-user',
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
