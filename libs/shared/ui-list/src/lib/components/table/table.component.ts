import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { FilteringOptions, SortingField, SortingOptions, SortingOrder } from '@demo/shared/data-access';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableColumns } from '../../models/table.model';

@Component({
  selector: 'demo-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements OnInit, OnDestroy {
  @Input() columns: TableColumns[] = [];
  @Input() totalCount = 0;
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 20, 30, 50];
  @Input() dataSource: T[] = [];
  @Input() allowRowSelection = false;
  @Input() set sortingOptions(sortingOptions: SortingOptions) {
    const firstSort = Object.values(sortingOptions)[0];
    this.sortActive = firstSort?.name;
    this.sortDirection = firstSort?.order;
  }

  @Output() sortingChanged = new EventEmitter<SortingField>();
  @Output() filteringChanged = new EventEmitter<FilteringOptions>();
  @Output() refreshPageSelected = new EventEmitter<void>();
  @Output() pageOptionsChanged = new EventEmitter<PageEvent>();
  @Output() rowSelected = new EventEmitter<T[]>();
  @Output() deleteSelected = new EventEmitter<void>();
  @Output() cellSelected = new EventEmitter<T>();

  sortActive: string;
  sortDirection: SortDirection;
  selection = new SelectionModel<T>(true, []);

  get displayedColumns(): string[] {
    const displayedColumns = [...this.columns.map(column => column.key)];
    if (this.allowRowSelection) {
      displayedColumns.unshift('select');
    }

    return displayedColumns;
  }

  protected readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.selection.changed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.rowSelected.emit(this.selection.selected);
    });
  }

  clearSelection(): void {
    this.selection.clear();
  }

  selectItems(items: T[]): void {
    this.selection.select(...items);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  onSortingChanged(sortingField: Sort): void {
    this.sortingChanged.emit({
      name: sortingField.active,
      order: sortingField.direction as SortingOrder
    });
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

  onCellSelected(item: T): void {
    this.cellSelected.emit(item);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
