import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { userActions, userSelectors } from '@demo/demo/data-access/users';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let store: MockStore;

  const id = 'testId';
  const mockRouteSnapshot = { params: { id } } as unknown as ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserResolver,
        provideMockStore(),
        {
          provide: ActivatedRouteSnapshot,
          useValue: mockRouteSnapshot
        }
      ]
    });

    resolver = TestBed.inject(UserResolver);
    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');
    store.overrideSelector(userSelectors.isReady, true);
  });

  it('should dispatch initial actions', () => {
    resolver.resolve(mockRouteSnapshot).subscribe();

    expect(store.dispatch).toHaveBeenCalledWith(userActions.load({ id }));
  });

  it('should emit true if the users are already loaded', done => {
    resolver.resolve(mockRouteSnapshot).subscribe(canActivate => {
      expect(canActivate).toBe(true);
      done();
    });
  });

  it('should wait until the loading state is loaded', () => {
    store.overrideSelector(userSelectors.isReady, false);
    let emitted = false;

    resolver.resolve(mockRouteSnapshot).subscribe(() => {
      emitted = true;
    });

    expect(emitted).toBe(false);
  });
});
