import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { listActions, listSelectors } from '@demo/demo/data-access/users';
import { UserDto, USERS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/users';
import { createPersistentUsers } from '@demo/demo/data-model/users/test';
import {
  DEFAULT_FILTERING_LOGIC,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTING_ORDER,
  FilteringOptions,
  PagingOptions,
  SortingDirection,
  SortingField
} from '@demo/shared/data-model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let store: MockStore;
  let router: Router;
  let users: UserDto[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }])],
      declarations: [UsersComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: listSelectors.getCurrentPageData, value: [] },
            { selector: listSelectors.getSelected, value: [] },
            { selector: listSelectors.getTotalCount, value: 5 },
            { selector: listSelectors.getPagingOptions, value: { page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE } },
            {
              selector: listSelectors.getSortingOptions,
              value: { name: { name: 'name', order: DEFAULT_SORTING_ORDER } }
            },
            { selector: listSelectors.getFilteringOptions, value: { logic: DEFAULT_FILTERING_LOGIC, filters: [] } }
          ]
        })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture.detectChanges();

    jest.spyOn(store, 'dispatch');
    users = createPersistentUsers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits load users page action two times when refreshing the page', () => {
    component.onRefreshPageSelected();

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(listActions.refresh());
  });

  it('emits set users page size action when setting the page size', () => {
    const pagingOptions: PagingOptions = { page: 2, pageSize: 5 };

    component.onPageOptionsChanged(pagingOptions);

    expect(store.dispatch).toHaveBeenCalledWith(listActions.changePagingOptions({ pagingOptions }));
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
    const sortingField: SortingField = { field: 'email', direction: SortingDirection.DESCENDING };

    component.onSortingChanged(sortingField);

    expect(store.dispatch).toHaveBeenCalledWith(listActions.changeSorting({ sortingField }));
  });

  it('emits change selected users action when selecting rows', () => {
    const selectedResourceIds: string[] = users.map(user => user.id);

    component.onRowSelected(users);

    expect(store.dispatch).toHaveBeenCalledWith(listActions.changeSelected({ selectedResourceIds }));
  });

  it('emits navigate action when clicking a cell', () => {
    jest.spyOn(router, 'navigate');
    const resourceId = ' testId2';

    component.onCellSelected(resourceId);

    expect(router.navigate).toHaveBeenCalledWith([USERS_RESOURCE_BASE_PATH, resourceId]);
  });
});
