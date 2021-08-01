/* eslint-disable @typescript-eslint/ban-types */
import { DEFAULT_STORED_PAGES, RequestOptions, RequestState } from '@demo/shared/data-access';
import { EntityAdapter } from '@ngrx/entity';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { ListSelectors, ListState } from '../models/list.model';

export function createListSelectors<T>(
  entityAdapter: EntityAdapter<T>,
  getListState: MemoizedSelector<object, ListState<T>, DefaultProjectorFn<ListState<T>>>
): ListSelectors<T> {
  const getAll = createSelector(getListState, entityAdapter.getSelectors().selectAll);

  const getPagingOptions = createSelector(getListState, state => state.pagingOptions);

  const getRequestOptions = createSelector(
    getListState,
    (state): RequestOptions => ({
      pagingOptions: state.pagingOptions,
      sortingOptions: state.sortingOptions,
      filteringOptions: state.filteringOptions
    })
  );

  const getLastPageNumber = createSelector(getListState, state => state.lastPageNumber);

  const isLastPage = createSelector(getPagingOptions, getLastPageNumber, ({ page, pageSize }, lastPageNumber) => {
    return lastPageNumber <= page;
  });

  const getCurrentPageData = createSelector(getPagingOptions, getAll, ({ page, pageSize }, resources) => {
    const defaultStoredPageIndex = (DEFAULT_STORED_PAGES + 1) / 2;

    if (page < defaultStoredPageIndex) {
      return resources.slice((page - 1) * pageSize, page * pageSize);
    }

    return resources.slice((defaultStoredPageIndex - 1) * pageSize, defaultStoredPageIndex * pageSize);
  });

  const getSortingOptions = createSelector(getListState, state => state.sortingOptions);

  const getFilteringOptions = createSelector(getListState, state => state.filteringOptions);

  const getCurrentPageNumber = createSelector(getPagingOptions, options => options.page);

  const getSelectedResourceIds = createSelector(getListState, state => state.selectedResourceIds);

  const getLoadingState = createSelector(getListState, state => state.loadingState);

  const getSelected = createSelector(
    getSelectedResourceIds,
    createSelector(getListState, entityAdapter.getSelectors().selectEntities),
    (selectedResourceIds, resources): Record<string, T> =>
      selectedResourceIds.reduce((selected, selectedResourceId) => {
        selected[selectedResourceId] = resources[selectedResourceId];
        return selected;
      }, {} as Record<string, T>)
  );

  const getRequestState = createSelector(getListState, state => state.requestState);

  const getErrors = createSelector(getListState, state => state.errors);

  const getBulkOperationSuccess = createSelector(getListState, state => state.bulkOperationSuccesses);

  const isReady = createSelector(
    getAll,
    getLoadingState,
    (users, loadingState) => !!users && loadingState === RequestState.SUCCESS
  );

  const areSelectedReady = createSelector(
    getSelectedResourceIds,
    getSelected,
    getLoadingState,
    (selectedResourceIds, resources, loadingState) => {
      return selectedResourceIds.every(resourceId => !!resources[resourceId]) && loadingState === RequestState.SUCCESS;
    }
  );

  const isDeleteDisabled = createSelector(getSelectedResourceIds, selectedResourceIds => !selectedResourceIds.length);

  const isCopyDisabled = createSelector(
    getSelectedResourceIds,
    selectedResourceIds => selectedResourceIds.length !== 1
  );

  return {
    getAll,
    getRequestOptions,
    isLastPage,
    getCurrentPageData,
    getPagingOptions,
    getSortingOptions,
    getFilteringOptions,
    getCurrentPageNumber,
    getLastPageNumber,
    getLoadingState,
    getSelectedResourceIds,
    getSelected,
    getRequestState,
    getErrors,
    getBulkOperationSuccess,
    areSelectedReady,
    isReady,
    isDeleteDisabled,
    isCopyDisabled
  };
}
