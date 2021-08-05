import { Directive, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  FilteringOptions,
  PagingOptions,
  SortingField,
  SortingOptions
} from '@demo/shared/data-access';
import { ListComponent } from '../list/list.component';

@Directive()
export abstract class AbstractListComponent<T> {
  @ViewChild('table') table: ListComponent<T>;

  @Input() totalCount: number;
  @Input() sortingOptions: SortingOptions;
  @Input() filteringOptions: FilteringOptions;

  @Input() set gridData(gridData: T[]) {
    this._gridData = gridData;
    this.table?.clearSelection();
  }
  get gridData() {
    return this._gridData;
  }
  private _gridData: T[] = [];

  @Input() set selectedItems(selectedItems: T[]) {
    this._selectedItems = selectedItems;
    this.table?.selectItems(this.selectedItems);
  }
  get selectedItems() {
    return this._selectedItems;
  }
  private _selectedItems: T[] = [];

  @Input() set pagingOptions(pagingOptions: PagingOptions) {
    this.pageNumber = pagingOptions.page;
    this.pageSize = pagingOptions.pageSize;
  }

  @Output() sortingChanged = new EventEmitter<SortingField>();
  @Output() filteringChanged = new EventEmitter<FilteringOptions>();
  @Output() refreshPageSelected = new EventEmitter<void>();
  @Output() pageOptionsChanged = new EventEmitter<PageEvent>();
  @Output() rowSelected = new EventEmitter<T[]>();
  @Output() deleteSelected = new EventEmitter<void>();

  pageNumber = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;

  onSortingChanged(sortingField: SortingField): void {
    this.sortingChanged.emit(sortingField);
  }

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.filteringChanged.emit(filteringOptions);
  }

  onRefreshPageSelected(): void {
    this.refreshPageSelected.emit();
  }

  onPageEvent(pageEvent: PageEvent): void {
    this.pageOptionsChanged.emit(pageEvent);
  }

  onDelete(): void {
    this.deleteSelected.emit();
  }

  onRowSelected(selectedItems: T[]): void {
    this.rowSelected.emit(selectedItems);
  }
}
