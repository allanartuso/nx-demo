import { HttpClient, HttpParams } from '@angular/common/http';
import { RequestOptions } from '@demo/shared/data-model/common';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { AbstractRestService } from './abstract-rest.service';

interface TestResource {
  id?: string;
  name: string;
  value: number;
}

const TEST_API_BASE_URL = 'https://testapi:3000/baseurl';
const EXPECTED_RESOURCES: TestResource[] = [
  {
    name: 'name1',
    value: 1
  },
  {
    name: 'name2',
    value: 2
  }
];

class TestRestService extends AbstractRestService {
  constructor(http: HttpClient, apiBaseUrl?: string) {
    super(http, apiBaseUrl);
  }

  createRequestParameters = jest.fn().mockReturnValue({});
  createRequestQuery = jest.fn().mockReturnValue({});
}

describe('AbstractRestService', () => {
  let restService: TestRestService;
  let httpMock: Partial<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      request: jest.fn()
    };

    restService = new TestRestService(httpMock as HttpClient, TEST_API_BASE_URL);
  });

  describe('loadResource', () => {
    let expectedResourcePath: string;
    let expectedResource: TestResource;

    beforeEach(() => {
      expectedResourcePath = '1/tests/42';
      expectedResource = EXPECTED_RESOURCES[0];
      httpMock.get = jest.fn().mockReturnValue(of(expectedResource));
    });

    it('loads resource from correct URL when a resource path and no API base URL is provided', () => {
      const expectedResource$ = cold('(r|)', { r: expectedResource });
      restService = new TestRestService(httpMock as HttpClient);

      const actualResource$ = restService.loadResource(expectedResourcePath);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.get).toHaveBeenCalledWith(`/${expectedResourcePath}`);
    });

    it('loads resource from correct URL when a resource path is provided', () => {
      const expectedResource$ = cold('(r|)', { r: expectedResource });

      const actualResource$ = restService.loadResource(expectedResourcePath);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.get).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/${expectedResourcePath}`);
    });

    it('loads resource from correct URL when no resource path is provided', () => {
      const expectedResource$ = cold('(r|)', { r: expectedResource });

      const actualResource$ = restService.loadResource();

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.get).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/`);
    });
  });

  describe('loadResources', () => {
    let expectedResourcePath: string;
    let expectedResources: TestResource[];
    const defaultRequestOptions: RequestOptions = {
      pagingOptions: {
        page: 1,
        pageSize: 100
      }
    };
    const emptyHttpParams = {
      params: new HttpParams({
        fromObject: {}
      })
    };

    beforeEach(() => {
      expectedResourcePath = '2/tests';
      expectedResources = EXPECTED_RESOURCES;
      httpMock.get = jest.fn().mockReturnValue(of(EXPECTED_RESOURCES));
    });

    it('loads resources from correct URL and creates no request parameters when no resource path and no request options are provided', () => {
      const expectedResources$ = cold('(r|)', { r: expectedResources });

      const actualResources$ = restService.loadResources();

      expect(actualResources$).toBeObservable(expectedResources$);
      expect(httpMock.get).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/`, emptyHttpParams);
      expect(restService.createRequestParameters).toHaveBeenCalledWith({});
    });

    it('loads resources from correct URL and creates no request parameters when no request options are provided', () => {
      const expectedResources$ = cold('(r|)', { r: expectedResources });

      const actualResources$ = restService.loadResources(expectedResourcePath);

      expect(actualResources$).toBeObservable(expectedResources$);
      expect(httpMock.get).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/${expectedResourcePath}`, emptyHttpParams);
      expect(restService.createRequestParameters).toHaveBeenCalledWith({});
    });

    it('loads resources from correct URL and creates request parameters when request options are provided', () => {
      const expectedResources$ = cold('(r|)', { r: expectedResources });

      const actualResources$ = restService.loadResources(expectedResourcePath, defaultRequestOptions);

      expect(actualResources$).toBeObservable(expectedResources$);
      expect(httpMock.get).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/${expectedResourcePath}`, emptyHttpParams);
      expect(restService.createRequestParameters).toHaveBeenCalledWith(defaultRequestOptions);
    });
  });

  describe('queryResources', () => {
    let expectedResourcePath: string;
    let expectedResources: TestResource[];
    const defaultRequestOptions: RequestOptions = {
      pagingOptions: {
        page: 2,
        pageSize: 100
      }
    };

    beforeEach(() => {
      expectedResourcePath = '3/tests';
      expectedResources = EXPECTED_RESOURCES;
      httpMock.post = jest.fn().mockReturnValue(of(EXPECTED_RESOURCES));
    });

    it('queries resources from correct URL and creates no request query when no resource path and no request options are provided', () => {
      const expectedResources$ = cold('(r|)', { r: expectedResources });

      const actualResources$ = restService.queryResources();

      expect(actualResources$).toBeObservable(expectedResources$);
      expect(httpMock.post).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/`, {});
      expect(restService.createRequestQuery).toHaveBeenCalledWith({});
    });

    it('queries resources from correct URL and creates no request query when no request options are provided', () => {
      const expectedResources$ = cold('(r|)', { r: expectedResources });

      const actualResources$ = restService.queryResources(expectedResourcePath);

      expect(actualResources$).toBeObservable(expectedResources$);
      expect(httpMock.post).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/${expectedResourcePath}`, {});
      expect(restService.createRequestQuery).toHaveBeenCalledWith({});
    });

    it('queries resources from correct URL and creates request query when request options are provided', () => {
      const expectedResources$ = cold('(r|)', { r: expectedResources });

      const actualResources$ = restService.queryResources(expectedResourcePath, defaultRequestOptions);

      expect(actualResources$).toBeObservable(expectedResources$);
      expect(httpMock.post).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/${expectedResourcePath}`, {});
      expect(restService.createRequestQuery).toHaveBeenCalledWith(defaultRequestOptions);
    });
  });

  describe('createResource', () => {
    let expectedResourcePath: string;
    let expectedResource: TestResource;

    beforeEach(() => {
      expectedResourcePath = '4/tests/32';
      expectedResource = {
        name: 'name42',
        value: 42
      };
      httpMock.post = jest.fn().mockReturnValue(of(expectedResource));
    });

    it('creates the given resource at the correct URL when a resource path and a resource are provided', () => {
      const expectedResource$ = cold('(r|)', { r: expectedResource });

      const actualResource$ = restService.createResource(expectedResourcePath, expectedResource);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.post).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/${expectedResourcePath}`, expectedResource);
    });

    it('creates the given resource at the correct URL when no resource path and a resource are provided', () => {
      const expectedResource$ = cold('(r|)', { r: expectedResource });

      const actualResource$ = restService.createResource(undefined, expectedResource);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.post).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/`, expectedResource);
    });
  });

  describe('updateResource', () => {
    let expectedResourcePath: string;
    let expectedResource: TestResource;

    beforeEach(() => {
      expectedResourcePath = '5/tests/37';
      expectedResource = {
        name: 'name41',
        value: 41
      };
      httpMock.put = jest.fn().mockReturnValue(of(expectedResource));
    });

    it('updates the given resource at the correct URL when a resource path and a resource are provided', () => {
      const expectedResource$ = cold('(r|)', { r: expectedResource });

      const actualResource$ = restService.updateResource(expectedResourcePath, expectedResource);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.put).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/${expectedResourcePath}`, expectedResource);
    });

    it('updates the given resource at the correct URL when no resource path and a resource are provided', () => {
      const expectedResource$ = cold('(r|)', { r: expectedResource });

      const actualResource$ = restService.updateResource(undefined, expectedResource);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.put).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/`, expectedResource);
    });
  });

  describe('patchResource', () => {
    let expectedResourcePath: string;
    let expectedResource: TestResource;

    beforeEach(() => {
      expectedResourcePath = '6/tests/32';
      expectedResource = {
        name: 'name62',
        value: 62
      };
      httpMock.patch = jest.fn().mockReturnValue(of(expectedResource));
    });

    it('patches the given resource at the correct URL when a resource path and a resource are provided', () => {
      const expectedResource$ = cold('(r|)', { r: expectedResource });

      const actualResource$ = restService.patchResource(expectedResourcePath, expectedResource);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.patch).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/${expectedResourcePath}`, expectedResource);
    });

    it('patches the given resource at the correct URL when no resource path and a resource are provided', () => {
      const expectedResource$ = cold('(r|)', { r: expectedResource });

      const actualResource$ = restService.patchResource(undefined, expectedResource);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.patch).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/`, expectedResource);
    });
  });

  describe('patchResources', () => {
    let expectedResourcePath: string;
    let expectedResource: TestResource;

    beforeEach(() => {
      expectedResourcePath = '6/tests/32';
      expectedResource = {
        name: 'name62',
        value: 62
      };
      httpMock.patch = jest.fn().mockReturnValue(of([expectedResource]));
    });

    it('patches the given resources at the correct URL when a resource path and a resource are provided', () => {
      const expectedResource$ = cold('(r|)', { r: [expectedResource] });

      const actualResource$ = restService.patchResources(expectedResourcePath, [expectedResource]);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.patch).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/${expectedResourcePath}`, [expectedResource]);
    });

    it('patches the given resources at the correct URL when no resource path and a resource are provided', () => {
      const expectedResource$ = cold('(r|)', { r: [expectedResource] });

      const actualResource$ = restService.patchResources(undefined, [expectedResource]);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.patch).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/`, [expectedResource]);
    });
  });

  describe('updateResources', () => {
    let expectedResourcePath: string;
    let expectedResource: TestResource;

    beforeEach(() => {
      expectedResourcePath = '6/tests/bulk';
      expectedResource = {
        name: 'name62',
        value: 62
      };
      httpMock.put = jest.fn().mockReturnValue(of([expectedResource]));
    });

    it('updated the given resources at the correct URL when a resource path and a resource are provided', () => {
      const expectedResource$ = cold('(r|)', { r: [expectedResource] });

      const actualResource$ = restService.updateResources(expectedResourcePath, [expectedResource]);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.put).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/${expectedResourcePath}`, [expectedResource]);
    });

    it('updated the given resources at the correct URL when no resource path and a resource are provided', () => {
      const expectedResource$ = cold('(r|)', { r: [expectedResource] });

      const actualResource$ = restService.updateResources(undefined, [expectedResource]);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.put).toHaveBeenCalledWith(`${TEST_API_BASE_URL}/`, [expectedResource]);
    });
  });

  describe('deleteResource', () => {
    let expectedResourcePath: string;
    let expectedResource: TestResource;
    const requestMethod = 'delete';

    beforeEach(() => {
      expectedResourcePath = '7/tests/77';
      expectedResource = {
        id: 'testId',
        name: 'name62',
        value: 62
      };
      httpMock.request = jest.fn().mockReturnValue(of(expectedResource));
    });

    it('deletes the given resource at the correct URL when a resource path is provided', () => {
      const expectedResource$ = cold('(r|)', { r: expectedResource });

      const actualResource$ = restService.deleteResource(expectedResourcePath);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.request).toHaveBeenCalledWith(requestMethod, `${TEST_API_BASE_URL}/${expectedResourcePath}`);
    });

    it('deletes the given resource at the correct URL when no resource path is provided', () => {
      const expectedResource$ = cold('(r|)', { r: expectedResource });

      const actualResource$ = restService.deleteResource();

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.request).toHaveBeenCalledWith(requestMethod, `${TEST_API_BASE_URL}/`);
    });
  });

  describe('deleteResources', () => {
    let expectedResourcePath: string;
    let expectedResource: TestResource;
    const requestMethod = 'delete';

    beforeEach(() => {
      expectedResourcePath = '6/tests';
      expectedResource = {
        id: 'testId',
        name: 'name62',
        value: 62
      };

      httpMock.request = jest.fn().mockReturnValue(of([expectedResource]));
    });

    it('deletes the given resources at the correct URL when a resource path and resource ids are provided', () => {
      const expectedResource$ = cold('(r|)', { r: [expectedResource] });

      const actualResource$ = restService.deleteResources(expectedResourcePath, [expectedResource.id]);

      expect(actualResource$).toBeObservable(expectedResource$);
      expect(httpMock.request).toHaveBeenCalledWith(requestMethod, `${TEST_API_BASE_URL}/${expectedResourcePath}`, {
        body: [expectedResource.id]
      });
    });
  });
});
