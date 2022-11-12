/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ErrorDto, FilteringLogic, FilteringOperator, RequestOptions, SortingDirection } from '@demo/shared/data-model';
import { ConfigurationService } from '@demo/shared/util-configuration';
import { EMPTY } from 'rxjs';
import { RestService } from './rest.service';

interface TestResource {
  resourceId: string;
  version: number;
  name: string;
  value: number;
}

const TEST_API_BASE_URL = 'https://testapi:4200/baseurl';
const EXPECTED_RESOURCES: TestResource[] = [
  {
    resourceId: '2/test/3',
    version: 0,
    name: 'name1',
    value: 1
  },
  {
    resourceId: '2/test/5',
    version: 2,
    name: 'name2',
    value: 2
  }
];

describe('RestService', () => {
  let restService: RestService;
  let httpTestingController: HttpTestingController;
  let errorDto: ErrorDto;

  beforeEach(() => {
    errorDto = createErrorDto();

    const mockConfigurationService: Partial<ConfigurationService> = {
      setConfiguration: jest.fn(),
      getConfiguration: jest.fn().mockReturnValue({
        apiBaseUrl: TEST_API_BASE_URL
      })
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RestService,
        {
          provide: ConfigurationService,
          useValue: mockConfigurationService
        }
      ]
    });

    restService = TestBed.inject(RestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('loadResources', () => {
    const expectedResourcePath = 'basePath';
    const expectedUrl = `${TEST_API_BASE_URL}/${expectedResourcePath}`;
    const expectedResources = EXPECTED_RESOURCES;
    const testRequestParameter1 = 'testRequestParameter1';
    const testRequestParameter2 = 'testRequestParameter2';
    const testPage = 2;
    const testPageSize = 100;
    const testSortingFieldName = 'testSortingFieldName';
    const testFilteringFieldName = 'defaultFilteringFieldName';
    const testFilteringFieldValue = 'testFilteringFieldValue;';
    const testFilteringFieldName2 = 'defaultFilteringFieldName2';
    const testFilteringFieldValue2 = 'testFilteringFieldValue2;';
    const defaultRequestOptions: RequestOptions = {
      requestParameters: {
        requestParameterKey1: testRequestParameter1,
        requestParameterKey2: testRequestParameter2
      },
      pagingOptions: {
        page: testPage,
        pageSize: testPageSize
      },
      sortingOptions: {
        [testSortingFieldName]: {
          field: testSortingFieldName,
          direction: SortingDirection.DESCENDING
        }
      },
      filteringOptions: {
        logic: FilteringLogic.OR,
        filters: [
          {
            field: testFilteringFieldName,
            value: testFilteringFieldValue,
            operator: FilteringOperator.Contains
          },
          {
            field: testFilteringFieldName2,
            value: testFilteringFieldValue2,
            operator: FilteringOperator.StartsWith
          }
        ]
      }
    };

    it('applies no request parameters when no request options are provided', done => {
      restService.loadResources<TestResource>(expectedResourcePath).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const testRequest = httpTestingController.expectOne(expectedUrl);
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(expectedResources);
    });

    it('applies no request parameters when empty request options are provided', done => {
      restService.loadResources<TestResource>(expectedResourcePath, {}).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(expectedUrl);
      expect(request.request.method).toEqual('GET');
      request.flush(expectedResources);
    });

    it('applies request parameters when request options with request parameters are provided', done => {
      const testRequestOptions: RequestOptions = {
        requestParameters: {
          ...defaultRequestOptions.requestParameters
        }
      };

      restService.loadResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(
        `${expectedUrl}?requestParameterKey1=${testRequestParameter1}&requestParameterKey2=${testRequestParameter2}`
      );
      expect(request.request.method).toEqual('GET');
      request.flush(expectedResources);
    });

    it('applies request parameters when request options with paging options are provided', done => {
      const expectedOptions: RequestOptions = {
        pagingOptions: {
          ...defaultRequestOptions.pagingOptions
        }
      };

      restService.loadResources<TestResource>(expectedResourcePath, expectedOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(
        `${expectedUrl}?page=${expectedOptions.pagingOptions.page}&pageSize=${expectedOptions.pagingOptions.pageSize}`
      );
      expect(request.request.method).toEqual('GET');
      request.flush(expectedResources);
    });

    it('applies request parameters when request options with empty sorting options are provided', done => {
      const expectedRequestOptions: RequestOptions = {
        sortingOptions: {}
      };

      restService
        .loadResources<TestResource>(expectedResourcePath, expectedRequestOptions)
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(expectedResources);
          done();
        });

      const request = httpTestingController.expectOne(`${expectedUrl}`);
      expect(request.request.method).toEqual('GET');
      request.flush(expectedResources);
    });

    it('applies request parameters when request options with one ascending sorting field is provided', done => {
      const expectedRequestOptions: RequestOptions = {
        sortingOptions: {
          [testSortingFieldName]: {
            field: testSortingFieldName,
            direction: SortingDirection.ASCENDING
          }
        }
      };

      restService
        .loadResources<TestResource>(expectedResourcePath, expectedRequestOptions)
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(expectedResources);
          done();
        });

      const request = httpTestingController.expectOne(`${expectedUrl}?sort=${testSortingFieldName}`);
      expect(request.request.method).toEqual('GET');
      request.flush(expectedResources);
    });

    it('applies request parameters when request options with one descending sorting field are provided', done => {
      const testRequestOptions: RequestOptions = {
        sortingOptions: {
          [testSortingFieldName]: {
            field: testSortingFieldName,
            direction: SortingDirection.DESCENDING
          }
        }
      };

      restService.loadResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}?sort=-${testSortingFieldName}`);
      expect(request.request.method).toEqual('GET');
      request.flush(expectedResources);
    });

    it('applies request parameters when request options with multiple sorting fields are provided', done => {
      const testSortingFieldName2 = 'testSortingFieldName12';
      const testRequestOptions: RequestOptions = {
        sortingOptions: {
          [testSortingFieldName]: {
            field: testSortingFieldName,
            direction: SortingDirection.ASCENDING
          },
          [testSortingFieldName2]: {
            field: testSortingFieldName2,
            direction: SortingDirection.DESCENDING
          }
        }
      };

      restService.loadResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(
        `${expectedUrl}?sort=${testSortingFieldName},-${testSortingFieldName2}`
      );
      expect(request.request.method).toEqual('GET');
      request.flush(expectedResources);
    });

    it('applies request parameters when request options with no filters are provided', done => {
      const testRequestOptions: RequestOptions = {
        filteringOptions: {
          logic: FilteringLogic.OR,
          filters: []
        }
      };

      restService.loadResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}`);
      expect(request.request.method).toEqual('GET');
      request.flush(expectedResources);
    });

    it('applies request parameters when request options with one filtering field are provided', done => {
      const testRequestOptions: RequestOptions = {
        filteringOptions: {
          logic: FilteringLogic.OR,
          filters: [defaultRequestOptions.filteringOptions.filters[0]]
        }
      };

      restService.loadResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(
        `${expectedUrl}?${testFilteringFieldName}=${testFilteringFieldValue}`
      );
      expect(request.request.method).toEqual('GET');
      request.flush(expectedResources);
    });

    it('applies request parameters when request options with multiple filtering fields are provided', done => {
      const testRequestOptions: RequestOptions = {
        filteringOptions: {
          logic: FilteringLogic.OR,
          filters: [...defaultRequestOptions.filteringOptions.filters]
        }
      };

      restService.loadResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(
        `${expectedUrl}?${testFilteringFieldName}=${testFilteringFieldValue}&${testFilteringFieldName2}=${testFilteringFieldValue2}`
      );
      expect(request.request.method).toEqual('GET');
      request.flush(expectedResources);
    });

    it('applies request parameters when request options with complete request options are provided', done => {
      restService
        .loadResources<TestResource>(expectedResourcePath, defaultRequestOptions)
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(expectedResources);
          done();
        });

      const request = httpTestingController.expectOne(
        `${expectedUrl}?requestParameterKey1=${testRequestParameter1}&requestParameterKey2=${testRequestParameter2}&page=${testPage}&pageSize=${testPageSize}&sort=-${testSortingFieldName}&${testFilteringFieldName}=${testFilteringFieldValue}&${testFilteringFieldName2}=${testFilteringFieldValue2}`
      );
      expect(request.request.method).toEqual('GET');
      request.flush(expectedResources);
    });

    it('returns errorDto', done => {
      restService.loadResources<TestResource>(expectedResourcePath, defaultRequestOptions).subscribe(
        () => {},
        error => {
          expect(error.error).toStrictEqual(errorDto);
          done();
        }
      );

      const request = httpTestingController.expectOne(
        `${expectedUrl}?requestParameterKey1=${testRequestParameter1}&requestParameterKey2=${testRequestParameter2}&page=${testPage}&pageSize=${testPageSize}&sort=-${testSortingFieldName}&${testFilteringFieldName}=${testFilteringFieldValue}&${testFilteringFieldName2}=${testFilteringFieldValue2}`
      );
      request.flush(errorDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('queryResources', () => {
    const expectedResourcePath = 'basePath';
    const expectedUrl = `${TEST_API_BASE_URL}/${expectedResourcePath}`;
    const expectedResources = EXPECTED_RESOURCES;
    const testRequestParameter1 = 'testRequestParameter1';
    const testRequestParameter2 = 'testRequestParameter2';
    const testPage = 2;
    const testPageSize = 100;
    const testSortingFieldName = 'testSortingFieldName';
    const testSortingFieldName2 = 'testSortingFieldName2';
    const testFilteringFieldName = 'defaultFilteringFieldName';
    const testFilteringFieldValue = 'testFilteringFieldValue;';
    const testFilteringFieldName2 = 'defaultFilteringFieldName2';
    const testFilteringFieldValue2 = 'testFilteringFieldValue2;';
    const defaultRequestOptions: RequestOptions = {
      requestParameters: {
        requestParameterKey1: testRequestParameter1,
        requestParameterKey2: testRequestParameter2
      },
      pagingOptions: {
        page: testPage,
        pageSize: testPageSize
      },
      sortingOptions: {
        [testSortingFieldName]: {
          field: testSortingFieldName,
          direction: SortingDirection.DESCENDING
        },
        [testSortingFieldName2]: {
          field: testSortingFieldName2,
          direction: SortingDirection.ASCENDING
        }
      },
      filteringOptions: {
        logic: FilteringLogic.OR,
        filters: [
          {
            logic: FilteringLogic.AND,
            filters: [
              {
                field: testFilteringFieldName,
                value: testFilteringFieldValue,
                operator: FilteringOperator.Contains
              }
            ]
          },
          {
            field: testFilteringFieldName2,
            value: testFilteringFieldValue2,
            operator: FilteringOperator.StartsWith
          }
        ]
      }
    };

    it('applies query parameters when no request options are provided', done => {
      restService.queryResources<TestResource>(expectedResourcePath).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual({});
      request.flush(expectedResources);
    });

    it('applies query parameters when empty request options are provided', done => {
      restService.queryResources<TestResource>(expectedResourcePath, {}).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual({});
      request.flush(expectedResources);
    });

    it('applies query parameters when request options with request parameters are provided', done => {
      const testRequestOptions: RequestOptions = {
        requestParameters: { ...defaultRequestOptions.requestParameters }
      };

      restService.queryResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual(testRequestOptions.requestParameters);
      request.flush(expectedResources);
    });

    it('applies query parameters when request options with paging options are provided', done => {
      const testRequestOptions: RequestOptions = {
        pagingOptions: { ...defaultRequestOptions.pagingOptions }
      };

      restService.queryResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual(testRequestOptions.pagingOptions);
      request.flush(expectedResources);
    });

    it('applies query parameters when request options with one ascending sorting field are provided', done => {
      const testRequestOptions: RequestOptions = {
        sortingOptions: {
          [testSortingFieldName]: {
            field: testSortingFieldName,
            direction: SortingDirection.ASCENDING
          }
        }
      };

      restService.queryResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual({
        sort: [
          {
            field: testSortingFieldName,
            direction: 'asc'
          }
        ]
      });
      request.flush(expectedResources);
    });

    it('applies query parameters when request options with one descending sorting field are provided', done => {
      const testRequestOptions: RequestOptions = {
        sortingOptions: {
          [testSortingFieldName2]: {
            field: testSortingFieldName2,
            direction: SortingDirection.DESCENDING
          }
        }
      };

      restService.queryResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual({
        sort: [
          {
            field: testSortingFieldName2,
            direction: 'desc'
          }
        ]
      });
      request.flush(expectedResources);
    });

    it('applies query parameters when request options with multiple sorting fields are provided', done => {
      const testRequestOptions: RequestOptions = {
        sortingOptions: { ...defaultRequestOptions.sortingOptions }
      };

      restService.queryResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual({
        sort: [
          {
            field: testSortingFieldName,
            direction: 'desc'
          },
          {
            field: testSortingFieldName2,
            direction: 'asc'
          }
        ]
      });
      request.flush(expectedResources);
    });

    it('applies query parameters when request options with one filtering field are provided', done => {
      const testRequestOptions: RequestOptions = {
        filteringOptions: {
          logic: FilteringLogic.AND,
          filters: [defaultRequestOptions.filteringOptions.filters[1]]
        }
      };

      restService.queryResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual({
        filter: testRequestOptions.filteringOptions
      });
      request.flush(expectedResources);
    });

    it('applies query parameters when request options with complex filtering options are provided', done => {
      const testRequestOptions: RequestOptions = {
        filteringOptions: {
          ...defaultRequestOptions.filteringOptions
        }
      };

      restService.queryResources<TestResource>(expectedResourcePath, testRequestOptions).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(expectedResources);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual({
        filter: testRequestOptions.filteringOptions
      });
      request.flush(expectedResources);
    });

    it('applies query parameters when complete request options are provided', done => {
      restService
        .queryResources<TestResource>(expectedResourcePath, defaultRequestOptions)
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(expectedResources);
          done();
        });

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual({
        ...defaultRequestOptions.requestParameters,
        ...defaultRequestOptions.pagingOptions,
        sort: [
          {
            field: testSortingFieldName,
            direction: 'desc'
          },
          {
            field: testSortingFieldName2,
            direction: 'asc'
          }
        ],
        filter: defaultRequestOptions.filteringOptions
      });
      request.flush(expectedResources);
    });

    it('returns errorDto', done => {
      restService.queryResources<TestResource>(expectedResourcePath, defaultRequestOptions).subscribe(
        () => {},
        error => {
          expect(error.error).toStrictEqual(errorDto);
          done();
        }
      );

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      request.flush(errorDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('patchResources', () => {
    const expectedResourcePath = 'basePath';
    const expectedUrl = `${TEST_API_BASE_URL}/${expectedResourcePath}`;
    const bulkPatchDtos = EXPECTED_RESOURCES.map(resource => ({
      resourceId: resource.resourceId,
      patch: {
        ...resource
      }
    }));

    it('patches the given resources', done => {
      restService
        .patchResources<TestResource, Partial<TestResource>>(expectedResourcePath, bulkPatchDtos)
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(EXPECTED_RESOURCES);
          done();
        });

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.body).toStrictEqual(bulkPatchDtos);
      request.flush(EXPECTED_RESOURCES);
    });

    it('returns errorDto when the request fail', done => {
      restService.patchResources<TestResource, Partial<TestResource>>(expectedResourcePath, bulkPatchDtos).subscribe(
        () => {},
        error => {
          expect(error.error).toStrictEqual(errorDto);
          done();
        }
      );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush(errorDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateResource', () => {
    const expectedResourcePath = 'resourcePath/1';
    const expectedUrl = `${TEST_API_BASE_URL}/${expectedResourcePath}`;

    it('updates the given resources', done => {
      restService
        .updateResource<TestResource>(expectedResourcePath, EXPECTED_RESOURCES[0])
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(EXPECTED_RESOURCES[0]);
          done();
        });

      const request = httpTestingController.expectOne(expectedUrl);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toStrictEqual(EXPECTED_RESOURCES[0]);
      request.flush(EXPECTED_RESOURCES[0]);
    });

    it('returns errorDto', done => {
      const errorDtoFieldIndex: ErrorDto = {
        ...errorDto,
        fieldErrors: [{ ...errorDto.fieldErrors[0], field: 'name[1]' }]
      };

      restService.updateResource<TestResource>(expectedResourcePath, EXPECTED_RESOURCES[0]).subscribe(
        () => {},
        error => {
          expect(error.error).toStrictEqual(errorDtoFieldIndex);
          done();
        }
      );

      const request = httpTestingController.expectOne(expectedUrl);
      request.flush(errorDtoFieldIndex, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateResources', () => {
    const expectedResourcePath = 'basePath';
    const expectedUrl = `${TEST_API_BASE_URL}/${expectedResourcePath}`;

    it('updates the given resources', done => {
      restService.updateResources<TestResource>(expectedResourcePath, EXPECTED_RESOURCES).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(EXPECTED_RESOURCES);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toStrictEqual(EXPECTED_RESOURCES);
      request.flush(EXPECTED_RESOURCES);
    });

    it('returns errorDto when the request fail', done => {
      restService.updateResources<TestResource>(expectedResourcePath, EXPECTED_RESOURCES).subscribe(
        () => {},
        error => {
          expect(error.error).toStrictEqual(errorDto);
          done();
        }
      );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush(errorDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('createResource', () => {
    const expectedResourcePath = 'basePath';
    const expectedUrl = `${TEST_API_BASE_URL}/${expectedResourcePath}`;

    it('creates the given resources', done => {
      restService
        .createResource<TestResource>(expectedResourcePath, EXPECTED_RESOURCES[0])
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(EXPECTED_RESOURCES[0]);
          done();
        });

      const request = httpTestingController.expectOne(expectedUrl);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual(EXPECTED_RESOURCES[0]);
      request.flush(EXPECTED_RESOURCES[0]);
    });

    it('returns errorDto', done => {
      restService.createResource<TestResource>(expectedResourcePath, EXPECTED_RESOURCES[0]).subscribe(
        () => {},
        error => {
          expect(error.error).toStrictEqual(errorDto);
          done();
        }
      );

      const request = httpTestingController.expectOne(expectedUrl);
      request.flush(errorDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('createResources', () => {
    const expectedResourcePath = 'basePath';
    const expectedUrl = `${TEST_API_BASE_URL}/${expectedResourcePath}`;

    it('creates the given resources', done => {
      restService.createResources<TestResource>(expectedResourcePath, EXPECTED_RESOURCES).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(EXPECTED_RESOURCES);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual(EXPECTED_RESOURCES);
      request.flush(EXPECTED_RESOURCES);
    });

    it('returns errorDto', done => {
      restService.createResources<TestResource>(expectedResourcePath, EXPECTED_RESOURCES).subscribe(
        () => {},
        error => {
          expect(error.error).toStrictEqual(errorDto);
          done();
        }
      );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush(errorDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('loadResource', () => {
    const expectedResourcePath = 'resourcePath/1';
    const expectedUrl = `${TEST_API_BASE_URL}/${expectedResourcePath}`;

    it('loads the given resources', done => {
      restService.loadResource<TestResource>(expectedResourcePath).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(EXPECTED_RESOURCES);
        done();
      });

      const request = httpTestingController.expectOne(expectedUrl);
      expect(request.request.method).toEqual('GET');
      request.flush(EXPECTED_RESOURCES);
    });

    it('returns errorDto', done => {
      restService.loadResource<TestResource>(expectedResourcePath).subscribe(
        () => {},
        error => {
          expect(error.error).toStrictEqual(errorDto);
          done();
        }
      );

      const request = httpTestingController.expectOne(expectedUrl);
      request.flush(errorDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('patchResource', () => {
    const expectedResourcePath = 'resourcePath/1';
    const expectedUrl = `${TEST_API_BASE_URL}/${expectedResourcePath}`;

    it('patches the given resources', done => {
      restService
        .patchResource<TestResource, Partial<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES[0])
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(EXPECTED_RESOURCES[0]);
          done();
        });

      const request = httpTestingController.expectOne(expectedUrl);
      expect(request.request.method).toEqual('PATCH');
      request.flush(EXPECTED_RESOURCES[0]);
    });

    it('returns errorDto', done => {
      restService
        .patchResource<TestResource, Partial<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES[0])
        .subscribe(
          () => {},
          error => {
            expect(error.error).toStrictEqual(errorDto);
            done();
          }
        );

      const request = httpTestingController.expectOne(expectedUrl);
      request.flush(errorDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteResource', () => {
    const expectedResourcePath = 'resourcePath/1';
    const expectedUrl = `${TEST_API_BASE_URL}/${expectedResourcePath}`;

    it('deletes the given resources', done => {
      restService.deleteResource(expectedResourcePath).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(EMPTY);
        done();
      });

      const request = httpTestingController.expectOne(expectedUrl);
      expect(request.request.method).toEqual('DELETE');
      request.flush(EMPTY);
    });

    it('returns errorDto', done => {
      restService.deleteResource(expectedResourcePath).subscribe(
        () => {},
        error => {
          expect(error.error).toStrictEqual(errorDto);
          done();
        }
      );

      const request = httpTestingController.expectOne(expectedUrl);
      request.flush(errorDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteResources', () => {
    const expectedResourcePath = 'basePath';
    const expectedUrl = `${TEST_API_BASE_URL}/${expectedResourcePath}`;
    const resourceIds: string[] = EXPECTED_RESOURCES.map(resource => resource.resourceId);

    it('patches the given resources', done => {
      restService.deleteResources<TestResource>(expectedResourcePath, resourceIds).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(EXPECTED_RESOURCES);
        done();
      });

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      expect(request.request.method).toEqual('DELETE');
      expect(request.request.body).toStrictEqual(resourceIds);
      request.flush(EXPECTED_RESOURCES);
    });

    it('returns errorDto when the request fail', done => {
      restService.deleteResources<TestResource>(expectedResourcePath, resourceIds).subscribe(
        () => {},
        error => {
          expect(error.error).toStrictEqual(errorDto);
          done();
        }
      );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush(errorDto, { status: 400, statusText: 'Bad Request' });
    });
  });
});
function createErrorDto(): ErrorDto {
  throw new Error('Function not implemented.');
}
