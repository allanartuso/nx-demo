/* eslint-disable @typescript-eslint/ban-types */
import {
  ErrorDto,
  FilteringOptions,
  PagingOptions,
  RequestOptions,
  RequestState,
  SortingField,
  SortingOptions
} from '@demo/shared/data-access';
import { EntityState } from '@ngrx/entity';
import { ActionCreator, MemoizedSelector } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { ApiRequestState, LoadingState } from '../../utils/action-handlers';

export interface ListState<T> extends EntityState<T>, RequestOptions, ApiRequestState, LoadingState {
  selectedResourceIds: string[];
  lastPageNumber: number;
}

export interface ListSelectors<T> {
  getAll: MemoizedSelector<object, T[]>;
  getRequestOptions: MemoizedSelector<object, RequestOptions>;
  isLastPage: MemoizedSelector<object, boolean>;
  getCurrentPageData: MemoizedSelector<object, T[]>;
  getPagingOptions: MemoizedSelector<object, PagingOptions>;
  getSortingOptions: MemoizedSelector<object, SortingOptions>;
  getFilteringOptions: MemoizedSelector<object, FilteringOptions>;
  getCurrentPageNumber: MemoizedSelector<object, number>;
  getLastPageNumber: MemoizedSelector<object, number>;
  getLoadingState: MemoizedSelector<object, RequestState>;
  getSelectedResourceIds: MemoizedSelector<object, string[]>;
  getSelected: MemoizedSelector<object, T[]>;
  getSelectionRecord: MemoizedSelector<object, Record<string, T>>;
  getRequestState: MemoizedSelector<object, RequestState>;
  getErrors: MemoizedSelector<object, ErrorDto>;
  areSelectedReady: MemoizedSelector<object, boolean>;
  isReady: MemoizedSelector<object, boolean>;
  isDeleteDisabled: MemoizedSelector<object, boolean>;
  isCopyDisabled: MemoizedSelector<object, boolean>;
  getTotalCount: MemoizedSelector<object, number>;
}

export interface ListActions<T, S = T> {
  initializeRequestOptions: ActionCreator<string, () => TypedAction<string>>;
  changePagingOptions: ActionCreator<
    string,
    (props: { pagingOptions: PagingOptions }) => { pagingOptions: PagingOptions } & TypedAction<string>
  >;
  changePageSize: ActionCreator<string, (props: { pageSize: number }) => { pageSize: number } & TypedAction<string>>;
  changeSorting: ActionCreator<
    string,
    (props: { sortingField: SortingField }) => { sortingField: SortingField } & TypedAction<string>
  >;
  changeFiltering: ActionCreator<
    string,
    (props: { filteringOptions: FilteringOptions }) => { filteringOptions: FilteringOptions } & TypedAction<string>
  >;

  changeSelected: ActionCreator<
    string,
    (props: { selectedResourceIds: string[] }) => { selectedResourceIds: string[] } & TypedAction<string>
  >;
  loadSelected: ActionCreator<
    string,
    (props: { selectedResourceIds: string[] }) => { selectedResourceIds: string[] } & TypedAction<string>
  >;
  loadSelectedSuccess: ActionCreator<string, (props: { resources: S[] }) => { resources: S[] } & TypedAction<string>>;
  loadSelectedFailure: ActionCreator<string, (props: { error: ErrorDto }) => { error: ErrorDto } & TypedAction<string>>;
  loadPage: ActionCreator<string, (props: { pageNumber: number }) => { pageNumber: number } & TypedAction<string>>;
  loadPageSuccess: ActionCreator<
    string,
    (props: {
      resources: S[];
      pagingOptions: PagingOptions;
    }) => { resources: S[]; pagingOptions: PagingOptions } & TypedAction<string>
  >;
  loadPageFailure: ActionCreator<string, (props: { error: ErrorDto }) => { error: ErrorDto } & TypedAction<string>>;
  delete: ActionCreator<string, (props: { resourceIds: string[] }) => { resourceIds: string[] } & TypedAction<string>>;
  deleteSuccess: ActionCreator<
    string,
    (props: { resourceIds: string[] }) => { resourceIds: string[] } & TypedAction<string>
  >;
  deleteFailure: ActionCreator<string, (props: { error: ErrorDto }) => { error: ErrorDto } & TypedAction<string>>;
  patch: ActionCreator<
    string,
    (props: { resourceIds: string[]; resource: T }) => { resourceIds: string[]; resource: T } & TypedAction<string>
  >;
  patchSuccess: ActionCreator<
    string,
    (props: { resources: (T | ErrorDto)[] }) => { resources: (T | ErrorDto)[] } & TypedAction<string>
  >;
  patchFailure: ActionCreator<string, (props: { error: ErrorDto }) => { error: ErrorDto } & TypedAction<string>>;
  loadNextPage: ActionCreator<string, () => TypedAction<string>>;
  refresh: ActionCreator<string, () => TypedAction<string>>;
  initialize: ActionCreator<string, () => TypedAction<string>>;
  reinitialize: ActionCreator<string, () => TypedAction<string>>;
  loadPreviousPage: ActionCreator<string, () => TypedAction<string>>;
  loadFirstPage: ActionCreator<string, () => TypedAction<string>>;
  resetRequestState: ActionCreator<string, () => TypedAction<string>>;
  copySelected: ActionCreator<string, () => TypedAction<string>>;
  navigateToSelected: ActionCreator<
    string,
    (props: { resourceId: string }) => { resourceId: string } & TypedAction<string>
  >;
  showRemovalsConfirmation: ActionCreator<string, () => TypedAction<string>>;
}
