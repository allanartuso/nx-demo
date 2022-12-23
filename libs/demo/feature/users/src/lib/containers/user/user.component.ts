import { Component } from '@angular/core';
import { userActions, userSelectors } from '@demo/demo/data-access/users';
import { UserDto } from '@demo/demo/data-model/users';
import { RequestState } from '@demo/shared/data-model';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  user$: Observable<UserDto> = this.store.pipe(select(userSelectors.getResource));
  requestState$: Observable<RequestState> = this.store.pipe(select(userSelectors.getRequestState));

  constructor(private readonly store: Store) {}

  onUserSaved(user: UserDto): void {
    if (user.id) {
      this.store.dispatch(userActions.save({ resource: user }));
    } else {
      this.store.dispatch(userActions.create({ resource: user }));
    }
  }
}
