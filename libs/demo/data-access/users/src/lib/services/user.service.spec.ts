import { TestBed } from '@angular/core/testing';
import { USERS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/users';
import { createPersistentUser, createPersistentUsers, createTransientUser } from '@demo/demo/data-model/users/test';
import { RestService } from '@demo/shared/data-access';
import { restServiceFixture } from '@demo/shared/data-access/test';
import { RequestOptions } from '@ngdux/data-model-common';
import { cold } from 'jasmine-marbles';
import { UserService } from './user.service';

describe('UsersService', () => {
  const user = createPersistentUser();
  const users = createPersistentUsers();
  let service: UserService;
  let mockRestService: Partial<RestService>;

  beforeEach(() => {
    mockRestService = restServiceFixture.getMockRestService(user, users);

    TestBed.configureTestingModule({
      providers: [UserService, { provide: RestService, useValue: mockRestService }]
    });

    service = TestBed.inject(UserService);
    mockRestService = TestBed.inject(RestService);
  });

  it('loadResource', () => {
    const expected = cold('(u|)', { u: user });

    const actual = service.loadResource(user.id);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.loadResource).toHaveBeenCalledTimes(1);
    expect(mockRestService.loadResource).toHaveBeenCalledWith(`${USERS_RESOURCE_BASE_PATH}/${user.id}`);
  });

  describe('createResource', () => {
    it('creates user when a transient user is given', () => {
      const transientResource = createTransientUser();
      const expected = cold('(u|)', { u: user });

      const actual = service.createResource(transientResource);

      expect(actual).toBeObservable(expected);
      expect(mockRestService.createResource).toHaveBeenCalledTimes(1);
      expect(mockRestService.createResource).toHaveBeenCalledWith(USERS_RESOURCE_BASE_PATH, transientResource);
    });
  });

  describe('saveResource', () => {
    it('updates user when a persistent user is given', () => {
      const expected = cold('(u|)', { u: user });

      const actual = service.saveResource(user);

      expect(actual).toBeObservable(expected);
      expect(mockRestService.updateResource).toHaveBeenCalledTimes(1);
      expect(mockRestService.updateResource).toHaveBeenCalledWith(`${USERS_RESOURCE_BASE_PATH}/${user.id}`, user);
    });
  });

  it('deleteResource', () => {
    const expected = cold('(|)');

    const actual = service.deleteResource(user.id);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.deleteResource).toHaveBeenCalledTimes(1);
    expect(mockRestService.deleteResource).toHaveBeenCalledWith(`${USERS_RESOURCE_BASE_PATH}/${user.id}`);
  });

  it('queryResources', () => {
    const options: RequestOptions = {
      pagingOptions: {
        page: 1,
        pageSize: 10
      }
    };
    const expected = cold('(u|)', { u: users });

    const actual = service.queryResources(options);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.queryResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.queryResources).toHaveBeenCalledWith(USERS_RESOURCE_BASE_PATH, options);
  });

  it('deleteResources', () => {
    const expected = cold('(u|)', { u: users });
    const ids: string[] = users.map(user => user.id);

    const actual = service.deleteResources(ids);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.deleteResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.deleteResources).toHaveBeenCalledWith(USERS_RESOURCE_BASE_PATH, ids);
  });

  it('patchResources', () => {
    const expected = cold('(u|)', { u: users });
    const ids: string[] = users.map(user => user.id);

    const actual = service.patchResources(ids, user);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.patchResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.patchResources).toHaveBeenCalledWith(
      USERS_RESOURCE_BASE_PATH,
      ids.map(id => ({
        id,
        resource: user
      }))
    );
  });
});
