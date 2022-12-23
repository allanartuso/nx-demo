import { Component, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DEFAULT_FILTERING_LOGIC, FilteringOperator } from '@demo/shared/data-model/common';
import { commonFixture } from '@demo/shared/data-model/test';
import { TableColumn } from '../../models/table.model';
import { SharedUiListModule } from '../../shared-ui-list.module';
import { AbstractTableComponent } from './abstract-table.component';

export interface Summary {
  id: string;
  name: string;
  count: number;
}

@Component({
  selector: 'demo-list',
  template: `<demo-table
    #table
    [dataSource]="gridData"
    [sortingOptions]="sortingOptions"
    [columns]="columns"
    [totalCount]="totalCount"
    [pagingOptions]="pagingOptions"
    [allowRowSelection]="true"
    (sortingChanged)="onSortingChanged($event)"
    (deleteSelected)="onDelete()"
    (rowSelected)="onRowSelected($event)"
    (pageOptionsChanged)="onPageOptionsChanged($event)"
  >
  </demo-table>`
})
export class TestTableComponent extends AbstractTableComponent<Summary> {
  columns: TableColumn[] = [
    { key: 'id', name: 'Id' },
    { key: 'name', name: 'Name' },
    { key: 'count', name: 'Count' }
  ];
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
  id: string = commonFixture.getWord(),
  name: string = commonFixture.getWord(),
  count: number = commonFixture.getNumberInRange(1, 10)
): Summary {
  return {
    id,
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
  imports: [BrowserAnimationsModule, SharedUiListModule],
  declarations: [TestTableComponent],
  exports: []
})
export class AbstractListStorybookModule {}
