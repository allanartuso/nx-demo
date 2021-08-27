import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { formActions } from '../+state/user/user.actions';
import { formSelectors } from '../+state/user/user.selectors';
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
    store.overrideSelector(formSelectors.isReady, true);
  });

  it('should dispatch initial actions', () => {
    resolver.resolve(mockRouteSnapshot).subscribe();

    expect(store.dispatch).toHaveBeenCalledWith(formActions.load({ id }));
  });

  it('should emit true if the users are already loaded', done => {
    resolver.resolve(mockRouteSnapshot).subscribe(canActivate => {
      expect(canActivate).toBe(true);
      done();
    });
  });

  it('should wait until the loading state is loaded', () => {
    store.overrideSelector(formSelectors.isReady, false);
    let emitted = false;

    resolver.resolve(mockRouteSnapshot).subscribe(() => {
      emitted = true;
    });

    expect(emitted).toBe(false);
  });
});
