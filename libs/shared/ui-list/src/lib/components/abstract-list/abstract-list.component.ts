import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  FilteringOptions,
  PagingOptions,
  SortingField,
  SortingOptions,
  SortingOrder
} from '@demo/shared/data-access';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: ''
})
export abstract class AbstractListComponent<T> implements OnInit, OnDestroy {
  selection = new SelectionModel<T>(true, []);

  @Input() set gridData(gridData: T[]) {
    this._gridData = gridData;
    this.selection.select(...this.selectedItems);
  }

  get gridData() {
    return this._gridData;
  }

  @Input() isLastPage: boolean;

  @Input() set pagingOptions(pagingOptions: PagingOptions) {
    this.pageNumber = pagingOptions.page;
    this.pageSize = pagingOptions.pageSize;
    this.firstPage = this.pageNumber === 1;
  }

  @Input() set sortingOptions(sortingOptions: SortingOptions) {
    console.log(sortingOptions);
  }

  @Input() set filteringOptions(filteringOptions: FilteringOptions) {
    this._filteringOptions = filteringOptions;
  }

  get filteringOptions(): FilteringOptions {
    return this._filteringOptions;
  }

  @Input() set selectedItems(selectedItems: T[]) {
    this._selectedItems = selectedItems;
    this.selection.select(...this.selectedItems);
  }
  get selectedItems() {
    return this._selectedItems;
  }
  private _selectedItems: T[] = [];

  @Output() sortingChanged = new EventEmitter<SortingField>();
  @Output() filteringChanged = new EventEmitter<FilteringOptions>();
  @Output() refreshPageSelected = new EventEmitter<void>();
  @Output() firstPageSelected = new EventEmitter<void>();
  @Output() previousPageSelected = new EventEmitter<void>();
  @Output() nextPageSelected = new EventEmitter<void>();
  @Output() pageSizeChanged = new EventEmitter<number>();
  @Output() rowSelected = new EventEmitter<T[]>();

  private _filteringOptions: FilteringOptions;
  private _gridData: T[] = [];

  pageNumber = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;
  firstPage = true;

  protected readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    // this.grid.selectRowOnClick = false;

    // this.grid.filteringExpressionsTreeChange.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
    //   this.onFilteringChanged(filteringOptions);
    // });

    this.selection.changed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.rowSelected.emit(this.selection.selected);
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.gridData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.gridData);
  }

  onSortingChanged(sortingField: Sort): void {
    let order = SortingOrder.NONE;

    if (sortingField.direction) {
      order = sortingField.direction === 'asc' ? SortingOrder.ASCENDING : SortingOrder.DESCENDING;
    }

    this.sortingChanged.emit({
      name: sortingField.active,
      order
    });
  }

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.filteringChanged.emit(filteringOptions);
  }

  onRefreshPageSelected(): void {
    this.refreshPageSelected.emit();
  }

  onFirstPageSelected(): void {
    this.onPageChanged(1);
    this.firstPageSelected.emit();
  }

  private onPageChanged(page: number): void {
    this.pageNumber = page;
    this.firstPage = page === 1;
  }

  onPreviousPageSelected(): void {
    this.onPageChanged(this.pageNumber - 1);
    this.previousPageSelected.emit();
  }

  onNextPageSelected(): void {
    this.onPageChanged(this.pageNumber + 1);
    this.nextPageSelected.emit();
  }

  onPageSizeChanged(size: number): void {
    this.pageSize = size;
    this.pageSizeChanged.emit(this.pageSize);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
