import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './models/store.model';

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer
};
