import {
  DEFAULT_REQUEST_OPTIONS,
  DEFAULT_STORED_PAGES,
  PagingOptions,
  RequestState,
  SortingOrder
} from '@demo/shared/data-access';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ActionReducer, createReducer, on, ReducerTypes } from '@ngrx/store';
import { ActionCreator } from '@ngrx/store/src/models';
import {
  createLoadingStateActionHandlers,
  createRequestStateActionHandlers,
  getLastPageNumber
} from '../../utils/action-handlers';
import { ListActions, ListState } from '../models/list.model';

export function createListEntityAdapter<T extends { [key: string]: any }>(idKey = 'id'): EntityAdapter<T> {
  return createEntityAdapter({
    selectId: resource => resource[idKey]
  });
}

export function createListReducer<T, S = T>(
  entityAdapter: EntityAdapter<S>,
  actions: ListActions<T, S>,
  actionHandlers?: ReducerTypes<ListState<S>, ActionCreator[]>[],
  initialListState?: { [key: string]: unknown }
): ActionReducer<ListState<S>> {
  const initialState: ListState<S> = { ...createInitialListState<S>(entityAdapter), ...initialListState };
  return createReducer<ListState<S>>(
    initialState,
    ...createListActionHandlers<T, S>(initialState, entityAdapter, actions),
    ...(actionHandlers || [])
  );
}

function createInitialListState<T>(entityAdapter: EntityAdapter<T>): ListState<T> {
  return entityAdapter.getInitialState({
    ...DEFAULT_REQUEST_OPTIONS,
    lastPageNumber: undefined,
    selectedResourceIds: [],
    loadingState: RequestState.IDLE,
    requestState: RequestState.IDLE,
    errors: {}
  });
}

function createListActionHandlers<T, S>(
  initialListState: ListState<S>,
  entityAdapter: EntityAdapter<S>,
  actions: ListActions<T, S>
): ReducerTypes<ListState<S>, ActionCreator[]>[] {
  return [
    on(actions.reinitialize, () => initialListState),
    on(actions.initialize, (state: ListState<S>) =>
      entityAdapter.removeAll({
        ...state,
        selectedResourceIds: [],
        pagingOptions: {
          ...state.pagingOptions,
          page: 1
        }
      })
    ),
    on(actions.refresh, (state: ListState<S>) => {
      const currentPageStartIndex = (state.pagingOptions.page - 1) * state.pagingOptions.pageSize;
      const resourceIds = state.ids.slice(currentPageStartIndex) as string[];

      return entityAdapter.removeMany(resourceIds, state);
    }),

    on(actions.changePageSize, (state: ListState<S>, { pageSize }) => ({
      ...state,
      pagingOptions: { ...state.pagingOptions, pageSize },
      lastPageNumber: undefined
    })),
    on(actions.changeSorting, (state: ListState<S>, { sortingField }) => {
      const sortingOptions = { ...state.sortingOptions };
      if (sortingField.order === SortingOrder.NONE) {
        delete sortingOptions[sortingField.name];
      } else {
        sortingOptions[sortingField.name] = sortingField;
      }
      return {
        ...state,
        sortingOptions
      };
    }),
    on(actions.changeFiltering, (state: ListState<S>, { filteringOptions }) => ({
      ...state,
      filteringOptions,
      lastPageNumber: undefined
    })),
    on(actions.changeSelected, actions.loadSelected, (state: ListState<S>, { selectedResourceIds }) => ({
      ...state,
      selectedResourceIds
    })),
    on(actions.loadFirstPage, (state: ListState<S>) => ({
      ...state,
      pagingOptions: { ...state.pagingOptions, page: 1 }
    })),
    on(actions.loadNextPage, (state: ListState<S>) => {
      if (state.pagingOptions.page === state.lastPageNumber) {
        return { ...state };
      }

      if (
        state.pagingOptions.page + 1 === state.lastPageNumber &&
        state.pagingOptions.page + 1 > (DEFAULT_STORED_PAGES + 1) / 2
      ) {
        const resourceIds = state.ids.slice(0, state.pagingOptions.pageSize) as string[];
        state = entityAdapter.removeMany(resourceIds, { ...state });
      }

      return {
        ...state,
        pagingOptions: {
          ...state.pagingOptions,
          page: state.pagingOptions.page + 1
        }
      };
    }),
    on(actions.loadPreviousPage, (state: ListState<S>) => {
      if (state.pagingOptions.page === 1) {
        return { ...state };
      }

      return {
        ...state,
        pagingOptions: {
          ...state.pagingOptions,
          page: state.pagingOptions.page - 1
        }
      };
    }),
    on(actions.loadPageSuccess, (state: ListState<S>, { resources, pagingOptions }) => {
      if (pagingOptions.page < state.pagingOptions.page) {
        return createPreviousPageSuccessState(entityAdapter, state, resources);
      }

      return createNextPageSuccessState(entityAdapter, state, pagingOptions, resources);
    }),
    on(actions.loadSelectedSuccess, (state: ListState<S>, { resources }) => entityAdapter.addMany(resources, state)),
    on(actions.deleteSuccess, (state: ListState<S>) => ({
      ...state,
      selectedResourceIds: [] as string[]
    })),
    on(actions.navigateToSelected, (state: ListState<S>, { resourceId }) => ({
      ...state,
      currentResourceId: resourceId
    })),

    ...createLoadingStateActionHandlers<ListState<S>>(
      actions.loadPage,
      actions.loadPageSuccess,
      actions.loadPageFailure
    ),
    ...createLoadingStateActionHandlers<ListState<S>>(
      actions.loadSelected,
      actions.loadSelectedSuccess,
      actions.loadSelectedFailure
    ),
    ...createRequestStateActionHandlers<ListState<S>>(
      undefined,
      actions.delete,
      actions.deleteSuccess,
      actions.deleteFailure
    ),
    ...createRequestStateActionHandlers<ListState<S>>(
      actions.resetRequestState,
      actions.patch,
      actions.patchSuccess,
      actions.patchFailure
    )
  ];
}

function createPreviousPageSuccessState<T>(
  entityAdapter: EntityAdapter<T>,
  state: ListState<T>,
  resources: T[]
): ListState<T> {
  const resourceIds: string[] = state.ids.slice(
    0,
    (DEFAULT_STORED_PAGES - 1) * state.pagingOptions.pageSize
  ) as string[];

  return entityAdapter.setAll([...resources, ...resourceIds.map(resourceId => state.entities[resourceId])], {
    ...state,
    selectedResourceIds: []
  });
}

function createNextPageSuccessState<T>(
  entityAdapter: EntityAdapter<T>,
  state: ListState<T>,
  pagingOptions: PagingOptions,
  resources: T[]
): ListState<T> {
  let resourceIds: string[] = [];
  const lastPageNumber = getLastPageNumber(resources, pagingOptions) || state.lastPageNumber;

  if (pagingOptions.page > DEFAULT_STORED_PAGES && lastPageNumber !== state.pagingOptions.page) {
    resourceIds = state.ids.slice(0, state.pagingOptions.pageSize) as string[];
    state = entityAdapter.removeMany(resourceIds, { ...state });
  }

  return entityAdapter.addMany(resources, {
    ...state,
    lastPageNumber,
    selectedResourceIds: []
  });
}
