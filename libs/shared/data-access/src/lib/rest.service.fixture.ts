import { EMPTY, of } from 'rxjs';
import { RestService } from './rest.service';

export function getMockRestService<T, R>(expectedResource: T, expectedResources: R[] = []): Partial<RestService> {
  return {
    loadResource: jest.fn().mockReturnValue(of(expectedResource)),
    loadResources: jest.fn().mockReturnValue(of(expectedResources)),
    updateResource: jest.fn().mockReturnValue(of(expectedResource)),
    updateResources: jest.fn().mockReturnValue(of(expectedResources)),
    createResource: jest.fn().mockReturnValue(of(expectedResource)),
    deleteResource: jest.fn().mockReturnValue(EMPTY),
    queryResources: jest.fn().mockReturnValue(of(expectedResources)),
    patchResources: jest.fn().mockReturnValue(of(expectedResources)),
    patchResource: jest.fn().mockReturnValue(of(expectedResource)),
    deleteResources: jest.fn().mockReturnValue(of(expectedResources)),
    createResources: jest.fn().mockReturnValue(of(expectedResources))
  };
}
