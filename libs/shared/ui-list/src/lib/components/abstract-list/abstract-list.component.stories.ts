import { DEFAULT_REQUEST_OPTIONS } from '@demo/shared/data-access';
import { Story } from '@storybook/angular';
import {
  AbstractListStorybookModule,
  filteringOptions,
  ListComponent,
  summaries
} from './abstract-list.component.fixture';

export default {
  title: 'ListComponent',
  argTypes: {
    onSortingChanged: { action: 'onSortingChanged' },
    onFilteringChanged: { action: 'onFilteringChanged' },
    onRefreshPageSelected: { action: 'onRefreshPageSelected' },
    onFirstPageSelected: { action: 'onFirstPageSelected' },
    onPreviousPageSelected: { action: 'onPreviousPageSelected' },
    onNextPageSelected: { action: 'onNextPageSelected' },
    onPageSizeChanged: { action: 'onPageSizeChanged' },
    onCellSelected: { action: 'onCellSelected' },
    onRowSelected: { action: 'onRowSelected' },
    i18nScope: { control: false }
  }
};

const template: Story<ListComponent> = args => ({
  moduleMetadata: {
    imports: [AbstractListStorybookModule],
    declarations: []
  },
  template: `
            <demo-list
              [hasManagePermission]="hasManagePermission"
              [gridData]="gridData"
              [isLastPage]="isLastPage"
              [sortingOptions]="sortingOptions"
              [pagingOptions]="pagingOptions"
              [selectedResourceIds]="selectedResourceIds"
              [filteringOptions]="filteringOptions"
              (sortingChanged)="onSortingChanged($event)"
              (filteringChanged)="onFilteringChanged($event)"
              (refreshPageSelected)="onRefreshPageSelected()"
              (firstPageSelected)="onFirstPageSelected()"
              (previousPageSelected)="onPreviousPageSelected()"
              (nextPageSelected)="onNextPageSelected()"
              (pageSizeChanged)="onPageSizeChanged($event)"
              (rowSelected)="onRowSelected($event)"
            ></demo-list>
     `,
  props: args
});

export const DefaultLocationsList = template.bind({});
DefaultLocationsList.args = {
  gridData: summaries,
  isLastPage: false,
  hasManagePermission: true,
  pagingOptions: DEFAULT_REQUEST_OPTIONS.pagingOptions,
  sortingOptions: DEFAULT_REQUEST_OPTIONS.sortingOptions,
  filteringOptions: DEFAULT_REQUEST_OPTIONS.filteringOptions,
  selectedItems: []
} as ListComponent;

export const FilteredLocationsList = template.bind({});
FilteredLocationsList.args = {
  ...DefaultLocationsList.args,
  filteringOptions
} as ListComponent;

export const SelectedLocationsList = template.bind({});
SelectedLocationsList.args = {
  ...DefaultLocationsList.args,
  selectedItems: summaries.slice(2).map(location => location.resourceId)
} as ListComponent;
