jest.mock('../utils/filtering-expression-tree-transformer');
jest.mock('../utils/sorting-expression-transformer');

import { CommonModule } from '@angular/common';
import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedAcmUiCommonVendorsIgniteuiModule } from '@demo/shared/acm/ui/common/vendors/igniteui';
import { MockIgxGridComponent } from '@demo/shared/acm/ui/common/vendors/igniteui/test';
import {
  DEFAULT_REQUEST_OPTIONS,
  FilteringLogic,
  FilteringOptions,
  PagingOptions,
  SortingOptions,
  SortingOrder
} from '@demo/shared/data-access';
import { commonFixture } from '@demo/shared/data-access/test';
import { render, RenderResult, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import 'hammerjs';
import { GridSelectionMode, IgxGridComponent, ISortingExpression, SortingDirection } from 'igniteui-angular';
import {
  transformToFilteringExpressionsTree,
  transformToFilteringOptions
} from '../../utils/filtering-expression-tree-transformer';
import { transformToSortingExpressions, transformToSortingField } from '../../utils/sorting-expression-transformer';
import { DemoCustomPagerComponent } from '../demo-custom-pager/demo-custom-pager.component';
import { createSummaries, ListComponent } from './abstract-list.component.fixture';

describe('ListComponent', () => {
  let component: ListComponent;
  const mockIgxGrid = new MockIgxGridComponent();
  const summaries = createSummaries();

  beforeEach(() => {
    component = new ListComponent();
    component.grid = mockIgxGrid as unknown as IgxGridComponent;
    component.gridData = summaries;
    component.ngOnInit();
  });

  afterAll(() => {
    component.ngOnDestroy();
  });

  it('emits an event on refresh page', () => {
    spyOn(component.refreshPageSelected, 'emit');

    component.onRefreshPageSelected();

    expect(component.refreshPageSelected.emit).toHaveBeenCalled();
  });

  describe('hasManagePermission', () => {
    it('sets has manage permission and row selection mode to multiple when receiving has manage permission true', () => {
      component.hasManagePermission = true;

      expect(component.hasManagePermission).toBe(true);
      expect(component.rowSelectionMode).toBe(GridSelectionMode.multiple);
    });

    it('sets row selection mode to none when receiving has manage permission false', () => {
      component.hasManagePermission = false;

      expect(component.hasManagePermission).toBe(false);
      expect(component.rowSelectionMode).toBe(GridSelectionMode.none);
    });
  });

  describe('sortingOptions', () => {
    it('emits sorting changed event when sorting', () => {
      spyOn(component.sortingChanged, 'emit');
      const sortingExpression: ISortingExpression = {
        fieldName: 'name',
        dir: SortingDirection.Asc
      };

      mockIgxGrid.onSortingDone.next(sortingExpression);

      expect(transformToSortingField).toHaveBeenCalledWith(sortingExpression);
      expect(component.sortingChanged.emit).toHaveBeenCalledTimes(1);
    });

    it('transforms sorting options to sorting expression when receiving sorting options', () => {
      const sortingOptions: SortingOptions = {
        test: { name: 'test', order: SortingOrder.DESCENDING }
      };

      component.sortingOptions = sortingOptions;

      expect(transformToSortingExpressions).toHaveBeenCalledWith(sortingOptions);
    });
  });

  describe('filteringOptions', () => {
    it('emits filtering changed event when filtering', fakeAsync(() => {
      spyOn(component.filteringChanged, 'emit');
      const filteringExpressionsTree: any = {};

      mockIgxGrid.filteringExpressionsTreeChange.next(filteringExpressionsTree);
      tick(300);

      expect(transformToFilteringOptions).toHaveBeenCalledWith(filteringExpressionsTree);
      expect(component.filteringChanged.emit).toHaveBeenCalledTimes(1);
    }));

    it('transforms filtering options to filtering expression when receiving filtering options', () => {
      const filteringOptions: FilteringOptions = {
        logic: FilteringLogic.AND,
        filters: []
      };

      component.filteringOptions = filteringOptions;

      expect((transformToFilteringExpressionsTree as jest.Mock<any, any>).mock.calls[0][0]).toEqual(filteringOptions);
    });
  });

  describe('pagingOptions', () => {
    it('sets page number, page size and first page when receiving paging options', () => {
      const pagingOptions: PagingOptions = { page: 2, pageSize: 5 };

      component.pagingOptions = pagingOptions;

      expect(component.pageNumber).toBe(pagingOptions.page);
      expect(component.pageSize).toBe(pagingOptions.pageSize);
      expect(component.firstPage).toBe(false);
    });

    it('sets first page to true when receiving paging options where page is 1', () => {
      const pagingOptions: PagingOptions = { page: 1, pageSize: 10 };

      component.pagingOptions = pagingOptions;

      expect(component.firstPage).toBe(true);
    });

    it('updates page number and emit an event when selecting first page', () => {
      spyOn(component.firstPageSelected, 'emit');

      component.onFirstPageSelected();

      expect(component.firstPageSelected.emit).toHaveBeenCalled();
      expect(component.pageNumber).toBe(1);
      expect(component.firstPage).toBe(true);
    });

    it('updates page number and emit an event when selecting next page', () => {
      spyOn(component.nextPageSelected, 'emit');
      const pageNumber = component.pageNumber;

      component.onNextPageSelected();

      expect(component.nextPageSelected.emit).toHaveBeenCalled();
      expect(component.pageNumber).toBe(pageNumber + 1);
      expect(component.firstPage).toBe(false);
    });

    it('updates page number and emit an event when selecting previous page', () => {
      spyOn(component.previousPageSelected, 'emit');
      const pageNumber = component.pageNumber;

      component.onPreviousPageSelected();

      expect(component.previousPageSelected.emit).toHaveBeenCalled();
      expect(component.pageNumber).toBe(pageNumber - 1);
    });

    it('updates page size and emit an event when changing paging size', () => {
      spyOn(component.pageSizeChanged, 'emit');
      const pageSize = 5;

      component.onPageSizeChanged(pageSize);

      expect(component.pageSizeChanged.emit).toHaveBeenCalledWith(pageSize);
      expect(component.pageSize).toBe(pageSize);
    });
  });

  describe('row selection', () => {
    it('emits an event when selecting a row', () => {
      spyOn(component.rowSelected, 'emit');
      const resourceId = 'resourceId2';
      const event = { newSelection: [resourceId] };

      component.onRowSelected(event as any);

      expect(component.rowSelected.emit).toHaveBeenCalledWith(event.newSelection);
    });

    it('selects the rows when receiving selected resources', () => {
      const resourceIds = ['resourceId3', 'resourceId4'];

      component.selectedResourceIds = resourceIds;

      expect(mockIgxGrid.selectRows).toHaveBeenCalledWith(resourceIds, true);
    });

    it('selects rows when receiving new resources list', () => {
      const resourceIds = ['resourceId3'];
      component.selectedResourceIds = resourceIds;

      component.gridData = createSummaries();

      expect(mockIgxGrid.selectRows).toHaveBeenCalledWith(resourceIds, true);
    });
  });
});

describe('Locations List Component Test', () => {
  let renderResult: RenderResult<ListComponent, ListComponent>;
  let component: ListComponent;
  const summaries = createSummaries();

  beforeEach(
    waitForAsync(() => {
      render(ListComponent, {
        imports: [NoopAnimationsModule, CommonModule, SharedAcmUiCommonVendorsIgniteuiModule],
        declarations: [DemoCustomPagerComponent],
        componentProperties: {
          hasManagePermission: true,
          gridData: summaries,
          isLastPage: false,
          pagingOptions: DEFAULT_REQUEST_OPTIONS.pagingOptions,
          sortingOptions: DEFAULT_REQUEST_OPTIONS.sortingOptions,
          filteringOptions: DEFAULT_REQUEST_OPTIONS.filteringOptions,
          selectedResourceIds: []
        }
      }).then(result => {
        renderResult = result;
      });
    })
  );

  beforeEach(() => {
    component = renderResult.fixture.componentInstance;
    renderResult.detectChanges();
  });

  it('component test', fakeAsync(() => {
    spyOn(component.rowSelected, 'emit');

    testRowSelection();
  }));

  function testRowSelection() {
    const checkBoxes = screen.getAllByRole('checkbox');
    const rowCheckBoxes = checkBoxes.slice(1);
    const rowIndexes = [0, commonFixture.getNumberInRange(1, rowCheckBoxes.length - 1)];
    const expected = rowIndexes.map(rowIndex => summaries[rowIndex].resourceId);

    rowIndexes.forEach(rowIndex => {
      const row = rowCheckBoxes[rowIndex];
      userEvent.click(row.parentElement);
      expect(row).toBeChecked();
    });

    expect(component.rowSelected.emit).toHaveBeenCalledWith(expected);
  }
});
