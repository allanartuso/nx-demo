import { TestBed } from '@angular/core/testing';
import { ListState } from '@arviem/acm/feature/common/list';
import {
  createNewResourceRoutePath,
  createResourceId,
  ErrorsDto,
  ErrorsVm,
  GeneralErrorCode,
  ListService
} from '@arviem/shared/acm/data-access/common';
import { errorsModelFixture, resourceDtoFixture } from '@arviem/shared/acm/data-access/common/test';
import { ORGANIZATION_MEMBERS_RESOURCE_BASE_PATH } from '@arviem/shared/acm/data-access/organization-members';
import { DEFAULT_REQUEST_OPTIONS, RequestState } from '@arviem/shared/data-access';
import { navigateToAction } from '@arviem/shared/util-router-store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from '@nrwl/angular/testing';
import { Observable, of, throwError } from 'rxjs';
import {
  createTestResourceDtos,
  featureKey,
  PatchTestResource,
  resourcesActions,
  resourcesSelectors,
  TestEffects,
  testEntityAdapter,
  TestResourceDto,
  TestService,
  TestSummaryDto
} from '../models/list.fixture';

describe('TestEffects', () => {
  let actions$: Observable<Action>;
  let effects: TestEffects;
  let resourcesService: ListService<TestResourceDto, PatchTestResource, TestSummaryDto>;
  let errorsVm: ErrorsVm;
  let store: MockStore;
  let resources: TestResourceDto[];
  let initialState: ListState<TestResourceDto>;
  const tenantId = 2;
  const errorsDto: ErrorsDto = {
    generalErrors: [{ code: GeneralErrorCode.RESOURCE_NOT_FOUND, message: 'testError', arguments: [] }],
    fieldErrors: []
  };

  beforeEach(() => {
    resources = createTestResourceDtos(tenantId);
    errorsVm = new ErrorsVm(
      errorsModelFixture.createGeneralErrorsVm(
        errorsDto.generalErrors,
        resources.map(resource => resource.resourceId)
      )
    );

    initialState = testEntityAdapter.getInitialState({
      ...DEFAULT_REQUEST_OPTIONS,
      lastPageNumber: undefined,
      currentResourceId: undefined,
      selectedResourceIds: [],
      loadingState: RequestState.IDLE,
      requestState: RequestState.IDLE,
      fieldErrors: {}
    });
    initialState = testEntityAdapter.addMany(resources, initialState);

    TestBed.configureTestingModule({
      providers: [
        TestEffects,
        TestService,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: { [featureKey]: initialState },
          selectors: [
            {
              selector: resourcesSelectors.isLastPage,
              value: false
            }
          ]
        })
      ]
    });

    effects = TestBed.inject(TestEffects);
    resourcesService = TestBed.inject(TestService);
    resourcesService.queryResources = jest.fn().mockImplementation(() => of(resources));
    resourcesService.patchResources = jest.fn().mockImplementation(() => of(resources));
    resourcesService.deleteResources = jest.fn().mockImplementation(() => of(resources));
    store = TestBed.inject(MockStore);
  });

  describe('initialize$', () => {
    it('emits load page action to the pages 1 and 2', () => {
      actions$ = hot('a', { a: resourcesActions.initialize() });
      const expected = hot('(ab)', {
        a: resourcesActions.loadPage({ pageNumber: 1 }),
        b: resourcesActions.loadPage({ pageNumber: 2 })
      });

      expect(effects.initialize$).toBeObservable(expected);
    });
  });

  describe('loadPage$', () => {
    it('should emit success when the api respond successfully', () => {
      const pageNumber = 3;
      const pagingOptions = { ...initialState.pagingOptions, page: pageNumber };
      actions$ = hot('a', { a: resourcesActions.loadPage({ pageNumber }) });
      const expected = hot('a', { a: resourcesActions.loadPageSuccess({ resources, pagingOptions }) });

      expect(effects.loadPage$).toBeObservable(expected);
    });

    it('should emit failure when an error is thrown', () => {
      resourcesService.queryResources = jest.fn().mockImplementation(() => throwError(errorsVm));
      actions$ = hot('a', { a: resourcesActions.loadPage({ pageNumber: 3 }) });
      const expected = hot('a', {
        a: resourcesActions.loadPageFailure({ error: errorsVm })
      });

      expect(effects.loadPage$).toBeObservable(expected);
    });
  });

  describe('loadPreviousPage$', () => {
    it('emits load page action to the previous page', () => {
      const currentPageNumber = 2;
      store.overrideSelector(resourcesSelectors.getCurrentPageNumber, currentPageNumber);
      actions$ = hot('a', {
        a: resourcesActions.loadPreviousPage()
      });
      const expected = hot('a', {
        a: resourcesActions.loadPage({
          pageNumber: currentPageNumber - 1
        })
      });

      expect(effects.loadPreviousPage$).toBeObservable(expected);
    });
    it('does not emit load page action to the previous page if the current page is the first page', () => {
      actions$ = hot('a', {
        a: resourcesActions.loadPreviousPage()
      });
      const expected = hot('-');

      expect(effects.loadPreviousPage$).toBeObservable(expected);
    });
  });

  describe('loadNextPage$', () => {
    it('emits load page action to the next page', () => {
      actions$ = hot('a', {
        a: resourcesActions.loadNextPage()
      });
      const expected = hot('a', {
        a: resourcesActions.loadPage({
          pageNumber: initialState.pagingOptions.page + 1
        })
      });

      expect(effects.loadNextPage$).toBeObservable(expected);
    });
  });

  describe('changeRequestOptions$', () => {
    it('emits remove all and initialize actions', () => {
      actions$ = hot('a', { a: resourcesActions.changePageSize({ pageSize: 10 }) });
      const expected = hot('a', { a: resourcesActions.initialize() });

      expect(effects.changeRequestOptions$).toBeObservable(expected);
    });
  });

  describe('delete$', () => {
    let resourceIds: string[];

    beforeEach(() => {
      resourceIds = [resourceDtoFixture.createResourceId(tenantId, 'resourceBasePath', 2)];
    });

    it('should emit success and refresh the list when service call is successful', () => {
      const expected = hot('(ab)', {
        a: resourcesActions.deleteSuccess({ resourceIds }),
        b: resourcesActions.refresh()
      });
      actions$ = hot('a', { a: resourcesActions.delete({ resourceIds }) });

      expect(effects.delete$).toBeObservable(expected);
    });

    it('should emit failure when error is thrown without any successes.', () => {
      store.overrideSelector(resourcesSelectors.getSelected, initialState.entities);
      resourcesService.deleteResources = jest.fn().mockImplementation(() => throwError(errorsVm));
      const expected = hot('a', {
        a: resourcesActions.deleteFailure({ error: errorsVm })
      });
      actions$ = hot('a', { a: resourcesActions.delete({ resourceIds }) });

      expect(effects.delete$).toBeObservable(expected);
    });
  });

  describe('refresh$', () => {
    it('reloads the current and next page.', () => {
      const currentPageNumber = 2;
      store.overrideSelector(resourcesSelectors.getCurrentPageNumber, currentPageNumber);
      const expected = hot('(ab)', {
        a: resourcesActions.loadPage({ pageNumber: currentPageNumber }),
        b: resourcesActions.loadPage({ pageNumber: currentPageNumber + 1 })
      });
      actions$ = hot('a', { a: resourcesActions.refresh() });

      expect(effects.refresh$).toBeObservable(expected);
    });
  });

  describe('loadSelected$', () => {
    let resourceId: string;
    beforeEach(() => {
      resourceId = resources[0].resourceId;
    });

    it('should emit success when the api respond successfully', () => {
      actions$ = hot('a', { a: resourcesActions.loadSelected({ selectedResourceIds: [resourceId] }) });
      const expected = hot('a', {
        a: resourcesActions.loadSelectedSuccess({
          resources: resources
        })
      });

      expect(effects.loadSelected$).toBeObservable(expected);
    });

    it('should emit failure when an error is thrown', () => {
      resourcesService.queryResources = jest.fn().mockImplementation(() => throwError(errorsVm));
      actions$ = hot('a', { a: resourcesActions.loadSelected({ selectedResourceIds: [resourceId] }) });
      const expected = hot('a', {
        a: resourcesActions.loadSelectedFailure({ error: errorsVm })
      });

      expect(effects.loadSelected$).toBeObservable(expected);
    });

    it('emits empty success action if the resource summary is already loaded', () => {
      store.overrideSelector(resourcesSelectors.getSelected, {
        [resourceId]: resources[0]
      });
      actions$ = hot('a', { a: resourcesActions.loadSelected({ selectedResourceIds: [resourceId] }) });
      const expected = hot('a', {
        a: resourcesActions.loadSelectedSuccess({ resources: [] })
      });

      expect(effects.loadSelected$).toBeObservable(expected);
    });
  });

  describe('copySelected$', () => {
    it('navigates to the create Forwarder route without cleaning the current Forwarder data from the store', () => {
      const testTenantId = 2;
      const testResourceBasePath = 'testResourceBasePath';
      const selectedResourceIds = [createResourceId(testTenantId, testResourceBasePath, 3)];
      store.overrideSelector(resourcesSelectors.getSelectedResourceIds, selectedResourceIds);
      const expected = hot('a', {
        a: navigateToAction({
          path: createNewResourceRoutePath(testTenantId, testResourceBasePath),
          extras: { state: { selectedResourceId: selectedResourceIds[0] } }
        })
      });
      actions$ = hot('a', { a: resourcesActions.copySelected() });

      expect(effects.copySelected$).toBeObservable(expected);
    });
  });

  describe('patch$', () => {
    let resourceIds: string[];
    let resource: Partial<TestResourceDto>;

    beforeEach(() => {
      resourceIds = [createResourceId(tenantId, ORGANIZATION_MEMBERS_RESOURCE_BASE_PATH, 2)];
      resource = {
        name: 'testName'
      };
    });

    it('emits an info notification when receiving patch success action', () => {
      const expectedActions = hot('(ab)', {
        a: resourcesActions.patchSuccess({ resources }),
        b: resourcesActions.refresh()
      });
      actions$ = hot('a', {
        a: resourcesActions.patch({
          resourceIds,
          resource
        })
      });

      expect(effects.patch$).toBeObservable(expectedActions);
      expect(resourcesService.patchResources).toHaveBeenCalledWith(resourceIds, resource);
    });

    it('adds arguments when failing', () => {
      spyOn(effects, 'addGeneralErrorsArguments$').and.callThrough();
      (resourcesService.patchResources as jest.Mock<any, any>).mockImplementation(() => throwError(errorsVm));
      actions$ = hot('a', { a: resourcesActions.patch({ resourceIds, resource }) });
      const expected = hot('a', { a: resourcesActions.patchFailure({ error: errorsVm }) });

      expect(effects.patch$).toBeObservable(expected);
      expect(effects.addGeneralErrorsArguments$).toHaveBeenCalled();
    });
  });
});
