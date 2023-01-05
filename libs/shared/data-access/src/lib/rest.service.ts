import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@demo/shared/util-configuration';
import {
  FilteringField,
  FilteringOptions,
  PagingOptions,
  RequestOptions,
  SortingDirection,
  SortingOptions
} from '@ngdux/data-model-common';
import { Observable } from 'rxjs';
import { AbstractRestService } from './abstract-rest.service';

@Injectable({ providedIn: 'root' })
export class RestService extends AbstractRestService {
  constructor(http: HttpClient, configurationService: ConfigurationService) {
    const configuration = configurationService.getConfiguration();
    super(http, configuration?.apiBaseUrl);
  }

  public override loadResource<T>(resourcePath: string): Observable<T> {
    return super.loadResource<T>(resourcePath);
  }

  public override loadResources<T>(resourcePath: string, options: RequestOptions = {}): Observable<T[]> {
    return super.loadResources<T>(resourcePath, options);
  }

  protected createRequestParameters(options: RequestOptions): Record<string, string> {
    return {
      ...(options.requestParameters || {}),
      ...this.getPagingParameters(options.pagingOptions),
      ...this.getSortingParameters(options.sortingOptions),
      ...this.getFilteringParameters(options.filteringOptions)
    };
  }

  private getPagingParameters(options: PagingOptions): Record<string, string> {
    const pagingParameters: Record<string, string> = {};

    if (options) {
      pagingParameters['page'] = options.page.toString();
      pagingParameters['pageSize'] = options.pageSize.toString();
    }

    return pagingParameters;
  }

  private getSortingParameters(options: SortingOptions): Record<string, string> {
    const sortingParameters: Record<string, string> = {};

    if (options) {
      const fieldNames = Object.keys(options)
        .filter(fieldName => options[fieldName].direction !== SortingDirection.NONE)
        .map(fieldName => (options[fieldName].direction === SortingDirection.DESCENDING ? `-${fieldName}` : fieldName));

      if (fieldNames.length > 0) {
        sortingParameters['sort'] = fieldNames.join();
      }
    }

    return sortingParameters;
  }

  private getFilteringParameters(options: FilteringOptions): Record<string, string> {
    const filteringParameters: Record<string, string> = {};

    if (options) {
      (options.filters as FilteringField[]).forEach((filter: FilteringField) => {
        filteringParameters[filter.field] = filter.value;
      });
    }

    return filteringParameters;
  }

  public override queryResources<T>(resourcePath = '', options: RequestOptions = {}): Observable<T[]> {
    return super.queryResources<T>(`${resourcePath}/query`, options);
  }

  protected createRequestQuery(options: RequestOptions) {
    return {
      ...(options.requestParameters || {}),
      ...(options.pagingOptions || {}),
      ...this.getSortingQuery(options.sortingOptions),
      ...this.getFilteringQuery(options.filteringOptions)
    };
  }

  private getSortingQuery(options: SortingOptions) {
    if (!options || Object.keys(options).length === 0) {
      return {};
    }

    return {
      sort: Object.keys(options)
        .filter(fieldName => options[fieldName].direction !== SortingDirection.NONE)
        .map(fieldName => {
          return {
            field: fieldName,
            direction: options[fieldName].direction === SortingDirection.ASCENDING ? 'asc' : 'desc'
          };
        })
    };
  }

  private getFilteringQuery(options: FilteringOptions) {
    if (!options || options.filters.length === 0) {
      return {};
    }

    return { filter: options };
  }

  public override createResource<T, C = T>(resourcePath: string, dto: C): Observable<T> {
    return super.createResource<T, C>(resourcePath, dto);
  }

  public override createResources<T, C = T>(resourcePath: string, dtos: C[]): Observable<T[]> {
    return super.createResources<T, C>(`${resourcePath}/bulk`, dtos);
  }

  public override updateResource<T, U = T>(resourcePath: string, dto: U): Observable<T> {
    return super.updateResource<T, U>(resourcePath, dto);
  }

  public override updateResources<T, U = T>(resourcePath: string, dtos: U[]): Observable<T[]> {
    return super.updateResources<T, U>(`${resourcePath}/bulk`, dtos);
  }

  public override patchResource<T, P>(resourcePath: string, dto: P): Observable<T> {
    return super.patchResource<T, P>(resourcePath, dto);
  }

  public override patchResources<T, P>(resourcePath: string, dtos: P[]): Observable<T[]> {
    return super.patchResources<T, P>(`${resourcePath}/bulk`, dtos);
  }

  public override deleteResource<T>(resourcePath: string): Observable<T> {
    return super.deleteResource<T>(resourcePath);
  }

  public override deleteResources<T>(resourcePath: string, resourceIds: string[]): Observable<T[]> {
    return super.deleteResources<T>(`${resourcePath}/bulk`, resourceIds);
  }
}
