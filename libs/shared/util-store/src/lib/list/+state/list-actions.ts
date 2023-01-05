import { ErrorDto, FilteringOptions, PagingOptions, SortingField } from '@ngdux/data-model-common';
import { createAction, props } from '@ngrx/store';
import { ListActions } from '../models/list.model';

export function createListActions<T, S = T>(featureName: string): ListActions<T, S> {
  const initializeRequestOptions = createAction(`[${featureName} Page] Initialize ${featureName} Request Options`);
  const refresh = createAction(`[${featureName} Page] Refresh ${featureName}`);
  const initialize = createAction(`[${featureName} Page] Initialize ${featureName}`);
  const reinitialize = createAction(`[Organization ${featureName} Page] Reinitialize ${featureName}`);

  const loadNextPage = createAction(`[${featureName} Page] Load Next ${featureName} Page`);
  const loadPreviousPage = createAction(`[${featureName} Page] Load Previous ${featureName} Page`);
  const loadFirstPage = createAction(`[${featureName} Page] Load First ${featureName} Page`);

  const changePageSize = createAction(
    `[${featureName} Page] Change ${featureName} Page Size`,
    props<{ pageSize: number }>()
  );

  const changePagingOptions = createAction(
    `[${featureName} Page] Change ${featureName} Page Options`,
    props<{ pagingOptions: PagingOptions }>()
  );
  const changeSorting = createAction(
    `[${featureName} Page] Change ${featureName} Sorting`,
    props<{ sortingField: SortingField }>()
  );
  const changeFiltering = createAction(
    `[${featureName} Page] Change ${featureName} Filtering`,
    props<{ filteringOptions: FilteringOptions }>()
  );
  const changeSelected = createAction(
    `[${featureName} Page] Change Selected ${featureName}`,
    props<{ selectedResourceIds: string[] }>()
  );

  const loadSelected = createAction(
    `[${featureName} Page] Load Selected ${featureName}`,
    props<{ selectedResourceIds: string[] }>()
  );
  const loadSelectedSuccess = createAction(
    `[${featureName} Page] Load Selected ${featureName} Success`,
    props<{ resources: S[] }>()
  );
  const loadSelectedFailure = createAction(
    `[${featureName} Page] Load Selected ${featureName} Failure`,
    props<{ error: ErrorDto }>()
  );

  const loadPage = createAction(`[${featureName} Page] Load ${featureName} Page`, props<{ pageNumber: number }>());
  const loadPageSuccess = createAction(
    `[${featureName} Page] Load ${featureName} Page Success`,
    props<{ resources: S[]; pagingOptions: PagingOptions }>()
  );
  const loadPageFailure = createAction(
    `[${featureName} Page] Load ${featureName} Page Failure`,
    props<{ error: ErrorDto }>()
  );

  const deleteAction = createAction(`[${featureName} Page] Delete ${featureName}`, props<{ resourceIds: string[] }>());
  const deleteSuccess = createAction(
    `[${featureName} Page] Delete ${featureName} Success`,
    props<{ resourceIds: string[] }>()
  );
  const deleteFailure = createAction(
    `[${featureName} Page] Delete ${featureName} Failure`,
    props<{ error: ErrorDto }>()
  );

  const patch = createAction(
    `[${featureName} Page] Patch ${featureName}`,
    props<{ resourceIds: string[]; resource: Partial<T> }>()
  );
  const patchSuccess = createAction(
    `[${featureName} Page] Patch ${featureName} Success`,
    props<{ resources: (T | ErrorDto)[] }>()
  );
  const patchFailure = createAction(`[${featureName} Page] Patch ${featureName} Failure`, props<{ error: ErrorDto }>());
  const resetRequestState = createAction(`[${featureName} Page] Reset ${featureName} Request State`);
  const copySelected = createAction(`[${featureName} Page] Copy Selected ${featureName}`);
  const navigateToSelected = createAction(
    `[${featureName} Page] Navigate to selected ${featureName}`,
    props<{ resourceId: string }>()
  );

  const showRemovalsConfirmation = createAction(`[${featureName} Page] Show ${featureName} Removal Confirmation`);

  return {
    initializeRequestOptions,
    changePageSize,
    changeSorting,
    changeFiltering,
    loadNextPage,
    loadPage,
    refresh,
    initialize,
    reinitialize,
    loadPreviousPage,
    loadFirstPage,
    changeSelected,
    loadSelected,
    loadSelectedSuccess,
    loadSelectedFailure,
    loadPageSuccess,
    loadPageFailure,
    delete: deleteAction,
    deleteSuccess,
    deleteFailure,
    patch,
    patchSuccess,
    patchFailure,
    resetRequestState,
    copySelected,
    navigateToSelected,
    changePagingOptions,
    showRemovalsConfirmation
  };
}
