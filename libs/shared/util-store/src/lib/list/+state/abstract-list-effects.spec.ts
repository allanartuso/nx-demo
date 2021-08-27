import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DEFAULT_REQUEST_OPTIONS, ErrorDto, ListService, RequestState } from '@demo/shared/data-access';
import { errorFixture } from '@demo/shared/data-access/test';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from '@nrwl/angular/testing';
import { Observable, of, throwError } from 'rxjs';
import { createTestResources, TestResource } from '../../models/store.fixture';
import {
  featureKey,
  listActions,
  listSelectors,
  testEntityAdapter,
  TestListEffects,
  TestListService
} from '../models/list.fixture';
import { ListState } from '../models/list.model';

describe('TestEffects', () => {
  let actions$: Observable<Action>;
  let effects: TestListEffects;
  let resourcesService: ListService<TestResource>;
  let store: MockStore;
  let resources: TestResource[];
  let initialState: ListState<TestResource>;
  let router: Router;

  const tenantId = 2;
  const errorDto: ErrorDto = errorFixture.createErrorDto();

  beforeEach(() => {
    resources = createTestResources(tenantId);

    initialState = testEntityAdapter.getInitialState({
      ...DEFAULT_REQUEST_OPTIONS,
      lastPageNumber: undefined,
      currentResourceId: undefined,
      selectedResourceIds: [],
      loadingState: RequestState.IDLE,
      requestState: RequestState.IDLE,
      error: undefined
    });
    initialState = testEntityAdapter.addMany(resources, initialState);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }])],
      providers: [
        TestListEffects,
        TestListService,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: { [featureKey]: initialState },
          selectors: [
            {
              selector: listSelectors.isLastPage,
              value: false
            }
          ]
        })
      ]
    });

    effects = TestBed.inject(TestListEffects);
    resourcesService = TestBed.inject(TestListService);
    resourcesService.queryResources = jest.fn().mockImplementation(() => of(resources));
    resourcesService.patchResources = jest.fn().mockImplementation(() => of(resources));
    resourcesService.deleteResources = jest.fn().mockImplementation(() => of(resources));
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  describe('initialize$', () => {
    it('emits load page action to the pages 1 and 2', () => {
      actions$ = hot('a', { a: listActions.initialize() });
      const expected = hot('(ab)', {
        a: listActions.loadPage({ pageNumber: 1 }),
        b: listActions.loadPage({ pageNumber: 2 })
      });

      expect(effects.initialize$).toBeObservable(expected);
    });
  });

  describe('loadPage$', () => {
    it('should emit success when the api respond successfully', () => {
      const pageNumber = 3;
      const pagingOptions = { ...initialState.pagingOptions, page: pageNumber };
      actions$ = hot('a', { a: listActions.loadPage({ pageNumber }) });
      const expected = hot('a', { a: listActions.loadPageSuccess({ resources, pagingOptions }) });

      expect(effects.loadPage$).toBeObservable(expected);
    });

    it('should emit failure when an error is thrown', () => {
      resourcesService.queryResources = jest.fn().mockImplementation(() => throwError(errorDto));
      actions$ = hot('a', { a: listActions.loadPage({ pageNumber: 3 }) });
      const expected = hot('a', {
        a: listActions.loadPageFailure({ error: errorDto })
      });

      expect(effects.loadPage$).toBeObservable(expected);
    });
  });

  describe('loadPreviousPage$', () => {
    it('emits load page action to the previous page', () => {
      const currentPageNumber = 2;
      store.overrideSelector(listSelectors.getCurrentPageNumber, currentPageNumber);
      actions$ = hot('a', {
        a: listActions.loadPreviousPage()
      });
      const expected = hot('a', {
        a: listActions.loadPage({
          pageNumber: currentPageNumber - 1
        })
      });

      expect(effects.loadPreviousPage$).toBeObservable(expected);
    });
    it('does not emit load page action to the previous page if the current page is the first page', () => {
      actions$ = hot('a', {
        a: listActions.loadPreviousPage()
      });
      const expected = hot('-');

      expect(effects.loadPreviousPage$).toBeObservable(expected);
    });
  });

  describe('loadNextPage$', () => {
    it('emits load page action to the next page', () => {
      actions$ = hot('a', {
        a: listActions.loadNextPage()
      });
      const expected = hot('a', {
        a: listActions.loadPage({
          pageNumber: initialState.pagingOptions.page + 1
        })
      });

      expect(effects.loadNextPage$).toBeObservable(expected);
    });
  });

  describe('changeRequestOptions$', () => {
    it('emits remove all and initialize actions', () => {
      actions$ = hot('a', { a: listActions.changePageSize({ pageSize: 10 }) });
      const expected = hot('a', { a: listActions.initialize() });

      expect(effects.changeRequestOptions$).toBeObservable(expected);
    });
  });

  describe('delete$', () => {
    let resourceIds: string[];

    beforeEach(() => {
      resourceIds = ['testId1'];
    });

    it('should emit success and refresh the list when service call is successful', () => {
      const expected = hot('(ab)', {
        a: listActions.deleteSuccess({ resourceIds }),
        b: listActions.refresh()
      });
      actions$ = hot('a', { a: listActions.delete({ resourceIds }) });

      expect(effects.delete$).toBeObservable(expected);
    });

    it('should emit failure when error is thrown without any successes.', () => {
      store.overrideSelector(listSelectors.getSelected, resources);
      resourcesService.deleteResources = jest.fn().mockImplementation(() => throwError(errorDto));
      const expected = hot('a', {
        a: listActions.deleteFailure({ error: errorDto })
      });
      actions$ = hot('a', { a: listActions.delete({ resourceIds }) });

      expect(effects.delete$).toBeObservable(expected);
    });
  });

  describe('refresh$', () => {
    it('reloads the current and next page.', () => {
      const currentPageNumber = 2;
      store.overrideSelector(listSelectors.getCurrentPageNumber, currentPageNumber);
      const expected = hot('(ab)', {
        a: listActions.loadPage({ pageNumber: currentPageNumber }),
        b: listActions.loadPage({ pageNumber: currentPageNumber + 1 })
      });
      actions$ = hot('a', { a: listActions.refresh() });

      expect(effects.refresh$).toBeObservable(expected);
    });
  });

  describe('loadSelected$', () => {
    let resourceId: string;
    beforeEach(() => {
      resourceId = resources[0].id;
    });

    it('should emit success when the api respond successfully', () => {
      actions$ = hot('a', { a: listActions.loadSelected({ selectedResourceIds: [resourceId] }) });
      const expected = hot('a', {
        a: listActions.loadSelectedSuccess({
          resources: resources
        })
      });

      expect(effects.loadSelected$).toBeObservable(expected);
    });

    it('should emit failure when an error is thrown', () => {
      resourcesService.queryResources = jest.fn().mockImplementation(() => throwError(errorDto));
      actions$ = hot('a', { a: listActions.loadSelected({ selectedResourceIds: [resourceId] }) });
      const expected = hot('a', {
        a: listActions.loadSelectedFailure({ error: errorDto })
      });

      expect(effects.loadSelected$).toBeObservable(expected);
    });

    it('emits empty success action if the resource summary is already loaded', () => {
      store.overrideSelector(listSelectors.getSelectionRecord, {
        [resourceId]: resources[0]
      });
      actions$ = hot('a', { a: listActions.loadSelected({ selectedResourceIds: [resourceId] }) });
      const expected = hot('a', {
        a: listActions.loadSelectedSuccess({ resources: [] })
      });

      expect(effects.loadSelected$).toBeObservable(expected);
    });
  });

  describe('copySelected$', () => {
    it('navigates to the create User route without cleaning the current User data from the store', () => {
      jest.spyOn(router, 'navigate');
      const selectedResourceIds = ['testId1'];
      store.overrideSelector(listSelectors.getSelectedResourceIds, selectedResourceIds);
      const expected = hot('a', { a: [listActions.copySelected(), selectedResourceIds] });
      actions$ = hot('a', { a: listActions.copySelected() });

      expect(effects.copySelected$).toBeObservable(expected);
      expect(router.navigate).toHaveBeenCalledWith([selectedResourceIds[0]], {
        state: { selectedResourceId: selectedResourceIds[0] }
      });
    });
  });

  describe('patch$', () => {
    let resourceIds: string[];
    let resource: Partial<TestResource>;

    beforeEach(() => {
      resourceIds = ['testId1'];
      resource = {
        name: 'testName'
      };
    });

    it('emits an info notification when receiving patch success action', () => {
      const expectedActions = hot('(ab)', {
        a: listActions.patchSuccess({ resources }),
        b: listActions.refresh()
      });
      actions$ = hot('a', {
        a: listActions.patch({
          resourceIds,
          resource
        })
      });

      expect(effects.patch$).toBeObservable(expectedActions);
      expect(resourcesService.patchResources).toHaveBeenCalledWith(resourceIds, resource);
    });

    it('adds arguments when failing', () => {
      jest.spyOn(effects, 'addGeneralErrorsArguments$');
      resourcesService.patchResources = jest.fn().mockImplementation(() => throwError(errorDto));
      actions$ = hot('a', { a: listActions.patch({ resourceIds, resource }) });
      const expected = hot('a', { a: listActions.patchFailure({ error: errorDto }) });

      expect(effects.patch$).toBeObservable(expected);
      expect(effects.addGeneralErrorsArguments$).toHaveBeenCalled();
    });
  });
});
