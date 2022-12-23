import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { userActions, userSelectors } from '@demo/demo/data-access/users';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<boolean> {
  constructor(private readonly store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params['id'];

    this.store.dispatch(userActions.load({ id }));

    return this.store.pipe(
      select(userSelectors.isReady),
      first(userReady => userReady)
    );
  }
}
