import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  FilteringOptions,
  PagingOptions,
  SortingField,
  SortingOptions
} from '@demo/shared/data-access';
import { Subject } from 'rxjs';

@Component({
  template: ''
})
export abstract class AbstractListComponent<T> implements OnInit, OnDestroy {
  @ViewChild('grid', { static: true }) protected grid: any;

  @Input() set gridData(gridData: T[]) {
    this._gridData = gridData;
    // this.grid.selectRows(this.selectedResourceIds, true);
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

  @Input() set selectedResourceIds(selectedResourceIds: string[]) {
    this._selectedResourceIds = selectedResourceIds;
    // this.grid.selectRows(selectedResourceIds, true);
  }
  get selectedResourceIds() {
    return this._selectedResourceIds;
  }
  private _selectedResourceIds: string[] = [];

  @Output() sortingChanged = new EventEmitter<SortingField>();
  @Output() filteringChanged = new EventEmitter<FilteringOptions>();
  @Output() refreshPageSelected = new EventEmitter<void>();
  @Output() firstPageSelected = new EventEmitter<void>();
  @Output() previousPageSelected = new EventEmitter<void>();
  @Output() nextPageSelected = new EventEmitter<void>();
  @Output() pageSizeChanged = new EventEmitter<number>();
  @Output() rowSelected = new EventEmitter<string[]>();

  private _filteringOptions: FilteringOptions;
  private _gridData: T[] = [];

  pageNumber = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;
  firstPage = true;

  protected readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    // this.grid.selectRowOnClick = false;
    // this.grid.onSortingDone.pipe(takeUntil(this.destroy$)).subscribe(() => {
    //   this.sortingChanged.emit(sortingField);
    // });
    // this.grid.filteringExpressionsTreeChange.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
    //   this.onFilteringChanged(filteringOptions);
    // });
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

  onRowSelected(event: any): void {
    this.rowSelected.emit(event.newSelection);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
