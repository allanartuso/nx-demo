import { DEFAULT_REQUEST_OPTIONS, DEFAULT_STORED_PAGES, RequestState } from '@ngdux/data-model-common';
import { createFeatureSelector } from '@ngrx/store';
import { createTestResources, TestResource } from '../../models/store.fixture';
import { ListState } from '../models/list.model';
import { createListEntityAdapter } from './list-reducer';
import { createListSelectors } from './list-selectors';

describe('list selectors', () => {
  let state: ListState<TestResource>;
  let resources: TestResource[];

  const testEntityAdapter = createListEntityAdapter<TestResource>();
  const listSelectors = createListSelectors(testEntityAdapter, createFeatureSelector('testFeature'));
  const initialState = testEntityAdapter.getInitialState({
    ...DEFAULT_REQUEST_OPTIONS,
    lastPageNumber: undefined,
    currentResourceId: undefined,
    selectedResourceIds: [],
    loadingState: RequestState.IDLE,
    requestState: RequestState.IDLE,
    error: undefined
  });

  beforeEach(() => {
    resources = createTestResources();
    state = testEntityAdapter.addMany(resources, { ...initialState });
    state.selectedResourceIds = [resources[0].id, resources[1].id];
  });

  it('getPagingOptions', () => {
    expect(listSelectors.getPagingOptions.projector(state)).toBe(state.pagingOptions);
  });

  it('getCurrentPageNumber', () => {
    expect(listSelectors.getCurrentPageNumber.projector(state.pagingOptions)).toBe(state.pagingOptions.page);
  });

  it('getLastPageNumber', () => {
    const lastPageNumber = 5;
    state.lastPageNumber = lastPageNumber;

    expect(listSelectors.getLastPageNumber.projector(state)).toBe(lastPageNumber);
  });

  it('getSortingOptions', () => {
    expect(listSelectors.getSortingOptions.projector(state)).toBe(state.sortingOptions);
  });

  it('getFilteringOptions', () => {
    expect(listSelectors.getFilteringOptions.projector(state)).toBe(state.filteringOptions);
  });

  it('getLoadingState', () => {
    expect(listSelectors.getLoadingState.projector(state)).toBe(state.loadingState);
  });

  it('isLastPage', () => {
    const lastPageNumber = 1;
    state.pagingOptions.page = lastPageNumber;

    expect(listSelectors.isLastPage.projector(state.pagingOptions, lastPageNumber)).toBe(true);
  });

  it('getRequestState', () => {
    expect(listSelectors.getRequestState.projector(state)).toBe(state.requestState);
  });

  describe('getCurrentPageData', () => {
    const defaultStoredPages = DEFAULT_STORED_PAGES;
    const pageSize = 2;

    beforeEach(() => {
      resources = createTestResources();
      state = testEntityAdapter.addMany(resources, { ...initialState });
      state.pagingOptions.pageSize = pageSize;
    });

    it('when current page is smaller than the default stored page index', () => {
      const allResources = testEntityAdapter.getSelectors().selectAll(state);

      expect(listSelectors.getCurrentPageData.projector(state.pagingOptions, allResources)).toStrictEqual(
        allResources.slice(0, state.pagingOptions.page * state.pagingOptions.pageSize)
      );
    });

    it('when current page is greater than the default stored page index', () => {
      const allResources = testEntityAdapter.getSelectors().selectAll(state);
      const defaultStoredPageIndex = (defaultStoredPages + 1) / 2;
      state.pagingOptions.page = defaultStoredPageIndex;

      expect(listSelectors.getCurrentPageData.projector(state.pagingOptions, allResources)).toStrictEqual(
        resources.slice((defaultStoredPageIndex - 1) * pageSize, defaultStoredPageIndex * pageSize)
      );
    });
  });

  it('getSelectedResourceIds', () => {
    expect(listSelectors.getSelectedResourceIds.projector(state)).toBe(state.selectedResourceIds);
  });

  it('getSelected', () => {
    const allResources = testEntityAdapter.getSelectors().selectEntities(state);

    expect(listSelectors.getSelected.projector(state.selectedResourceIds, allResources)).toStrictEqual(
      resources.slice(0, 2)
    );
  });

  describe('isReady', () => {
    it('returns true when the resources are loaded', () => {
      const allResources = testEntityAdapter.getSelectors().selectAll(state);

      expect(listSelectors.isReady.projector(allResources, RequestState.SUCCESS)).toBe(true);
    });

    it('returns false when the resources loading state is in progress', () => {
      const allResources = testEntityAdapter.getSelectors().selectAll(state);

      expect(listSelectors.isReady.projector(allResources, RequestState.IN_PROGRESS)).toBe(false);
    });

    it('returns false when the resources are not defined', () => {
      expect(listSelectors.isReady.projector(undefined, RequestState.IDLE)).toBe(false);
    });
  });

  describe('areSelectedReady', () => {
    let selectedResources: { [x: string]: TestResource };
    let selectedResourceIds: string[];

    beforeEach(() => {
      selectedResourceIds = [resources[0].id, resources[1].id];
      selectedResources = {
        [resources[0].id]: resources[0],
        [resources[1].id]: resources[1]
      };
    });

    it('returns true when the selected resources are loaded', () => {
      expect(
        listSelectors.areSelectedReady.projector(selectedResourceIds, selectedResources, RequestState.SUCCESS)
      ).toBe(true);
    });

    it('returns false when the one or more selected resources are not loaded', () => {
      selectedResourceIds = [resources[1].id, resources[2].id];

      expect(
        listSelectors.areSelectedReady.projector(selectedResourceIds, selectedResources, RequestState.SUCCESS)
      ).toBe(false);
    });

    it('returns false when the request is in progress', () => {
      expect(
        listSelectors.areSelectedReady.projector(selectedResourceIds, selectedResources, RequestState.IN_PROGRESS)
      ).toBe(false);
    });
  });

  describe('isDeleteDisabled', () => {
    it('returns true when no resources are selected ', () => {
      const selectedResourceIds: string[] = [];

      expect(listSelectors.isDeleteDisabled.projector(selectedResourceIds)).toBe(true);
    });

    it('returns false if at least one resource is selected', () => {
      const selectedResourceIds = [resources[0].id];

      expect(listSelectors.isDeleteDisabled.projector(selectedResourceIds)).toBe(false);
    });
  });

  describe('isCopyDisabled', () => {
    it('returns true when no resources are selected', () => {
      const selectedResourceIds: string[] = [];

      expect(listSelectors.isCopyDisabled.projector(selectedResourceIds)).toBe(true);
    });

    it('returns true if more than one resource is selected', () => {
      const selectedResourceIds = [resources[0].id, resources[1].id];

      expect(listSelectors.isCopyDisabled.projector(selectedResourceIds)).toBe(true);
    });

    it('returns false if one resource is selected', () => {
      const selectedResourceIds = [resources[0].id];

      expect(listSelectors.isCopyDisabled.projector(selectedResourceIds)).toBe(false);
    });
  });
});
