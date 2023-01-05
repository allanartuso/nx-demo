/* eslint-disable @typescript-eslint/ban-types */
import { HttpClient, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@ngdux/data-model-common';
import { Observable } from 'rxjs';

/**
 * Provides common Rest service functionality to load, query, create, update, patch and delete resources.
 * The API base URL can be provided at service creation. Whenever accessing a resource, the resource path
 * needs to be provided and it is appended to the API base URL.
 * Note: You have to ensure that the resource path appended to the API base URL results in a valid URL.
 */
export abstract class AbstractRestService {
  /**
   * Creates a new service instance.
   *
   * @param http The angular http client.
   *             Must never be null or undefined.
   * @param apiBaseUrl The backend API base URL.
   *                   Defaults to an empty string if no value is provided.
   */
  protected constructor(private readonly http: HttpClient, private readonly apiBaseUrl: string = '') {}

  /**
   * Loads the resource from the given resource path of the API.
   * The given resource path is appended to the API base URL if it has been provided at service creation.
   *
   * @param resourcePath The path to the resource to load.
   *                     Defaults to an empty string if no value is provided.
   * @returns An observable that emits the loaded resource.
   */
  public loadResource<T>(resourcePath = ''): Observable<T> {
    const url = this.createUrl(resourcePath);
    return this.http.get<T>(url);
  }

  protected createUrl(resourcePath: string): string {
    return `${this.apiBaseUrl}/${resourcePath}`;
  }

  /**
   * Loads all the resources from the given resource path that match the given request options.
   * The given resource path is appended to the API base URL if it has been provided at service creation.
   * The given request options can contain values for all sorts of request parameters such as for example paging,
   * sorting or filter parameters.
   *
   * @param resourcePath The path to the resources to load.
   *                     Defaults to an empty string if no value is provided.
   * @param options The request options from which the request parameters are built.
   *                Defaults to an empty object if no options are provided.
   * @returns An observable that emits the loaded resources.
   */
  public loadResources<T>(resourcePath = '', options: RequestOptions = {}): Observable<T[]> {
    const url = this.createUrl(resourcePath);
    const requestParameters = {
      params: new HttpParams({
        fromObject: this.createRequestParameters(options)
      })
    };

    return this.http.get<T[]>(url, requestParameters);
  }

  /**
   * Creates the request parameters from the given request options.
   *
   * @param options The request options used to create the request parameters.
   *                They are already validated and no further checks need to be implemented.
   *                Must never be null or undefined. Can be an empty object.
   * @returns The request parameters extracted from the given request options.
   *          This must never be null or undefined.
   *          Return an empty object if no request parameters can be created.
   */
  protected abstract createRequestParameters(options: RequestOptions): Record<string, string>;

  /**
   * Queries all the resources from the given resource path that match the given request options.
   * The given resource path is appended to the API base URL if it has been provided at service creation.
   *
   * @param resourcePath The path to the resources to query.
   *                     Defaults to an empty string if no value is provided.
   * @param options The request options from which the request query is built.
   *                Defaults to an empty object if no options are provided.
   * @returns An observable that emits the queried resources.
   */
  public queryResources<T>(resourcePath = '', options: RequestOptions = {}): Observable<T[]> {
    const url = this.createUrl(resourcePath);
    const requestQuery = this.createRequestQuery(options);

    return this.http.post<T[]>(url, requestQuery);
  }

  /**
   * Creates a request query object to be used in an HTTP POST request.
   * Complex resource query object tailored to the API used can be created by subclasses implementing this function.
   *
   * @param options The request options used to create the resource query object.
   *                Is never null or undefined. Can be an empty object.
   * @returns The request query object. This must never be null or undefined.
   *          Return an empty object if no query object can be created.
   */
  protected abstract createRequestQuery(options: RequestOptions): object;

  /**
   * Creates the given resource at the given resource path.
   * The given resource path is appended to the API base URL if it has been provided at service creation.
   *
   * @param resourcePath The resource path where the new resource is created.
   *                     Defaults to an empty string if no value is provided.
   * @param dto The resource to be created.
   *            Must never be null or undefined.
   * @returns An observable that emits the created resource.
   */
  public createResource<T, C>(resourcePath = '', dto: C): Observable<T> {
    const url = this.createUrl(resourcePath);
    return this.http.post<T>(url, dto);
  }

  /**
   * Creates the given resources at the given resource path.
   * The given resource path is appended to the API base URL if it has been provided at service creation.
   *
   * @param resourcePath The resource path where the new resource is created.
   *                     Defaults to an empty string if no value is provided.
   * @param dtos The resources to be created.
   *             Must never be null or undefined.
   * @returns An observable that emits the created resources.
   */
  public createResources<T, C>(resourcePath = '', dtos: C[]): Observable<T[]> {
    const url = this.createUrl(resourcePath);
    return this.http.post<T[]>(url, dtos);
  }

  /**
   * Updates the resource at the given resource path with the given changes.
   * The given resource path is appended to the API base URL if it has been provided at service creation.
   *
   * @param resourcePath The path to the resource to update.
   *                     Defaults to an empty string if no value is provided.
   * @param dto The updated values to apply to the resource.
   *            Must never be null or undefined.
   * @returns An observable that emits the updated resource.
   */
  public updateResource<T, U>(resourcePath = '', dto: U): Observable<T> {
    const url = this.createUrl(resourcePath);
    return this.http.put<T>(url, dto);
  }

  /**
   * Updates the resources at the given resource path with the given changes.
   * The given resource path is appended to the API base URL if it has been provided at service creation.
   *
   * @param resourcePath The path to the resources to update.
   *                     Defaults to an empty string if no value is provided.
   * @param dtos The updated values to apply to the resources.
   *            Must never be null or undefined.
   * @returns An observable that emits the updated resources.
   */
  public updateResources<T, U>(resourcePath = '', dtos: U[]): Observable<T[]> {
    const url = this.createUrl(resourcePath);
    return this.http.put<T[]>(url, dtos);
  }

  /**
   * Patches the resource at the given resource path with the given changes.
   * The given resource path is appended to the API base URL if it has been provided at service creation.
   *
   * @param resourcePath The path to the resource to patch.
   *                     Defaults to an empty string if no value is provided.
   * @param dto The patched values to apply to the resource.
   *            Must never be null or undefined.
   * @returns An observable that emits the patched resource.
   */
  public patchResource<T, P>(resourcePath = '', dto: P): Observable<T> {
    const url = this.createUrl(resourcePath);
    return this.http.patch<T>(url, dto);
  }

  /**
   * Patches the given resources at the given resource path with the given changes.
   * The given resource path is appended to the API base URL if it has been provided at service creation.
   *
   * @param resourcePath The path to the resources to patch.
   *                     Defaults to an empty string if no value is provided.
   * @param dtos The patched values to apply to the resources.
   *             Must never be null or undefined.
   * @returns An observable that emits the patched resources.
   */
  public patchResources<T, P>(resourcePath: string = '', dtos: P[]): Observable<T[]> {
    const url = this.createUrl(resourcePath);
    return this.http.patch<T[]>(url, dtos);
  }

  /**
   * Deletes the resource at the given resource path.
   * The given resource path is appended to the API base URL if it has been provided at service creation.
   *
   * @param resourcePath The path to the resource to be deleted.
   *                     Defaults to an empty string if no value is provided.
   * @returns An observable that emits the deleted resource.
   */
  public deleteResource<T>(resourcePath = ''): Observable<T> {
    const url = this.createUrl(resourcePath);
    return this.http.delete<T>(url);
  }

  /**
   * Deletes the given resources at the given resource path.
   * The given resource path is appended to the API base URL if it has been provided at service creation.
   *
   * @param resourcePath The path to the resource to be deleted.
   *                     Defaults to an empty string if no value is provided.
   * @param resourceIds The list of resources to delete.
   *                    Must never be null or undefined.
   * @returns An observable that emits the deleted resources.
   */
  public deleteResources<T>(resourcePath: string = '', resourceIds: string[]): Observable<T[]> {
    const url = this.createUrl(resourcePath);
    return this.http.request<T[]>('delete', url, { body: resourceIds });
  }
}
