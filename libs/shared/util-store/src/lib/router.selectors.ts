import * as fromRouterStore from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, CustomRouterStateSnapshot } from './models/store.model';

export const selectRouterState = createFeatureSelector<
  AppState,
  fromRouterStore.RouterReducerState<CustomRouterStateSnapshot>
>('router');

export const {
  selectQueryParam, // factory function to select a query param
  selectRouteParam, // factory function to select a route param
  selectQueryParams, // select the current route query params
  selectRouteParams, // select the current route params
  selectRouteData, // select the current route data
  selectUrl // select the current url1
} = fromRouterStore.getSelectors(selectRouterState);

export const selectRouteExtrasState = createSelector(selectRouterState, routerState => routerState.state.extrasState);
