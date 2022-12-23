export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_STORED_PAGES = 3;

/**
 * The options required to make a resource request for paged resources.
 * This defines which page and how many resources per page to return.
 */
export interface PagingOptions {
  page: number;
  pageSize: number;
}
