import { Component, NgModule, ViewChild } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedAcmUiCommonVendorsIgniteuiModule } from '@demo/shared/acm/ui/common/vendors/igniteui';
import { DEFAULT_FILTERING_LOGIC, FilteringOperator } from '@demo/shared/data-access';
import { commonFixture } from '@demo/shared/data-access/test';
import { IgxGridComponent } from 'igniteui-angular';
import { customPagerSelectors } from '../../lists.fixture';
import { getStringFilteringOperations } from '../../utils/filtering-operation';
import { DemoCustomPagerComponent } from '../demo-custom-pager/demo-custom-pager.component';
import { AbstractListComponent } from './abstract-list.component';

export interface Summary {
  resourceId: string;
  name: string;
  count: number;
}

export const listTestIds = {
  nameCountColumn: 'name-grid-column',
  memberCountColumn: 'memberCount-grid-column',
  ...customPagerSelectors
};

@Component({
  selector: 'demo-list',
  template: `<igx-grid
      #grid
      width="100%"
      height="auto"
      [autoGenerate]="false"
      [data]="gridData"
      [paging]="true"
      [perPage]="pageSize"
      [primaryKey]="'resourceId'"
      [rowSelection]="rowSelectionMode"
      [cellSelection]="cellSelectionMode"
      [filterStrategy]="filterStrategy"
      [sortStrategy]="sortStrategy"
      [allowFiltering]="true"
      [paginationTemplate]="pagination"
      (onRowSelectionChange)="onRowSelected($event)"
    >
      <igx-column field="name" header="Name" [sortable]="true" [filters]="nameFilteringOperations" dataType="string">
      </igx-column>

      <igx-column field="count" header="Count" [sortable]="true" dataType="number"> </igx-column>
    </igx-grid>

    <ng-template #pagination>
      <demo-custom-pager
        [pageNumber]="pageNumber"
        [pageSize]="pageSize"
        [firstPage]="firstPage"
        [lastPage]="isLastPage"
        (refreshPageSelected)="onRefreshPageSelected()"
        (firstPageSelected)="onFirstPageSelected()"
        (previousPageSelected)="onPreviousPageSelected()"
        (nextPageSelected)="onNextPageSelected()"
        (pageSizeChanged)="onPageSizeChanged($event)"
      ></demo-custom-pager>
    </ng-template>`
})
export class ListComponent extends AbstractListComponent<Summary> {
  @ViewChild('grid', { static: true }) grid: IgxGridComponent;

  nameFilteringOperations = getStringFilteringOperations();
}

export const summaries = createSummaries(101);

export function createSummaries(nbOfOrganizationRestrictionSummaries = 3): Summary[] {
  const result: Summary[] = [];

  for (let i = 0; i < nbOfOrganizationRestrictionSummaries; i++) {
    result.push(createSummary());
  }

  return result;
}

function createSummary(
  resourceId: string = commonFixture.getWord(),
  name: string = commonFixture.getWord(),
  count: number = commonFixture.getNumberInRange(1, 10)
): Summary {
  return {
    resourceId,
    name,
    count
  };
}

export const filteringOptions = {
  logic: DEFAULT_FILTERING_LOGIC,
  filters: [
    {
      logic: DEFAULT_FILTERING_LOGIC,
      filters: [
        {
          field: 'name',
          value: 'test',
          operator: FilteringOperator.StartsWith
        }
      ]
    }
  ]
};

@NgModule({
  imports: [BrowserAnimationsModule, SharedAcmUiCommonVendorsIgniteuiModule],
  declarations: [ListComponent, DemoCustomPagerComponent],
  exports: [ListComponent]
})
export class AbstractListStorybookModule {}
