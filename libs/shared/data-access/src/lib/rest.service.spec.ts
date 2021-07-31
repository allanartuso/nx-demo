import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  BulkPatchResourceDto,
  CreateResourceDto,
  createResourceId,
  createResourcePath,
  PatchResourceDto,
  UpdateResourceDto
} from '@demo/shared/acm/data-access/common';
import { FilteringLogic, FilteringOperator, RequestOptions, SortingOrder } from '@demo/shared/data-access';
import { ConfigurationService } from '@demo/shared/util-configuration';
import { configurationServiceFixture } from '@demo/shared/util-configuration/test';
import { EMPTY } from 'rxjs';
import { ErrorsDto } from '../models/errors.dto';
import { createFieldError, createGeneralError } from '../models/errors.dto.fixture';
import { createFieldErrorsVm, ErrorsVm } from '../models/errors.model';
import { createGeneralErrorsVm } from '../models/errors.model.fixture';
import { ResourceDto } from '../models/resource.dto';
import { RestConfiguration } from '../models/rest-configuration.model';
import { RestService } from './rest.service';

interface TestResource extends ResourceDto {
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
  let errorsDto: ErrorsDto;
  let errorsVm: ErrorsVm;

  beforeEach(() => {
    errorsDto = {
      generalErrors: [createGeneralError(EXPECTED_RESOURCES[0])],
      fieldErrors: [createFieldError(EXPECTED_RESOURCES[0])]
    };
    errorsVm = new ErrorsVm(createGeneralErrorsVm(errorsDto.generalErrors), createFieldErrorsVm(errorsDto.fieldErrors));

    const mockConfigurationService = configurationServiceFixture.createMockService({
      rest: {
        apiBaseUrl: TEST_API_BASE_URL
      }
    } as RestConfiguration);

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
    const expectedResourcePath = createResourcePath(2, 'basePath');
    const expectedUrl = `${TEST_API_BASE_URL}${expectedResourcePath}`;
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
          name: testSortingFieldName,
          order: SortingOrder.DESCENDING
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
            name: testSortingFieldName,
            order: SortingOrder.ASCENDING
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
            name: testSortingFieldName,
            order: SortingOrder.DESCENDING
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
            name: testSortingFieldName,
            order: SortingOrder.ASCENDING
          },
          [testSortingFieldName2]: {
            name: testSortingFieldName2,
            order: SortingOrder.DESCENDING
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

    it('returns errorsVm', done => {
      restService.loadResources<TestResource>(expectedResourcePath, defaultRequestOptions).subscribe(
        () => {},
        error => {
          expect(error).toStrictEqual(errorsVm);
          done();
        }
      );

      const request = httpTestingController.expectOne(
        `${expectedUrl}?requestParameterKey1=${testRequestParameter1}&requestParameterKey2=${testRequestParameter2}&page=${testPage}&pageSize=${testPageSize}&sort=-${testSortingFieldName}&${testFilteringFieldName}=${testFilteringFieldValue}&${testFilteringFieldName2}=${testFilteringFieldValue2}`
      );
      request.flush(errorsDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('queryResources', () => {
    const expectedResourcePath = createResourcePath(2, 'basePath');
    const expectedUrl = `${TEST_API_BASE_URL}${expectedResourcePath}`;
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
          name: testSortingFieldName,
          order: SortingOrder.DESCENDING
        },
        [testSortingFieldName2]: {
          name: testSortingFieldName2,
          order: SortingOrder.ASCENDING
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
            name: testSortingFieldName,
            order: SortingOrder.ASCENDING
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
            name: testSortingFieldName2,
            order: SortingOrder.DESCENDING
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

    it('returns errorsVm', done => {
      restService.queryResources<TestResource>(expectedResourcePath, defaultRequestOptions).subscribe(
        () => {},
        error => {
          expect(error).toStrictEqual(errorsVm);
          done();
        }
      );

      const request = httpTestingController.expectOne(`${expectedUrl}/query`);
      request.flush(errorsDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('patchResources', () => {
    const expectedResourcePath = createResourcePath(2, 'basePath');
    const expectedUrl = `${TEST_API_BASE_URL}${expectedResourcePath}`;
    const bulkPatchDtos: BulkPatchResourceDto<TestResource>[] = EXPECTED_RESOURCES.map(resource => ({
      resourceId: resource.resourceId,
      patch: {
        ...resource
      }
    }));

    it('patches the given resources', done => {
      restService
        .patchResources<TestResource, BulkPatchResourceDto<TestResource>>(expectedResourcePath, bulkPatchDtos)
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(EXPECTED_RESOURCES);
          done();
        });

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.body).toStrictEqual(bulkPatchDtos);
      request.flush(EXPECTED_RESOURCES);
    });

    it('returns errorsVm when receiving a successful response with resource errors', done => {
      restService
        .patchResources<TestResource, BulkPatchResourceDto<TestResource>>(expectedResourcePath, bulkPatchDtos)
        .subscribe(
          () => {},
          error => {
            expect(error).toStrictEqual(
              new ErrorsVm(
                createGeneralErrorsVm(
                  errorsDto.generalErrors,
                  EXPECTED_RESOURCES.map(resource => resource.resourceId)
                ),
                createFieldErrorsVm(errorsDto.fieldErrors, {}, 0)
              )
            );
            done();
          }
        );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush([errorsDto]);
    });

    it('returns errorsVm when the request fail', done => {
      restService
        .patchResources<TestResource, BulkPatchResourceDto<TestResource>>(expectedResourcePath, bulkPatchDtos)
        .subscribe(
          () => {},
          error => {
            expect(error).toStrictEqual(errorsVm);
            done();
          }
        );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush(errorsDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateResource', () => {
    const expectedResourcePath = createResourceId(2, 'basePath', 3);
    const expectedUrl = `${TEST_API_BASE_URL}${expectedResourcePath}`;

    it('updates the given resources', done => {
      restService
        .updateResource<TestResource, UpdateResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES[0])
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(EXPECTED_RESOURCES[0]);
          done();
        });

      const request = httpTestingController.expectOne(expectedUrl);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toStrictEqual(EXPECTED_RESOURCES[0]);
      request.flush(EXPECTED_RESOURCES[0]);
    });

    it('returns errorsVm', done => {
      const errorsDtoFieldIndex: ErrorsDto = {
        ...errorsDto,
        fieldErrors: [{ ...errorsDto.fieldErrors[0], field: 'name[1]' }]
      };

      restService
        .updateResource<TestResource, UpdateResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES[0])
        .subscribe(
          () => {},
          error => {
            expect(error).toStrictEqual(
              new ErrorsVm(
                createGeneralErrorsVm(errorsDtoFieldIndex.generalErrors),
                createFieldErrorsVm(errorsDtoFieldIndex.fieldErrors)
              )
            );
            done();
          }
        );

      const request = httpTestingController.expectOne(expectedUrl);
      request.flush(errorsDtoFieldIndex, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateResources', () => {
    const expectedResourcePath = createResourcePath(2, 'basePath');
    const expectedUrl = `${TEST_API_BASE_URL}${expectedResourcePath}`;

    it('updates the given resources', done => {
      restService
        .updateResources<TestResource, UpdateResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES)
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(EXPECTED_RESOURCES);
          done();
        });

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toStrictEqual(EXPECTED_RESOURCES);
      request.flush(EXPECTED_RESOURCES);
    });

    it('returns errorsVm when receiving a successful response with resource errors', done => {
      restService
        .updateResources<TestResource, UpdateResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES)
        .subscribe(
          () => {},
          error => {
            expect(error).toStrictEqual(
              new ErrorsVm(
                createGeneralErrorsVm(
                  errorsDto.generalErrors,
                  EXPECTED_RESOURCES.map(resource => resource.resourceId)
                ),
                createFieldErrorsVm(errorsDto.fieldErrors, {}, 0)
              )
            );
            done();
          }
        );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush([errorsDto]);
    });

    it('returns errorsVm when the request fail', done => {
      restService
        .updateResources<TestResource, UpdateResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES)
        .subscribe(
          () => {},
          error => {
            expect(error).toStrictEqual(errorsVm);
            done();
          }
        );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush(errorsDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('createResource', () => {
    const expectedResourcePath = createResourcePath(2, 'basePath');
    const expectedUrl = `${TEST_API_BASE_URL}${expectedResourcePath}`;

    it('creates the given resources', done => {
      restService
        .createResource<TestResource, CreateResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES[0])
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(EXPECTED_RESOURCES[0]);
          done();
        });

      const request = httpTestingController.expectOne(expectedUrl);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual(EXPECTED_RESOURCES[0]);
      request.flush(EXPECTED_RESOURCES[0]);
    });

    it('returns errorsVm', done => {
      restService
        .createResource<TestResource, CreateResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES[0])
        .subscribe(
          () => {},
          error => {
            expect(error).toStrictEqual(errorsVm);
            done();
          }
        );

      const request = httpTestingController.expectOne(expectedUrl);
      request.flush(errorsDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('createResources', () => {
    const expectedResourcePath = createResourcePath(2, 'basePath');
    const expectedUrl = `${TEST_API_BASE_URL}${expectedResourcePath}`;

    it('creates the given resources', done => {
      restService
        .createResources<TestResource, UpdateResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES)
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(EXPECTED_RESOURCES);
          done();
        });

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toStrictEqual(EXPECTED_RESOURCES);
      request.flush(EXPECTED_RESOURCES);
    });

    it('returns errorsVm when receiving a successful response with resource errors', done => {
      restService
        .createResources<TestResource, UpdateResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES)
        .subscribe(
          () => {},
          error => {
            expect(error).toStrictEqual(
              new ErrorsVm(
                createGeneralErrorsVm(
                  errorsDto.generalErrors,
                  EXPECTED_RESOURCES.map(resource => resource.resourceId)
                ),
                createFieldErrorsVm(errorsDto.fieldErrors, {}, 0)
              )
            );
            done();
          }
        );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush([errorsDto]);
    });

    it('returns errorsVm', done => {
      restService
        .createResources<TestResource, CreateResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES)
        .subscribe(
          () => {},
          error => {
            expect(error).toStrictEqual(errorsVm);
            done();
          }
        );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush(errorsDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('loadResource', () => {
    const expectedResourcePath = createResourceId(2, 'basePath', 3);
    const expectedUrl = `${TEST_API_BASE_URL}${expectedResourcePath}`;

    it('loads the given resources', done => {
      restService.loadResource<TestResource>(expectedResourcePath).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(EXPECTED_RESOURCES);
        done();
      });

      const request = httpTestingController.expectOne(expectedUrl);
      expect(request.request.method).toEqual('GET');
      request.flush(EXPECTED_RESOURCES);
    });

    it('returns errorsVm', done => {
      restService.loadResource<TestResource>(expectedResourcePath).subscribe(
        () => {},
        error => {
          expect(error).toStrictEqual(errorsVm);
          done();
        }
      );

      const request = httpTestingController.expectOne(expectedUrl);
      request.flush(errorsDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('patchResource', () => {
    const expectedResourcePath = createResourceId(2, 'basePath', 3);
    const expectedUrl = `${TEST_API_BASE_URL}${expectedResourcePath}`;

    it('patches the given resources', done => {
      restService
        .patchResource<TestResource, PatchResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES[0])
        .subscribe(actualResources => {
          expect(actualResources).toStrictEqual(EXPECTED_RESOURCES[0]);
          done();
        });

      const request = httpTestingController.expectOne(expectedUrl);
      expect(request.request.method).toEqual('PATCH');
      request.flush(EXPECTED_RESOURCES[0]);
    });

    it('returns errorsVm', done => {
      restService
        .patchResource<TestResource, PatchResourceDto<TestResource>>(expectedResourcePath, EXPECTED_RESOURCES[0])
        .subscribe(
          () => {},
          error => {
            expect(error).toStrictEqual(errorsVm);
            done();
          }
        );

      const request = httpTestingController.expectOne(expectedUrl);
      request.flush(errorsDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteResource', () => {
    const expectedResourcePath = createResourceId(2, 'basePath', 3);
    const expectedUrl = `${TEST_API_BASE_URL}${expectedResourcePath}`;

    it('deletes the given resources', done => {
      restService.deleteResource(expectedResourcePath).subscribe(actualResources => {
        expect(actualResources).toStrictEqual(EMPTY);
        done();
      });

      const request = httpTestingController.expectOne(expectedUrl);
      expect(request.request.method).toEqual('DELETE');
      request.flush(EMPTY);
    });

    it('returns errorsVm', done => {
      restService.deleteResource(expectedResourcePath).subscribe(
        () => {},
        error => {
          expect(error).toStrictEqual(errorsVm);
          done();
        }
      );

      const request = httpTestingController.expectOne(expectedUrl);
      request.flush(errorsDto, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteResources', () => {
    const expectedResourcePath = createResourcePath(2, 'basePath');
    const expectedUrl = `${TEST_API_BASE_URL}${expectedResourcePath}`;
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

    it('returns errorsVm when receiving a successful response with resource errors', done => {
      restService.deleteResources<TestResource>(expectedResourcePath, resourceIds).subscribe(
        () => {},
        error => {
          expect(error).toStrictEqual(
            new ErrorsVm(
              createGeneralErrorsVm(
                errorsDto.generalErrors,
                EXPECTED_RESOURCES.map(resource => resource.resourceId)
              ),
              createFieldErrorsVm(errorsDto.fieldErrors, {}, 0)
            )
          );
          done();
        }
      );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush([errorsDto]);
    });

    it('returns errorsVm when the request fail', done => {
      restService.deleteResources<TestResource>(expectedResourcePath, resourceIds).subscribe(
        () => {},
        error => {
          expect(error).toStrictEqual(errorsVm);
          done();
        }
      );

      const request = httpTestingController.expectOne(`${expectedUrl}/bulk`);
      request.flush(errorsDto, { status: 400, statusText: 'Bad Request' });
    });
  });
});
