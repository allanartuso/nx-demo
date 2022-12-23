# @ngdux/form

The @ngdux/form gives yo a full state to make easy to create, load, save and delete a resource.

Example:

## Option 1

### Full state

```
import { User, Error } from '.../models';
import { createFormState } from '@ngdux/form';

export const USER_FEATURE_KEY = 'user';
export const {
  actions: userActions,
  selectors: userSelectors,
  reducer: userReducer
} = createFormState<User, Error>(USER_FEATURE_KEY);
```

## Option 2

### Actions

```
import { createFormActions } from '@ngdux/form';
import { User, Error } from '.../models';

export const formActions = createFormActions<User, Error>('User');
```

### Reducer

```
import { createFormReducer, FormState } from '@ngdux/form';
import { Action } from '@ngrx/store';
import { User, Error } from '.../models';
import { formActions } from './user.actions';

export const USER_FEATURE_KEY = 'user';
const reducer = createFormReducer(formActions);

export function userReducer(state: FormState<User, Error>, action: Action): FormState<User, Error> {
  return reducer(state, action);
}
```

### Selectors

```
import { createFormSelectors, FormState } from '@ngdux/form';
import { createFeatureSelector } from '@ngrx/store';
import { User, Error } from '.../models';
import { USER_FEATURE_KEY } from './user.reducer';

const getState = createFeatureSelector<FormState<User, Error>>(USER_FEATURE_KEY);

export const formSelectors = createFormSelectors(getState);
```

## Effects

```
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractFormEffects } from '@ngdux/form';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { User, Error } from '.../models';
import { FormNotificationService } from '../notification';
import { UserService } from '../../services/user.service';
import { formActions } from './user.actions';

@Injectable()
export class UserEffects extends AbstractFormEffects<User, Error> {
  constructor(
  router: Router,
  actions$: Actions,
      store: Store,
      userService: UserService,
      formNotificationService: FormNotificationService
    ) {
      super(router, actions$, store, userService, formActions, formNotificationService);
  }
}
```

## Service

```
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormService } from '@ngdux/form';
import { User, USERS_RESOURCE_BASE_PATH } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements FormService<User> {
  constructor(private httpClient: HttpClient) {}

  loadResource(id: string): Observable<User> {
    return this.httpClient.get<User>(`${USERS_RESOURCE_BASE_PATH}/${id}`);
  }

  createResource(user: User): Observable<User> {
    return this.httpClient.post<User>(USERS_RESOURCE_BASE_PATH, user);
  }

  saveResource(user: User): Observable<User> {
    return this.httpClient.put<User>(`${USERS_RESOURCE_BASE_PATH}/${user.id}`, user);
  }

  deleteResource(id: string): Observable<User> {
    return this.httpClient.delete<User>(`${USERS_RESOURCE_BASE_PATH}/${id}`);
  }
}

```

## Notification Service

```
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormNotificationService } from '@ngdux/form';
import { Error } from '.../models';

@Injectable({
  providedIn: 'root'
})
export class FormNotificationService implements FormNotificationService<Error> {
  constructor(private readonly snackBar: MatSnackBar) {}

  onErrors(errors: Error): void {
    this.snackBar.open(errors.message);
  }

  onDelete(id: string): void {
    this.snackBar.open(`Resource ${id} has been deleted.`);
  }
}
```
