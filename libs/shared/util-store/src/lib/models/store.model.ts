import { MinimalRouterStateSnapshot, RouterReducerState } from '@ngrx/router-store';

export interface AppState {
  router: RouterReducerState;
}

export interface CustomRouterStateSnapshot extends MinimalRouterStateSnapshot {
  extrasState: unknown;
}
