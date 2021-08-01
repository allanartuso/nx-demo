import { Router } from '@angular/router';
import {
  createFilteringByResourceIds,
  DEFAULT_PAGE_SIZE,
  FilteringOptions,
  ListErrors,
  ListService,
  PagingOptions,
  SortingOptions
} from '@demo/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, select, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { handleFailureEffect } from '../../utils/effects-handle-failure';
import { ListActions, ListSelectors } from '../models/list.model';

export abstract class AbstractListEffects<T, S = T> {
  initialize$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.initialize, this.listActions.reinitialize),
      switchMap(() => {
        return [this.listActions.loadPage({ pageNumber: 1 }), this.listActions.loadPage({ pageNumber: 2 })];
      })
    )
  );

  loadPreviousPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.loadPreviousPage),
      withLatestFrom(this.store.pipe(select(this.listSelectors.getCurrentPageNumber))),
      filter(([, currentPageNumber]) => currentPageNumber > 1),
      map(([, currentPageNumber]) => this.listActions.loadPage({ pageNumber: currentPageNumber - 1 }))
    )
  );

  loadNextPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.loadNextPage),
      withLatestFrom(
        this.store.pipe(select(this.listSelectors.isLastPage)),
        this.store.pipe(select(this.listSelectors.getCurrentPageNumber))
      ),
      filter(([, isLastPage]) => !isLastPage),
      map(([, , currentPageNumber]) => this.listActions.loadPage({ pageNumber: currentPageNumber + 1 }))
    )
  );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.refresh),
      withLatestFrom(this.store.pipe(select(this.listSelectors.getCurrentPageNumber))),
      switchMap(([, currentPageNumber]) => [
        this.listActions.loadPage({ pageNumber: currentPageNumber }),
        this.listActions.loadPage({ pageNumber: currentPageNumber + 1 })
      ])
    )
  );

  changeRequestOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        this.listActions.changePageSize,
        this.listActions.changeSorting,
        this.listActions.changeFiltering,
        this.listActions.loadFirstPage
      ),
      map(() => this.listActions.initialize())
    )
  );

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.loadPage),
      withLatestFrom(
        this.store.pipe(select(this.listSelectors.getPagingOptions)),
        this.store.pipe(select(this.listSelectors.getSortingOptions)),
        this.store.pipe(select(this.listSelectors.getFilteringOptions))
      ),
      concatMap(
        ([{ pageNumber }, pagingOptions, sortingOptions, filteringOptions]: [
          { pageNumber: number },
          PagingOptions,
          SortingOptions,
          FilteringOptions
        ]) => {
          pagingOptions = {
            page: pageNumber,
            pageSize: pagingOptions.pageSize
          };

          return this.service
            .queryResources({
              pagingOptions,
              sortingOptions,
              filteringOptions
            })
            .pipe(
              map(resources =>
                this.listActions.loadPageSuccess({
                  resources,
                  pagingOptions
                })
              ),
              catchError((error: ListErrors) => of(this.listActions.loadPageFailure({ error })))
            );
        }
      )
    )
  );

  patch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.patch),
      exhaustMap(action =>
        this.service.patchResources(action.resourceIds, action.resource).pipe(
          switchMap(resources => [this.listActions.patchSuccess({ resources }), this.listActions.refresh()]),
          catchError((error: ListErrors) => this.addGeneralErrorsArguments$(error, this.listActions.patchFailure))
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.delete),
      exhaustMap(({ resourceIds }) =>
        this.service.deleteResources(resourceIds).pipe(
          switchMap(() => [this.listActions.deleteSuccess({ resourceIds }), this.listActions.refresh()]),
          catchError((error: ListErrors) => this.addGeneralErrorsArguments$(error, this.listActions.deleteFailure))
        )
      )
    )
  );

  loadSelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.loadSelected),
      withLatestFrom(this.store.pipe(select(this.listSelectors.getSelectionRecord))),
      switchMap(([{ selectedResourceIds }, selected]) => {
        const areAlreadyLoaded = selectedResourceIds.every(resourceId => !!selected[resourceId]);
        if (areAlreadyLoaded) {
          return of(this.listActions.loadSelectedSuccess({ resources: [] }));
        }

        const missingResourceIds = selectedResourceIds.filter(resourceId => !selected[resourceId]);

        return this.service
          .queryResources({
            pagingOptions: {
              page: 1,
              pageSize: DEFAULT_PAGE_SIZE
            },
            sortingOptions: {},
            filteringOptions: createFilteringByResourceIds(missingResourceIds)
          })
          .pipe(
            map(resources => this.listActions.loadSelectedSuccess({ resources })),
            catchError((error: ListErrors) => of(this.listActions.loadSelectedFailure({ error })))
          );
      })
    )
  );

  copySelected$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(this.listActions.copySelected),
        withLatestFrom(this.store.pipe(select(this.listSelectors.getSelectedResourceIds))),
        tap(([, resourceIds]) => {
          this.router.navigate([resourceIds[0]], { state: { selectedResourceId: resourceIds[0] } });
        })
      ),
    { dispatch: false }
  );

  navigateToSelected$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(this.listActions.navigateToSelected),
        tap(action => {
          this.router.navigate([action.resourceId]);
        })
      ),
    { dispatch: false }
  );

  handleFailure$ = handleFailureEffect(
    this.actions$,
    this.listActions.loadPageFailure,
    this.listActions.deleteFailure,
    this.listActions.loadSelectedFailure,
    this.listActions.patchFailure
  );

  protected constructor(
    protected readonly router: Router,
    protected readonly actions$: Actions,
    protected readonly store: Store,
    private readonly service: ListService<T, S>,
    private readonly listActions: ListActions<T, S>,
    private readonly listSelectors: ListSelectors<S>
  ) {}

  protected addGeneralErrorsArguments$(
    errors: ListErrors,
    failureAction: ActionCreator<string, ({ error }: { error: ListErrors }) => TypedAction<string>>
  ): Observable<TypedAction<string>> {
    return of(failureAction({ error: errors }));
  }
}
