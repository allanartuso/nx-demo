import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { listActions } from '../+state/users/users.actions';
import { listSelectors } from '../+state/users/users.selectors';
import { UsersResolver } from './users.resolver';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersResolver, provideMockStore()]
    });

    resolver = TestBed.inject(UsersResolver);
    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');
    store.overrideSelector(listSelectors.isReady, true);
  });

  it('should dispatch initial actions', () => {
    resolver.resolve().subscribe();

    expect(store.dispatch).toHaveBeenCalledWith(listActions.initializeRequestOptions());
    expect(store.dispatch).toHaveBeenCalledWith(listActions.initialize());
  });

  it('should emit true if the users are already loaded', done => {
    store.overrideSelector(listSelectors.isReady, true);

    resolver.resolve().subscribe(canActivate => {
      expect(canActivate).toBe(true);
      done();
    });
  });

  it('should wait until the loading state is loaded', () => {
    store.overrideSelector(listSelectors.isReady, false);
    let emitted = false;

    resolver.resolve().subscribe(() => {
      emitted = true;
    });

    expect(emitted).toBe(false);
  });
});
