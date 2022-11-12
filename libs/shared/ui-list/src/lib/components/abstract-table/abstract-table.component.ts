import { Directive, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FilteringOptions, PagingOptions, SortingField, SortingOptions } from '@demo/shared/data-model';
import { TableComponent } from '../table/table.component';

@Directive()
export abstract class AbstractTableComponent<T> {
  @ViewChild('table') table: TableComponent<T>;

  @Input() totalCount: number;
  @Input() sortingOptions: SortingOptions;
  @Input() filteringOptions: FilteringOptions;
  @Input() pagingOptions: PagingOptions;

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

  // TODO: should emit the same that was received => SortingOptions
  @Output() sortingChanged = new EventEmitter<SortingField>();
  @Output() filteringChanged = new EventEmitter<FilteringOptions>();
  @Output() refreshPageSelected = new EventEmitter<void>();
  @Output() pageOptionsChanged = new EventEmitter<PagingOptions>();
  @Output() rowSelected = new EventEmitter<T[]>();
  @Output() deleteSelected = new EventEmitter<void>();

  onSortingChanged(sortingField: SortingField): void {
    this.sortingChanged.emit(sortingField);
  }

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.filteringChanged.emit(filteringOptions);
  }

  onRefreshPageSelected(): void {
    this.refreshPageSelected.emit();
  }

  onPageOptionsChanged(pagingOptions: PagingOptions): void {
    this.pageOptionsChanged.emit(pagingOptions);
  }

  onDelete(): void {
    this.deleteSelected.emit();
  }

  onRowSelected(selectedItems: T[]): void {
    this.rowSelected.emit(selectedItems);
  }
}
