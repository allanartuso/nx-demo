import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createResourceId, getResourceRoutePath } from '@demo/shared/acm/data-access/common';
import { USERS_RESOURCE_BASE_PATH } from '@demo/shared/acm/data-access/users';
import {
  DEFAULT_FILTERING_LOGIC,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTING_ORDER,
  FilteringOptions,
  SortingField,
  SortingOrder
} from '@demo/shared/data-access';
import { AuthorizationService } from '@demo/shared/util-authorization';
import { getI18nTestingModule } from '@demo/shared/util-i18n/test';
import { navigateToAction } from '@demo/shared/util-router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { listActions } from '../../+state/users/users.actions';
import { listSelectors } from '../../+state/users/users.selectors';
import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let store: MockStore;
  const mockAuthorizationService: Partial<AuthorizationService> = {
    hasPermission$: jest.fn().mockReturnValue(of(true))
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, getI18nTestingModule()],
        declarations: [UsersComponent],
        providers: [
          { provide: AuthorizationService, useValue: mockAuthorizationService },
          provideMockStore({
            selectors: [
              {
                selector: listSelectors.getSelectedResourceIds,
                value: []
              },
              {
                selector: listSelectors.isLastPage,
                value: true
              },
              {
                selector: listSelectors.getPagingOptions,
                value: {
                  page: DEFAULT_PAGE,
                  pageSize: DEFAULT_PAGE_SIZE
                }
              },
              {
                selector: listSelectors.getCurrentPageData,
                value: []
              },
              {
                selector: listSelectors.getSortingOptions,
                value: {
                  name: {
                    name: 'name',
                    order: DEFAULT_SORTING_ORDER
                  }
                }
              },
              {
                selector: listSelectors.getFilteringOptions,
                value: {
                  logic: DEFAULT_FILTERING_LOGIC,
                  filters: []
                }
              }
            ]
          })
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits load users page action two times when refreshing the page', () => {
    component.onRefreshPageSelected();

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(listActions.refresh());
  });

  it('emits load users first page action when selecting the first page', () => {
    component.onFirstPageSelected();

    expect(store.dispatch).toHaveBeenCalledWith(listActions.loadFirstPage());
  });

  it('emits load users page next action when selecting the next page', () => {
    component.onNextPageSelected();

    expect(store.dispatch).toHaveBeenCalledWith(listActions.loadNextPage());
  });

  it('emits load users page back action when selecting the previous page', () => {
    component.onPreviousPageSelected();

    expect(store.dispatch).toHaveBeenCalledWith(listActions.loadPreviousPage());
  });

  it('emits set users page size action when setting the page size', () => {
    const size = 10;

    component.onPageSizeChanged(size);

    expect(store.dispatch).toHaveBeenCalledWith(listActions.changePageSize({ pageSize: size }));
  });

  it('emits change users filtering action when filtering', () => {
    const filteringOptions: FilteringOptions = {
      logic: DEFAULT_FILTERING_LOGIC,
      filters: []
    };

    component.onFilteringChanged(filteringOptions);

    expect(store.dispatch).toHaveBeenCalledWith(listActions.changeFiltering({ filteringOptions }));
  });

  it('emits change users sorting action when sorting', () => {
    const sortingField: SortingField = { name: 'email', order: SortingOrder.DESCENDING };

    component.onSortingChanged(sortingField);

    expect(store.dispatch).toHaveBeenCalledWith(listActions.changeSorting({ sortingField }));
  });

  it('emits change selected users action when selecting rows', () => {
    const selectedResourceIds: string[] = [
      createResourceId(2, USERS_RESOURCE_BASE_PATH, 2),
      createResourceId(2, USERS_RESOURCE_BASE_PATH, 3),
      createResourceId(2, USERS_RESOURCE_BASE_PATH, 4)
    ];

    component.onRowSelected(selectedResourceIds);

    expect(store.dispatch).toHaveBeenCalledWith(listActions.changeSelected({ selectedResourceIds }));
  });

  it('emits navigate action when clicking a cell', () => {
    const resourceId = createResourceId(2, USERS_RESOURCE_BASE_PATH, 2);

    component.onNameCellSelected(resourceId);

    expect(store.dispatch).toHaveBeenCalledWith(navigateToAction({ path: getResourceRoutePath(resourceId) }));
  });
});
