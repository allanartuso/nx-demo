import {
  FilteringLogic,
  FilteringOptions,
  PagingOptions,
  SortingDirection,
  SortingField
} from '@demo/shared/data-model';
import { createSummaries, TestTableComponent } from './abstract-table.component.fixture';

describe('ListComponent', () => {
  let component: TestTableComponent;
  const summaries = createSummaries();

  beforeEach(() => {
    component = new TestTableComponent();
    component.gridData = summaries;
  });

  it('emits an event on refresh page', () => {
    jest.spyOn(component.refreshPageSelected, 'emit');

    component.onRefreshPageSelected();

    expect(component.refreshPageSelected.emit).toHaveBeenCalled();
  });

  describe('sortingOptions', () => {
    it('emits sorting changed event when sorting', () => {
      jest.spyOn(component.sortingChanged, 'emit');
      const sortingField: SortingField = {
        field: 'name',
        direction: SortingDirection.ASCENDING
      };

      component.onSortingChanged(sortingField);

      expect(component.sortingChanged.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('pagingOptions', () => {
    it('emits an event when paging', () => {
      jest.spyOn(component.pageOptionsChanged, 'emit');
      const pagingOptions: PagingOptions = { page: 2, pageSize: 5 };

      component.onPageOptionsChanged(pagingOptions);

      expect(component.pageOptionsChanged.emit).toHaveBeenCalledWith(pagingOptions);
    });
  });

  describe('filteringOptions', () => {
    it('emits an event when filtering', () => {
      jest.spyOn(component.filteringChanged, 'emit');
      const filteringOptions: FilteringOptions = { filters: [], logic: FilteringLogic.AND };

      component.onFilteringChanged(filteringOptions);

      expect(component.filteringChanged.emit).toHaveBeenCalledWith(filteringOptions);
    });
  });

  describe('row selection', () => {
    it('emits an event when selecting a row', () => {
      jest.spyOn(component.rowSelected, 'emit');

      component.onRowSelected(summaries);

      expect(component.rowSelected.emit).toHaveBeenCalledWith(summaries);
    });
  });

  describe('deleteSelected', () => {
    it('emits an event when deleting', () => {
      jest.spyOn(component.deleteSelected, 'emit');

      component.onDelete();

      expect(component.deleteSelected.emit).toHaveBeenCalled();
    });
  });
});
