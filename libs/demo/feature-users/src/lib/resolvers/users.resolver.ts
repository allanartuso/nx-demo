import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { listActions } from '../+state/users/users.actions';
import { listSelectors } from '../+state/users/users.selectors';

@Injectable({ providedIn: 'root' })
export class UsersResolver implements Resolve<boolean> {
  constructor(private readonly store: Store) {}

  resolve(): Observable<boolean> {
    this.store.dispatch(listActions.initializeRequestOptions());
    this.store.dispatch(listActions.initialize());

    return this.store.pipe(select(listSelectors.isReady)).pipe(first(isReady => isReady));
  }
}
