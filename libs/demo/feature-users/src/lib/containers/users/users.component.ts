import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FilteringOptions, PagingOptions, SortingField, SortingOptions } from '@demo/shared/data-access';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { listActions } from '../../+state/users/users.actions';
import { listSelectors } from '../../+state/users/users.selectors';
import { UserDto, USERS_RESOURCE_BASE_PATH } from '../../models/user.dto';

@Component({
  selector: 'demo-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users$: Observable<UserDto[]> = this.store.pipe(select(listSelectors.getCurrentPageData));
  totalCount$: Observable<number> = this.store.pipe(select(listSelectors.getTotalCount));
  pagingOptions$: Observable<PagingOptions> = this.store.pipe(select(listSelectors.getPagingOptions), first());
  sortingOptions$: Observable<SortingOptions> = this.store.pipe(select(listSelectors.getSortingOptions), first());
  filteringOptions$: Observable<FilteringOptions> = this.store.pipe(select(listSelectors.getFilteringOptions), first());
  selectedItems$: Observable<UserDto[]> = this.store.pipe(select(listSelectors.getSelected));

  constructor(private readonly router: Router, private readonly store: Store) {}

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.store.dispatch(listActions.changeFiltering({ filteringOptions }));
  }

  onSortingChanged(sortingField: SortingField): void {
    this.store.dispatch(listActions.changeSorting({ sortingField }));
  }

  onPageOptionsChanged(pagingOptions: PagingOptions): void {
    this.store.dispatch(listActions.changePagingOptions({ pagingOptions }));
  }

  onRefreshPageSelected(): void {
    this.store.dispatch(listActions.refresh());
  }

  onRowSelected(users: UserDto[]): void {
    this.store.dispatch(listActions.changeSelected({ selectedResourceIds: users.map(user => user.id) }));
  }

  onCellSelected(resourceId: string): void {
    this.router.navigate([USERS_RESOURCE_BASE_PATH, resourceId]);
  }

  onDelete(): void {
    this.store.dispatch(listActions.showRemovalsConfirmation());
  }
}
