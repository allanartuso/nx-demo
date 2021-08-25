import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorDto, FormService } from '@demo/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { handleFailureEffect } from '../../utils/effects-handle-failure';
import { FormActions } from '../models/form.model';

export abstract class AbstractFormEffects<T> {
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.load),
      switchMap(({ id }) =>
        this.service.loadResource(id).pipe(
          map(resource => this.formActions.loadSuccess({ resource })),
          catchError((error: ErrorDto) => of(this.formActions.loadFailure({ error })))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.create),
      switchMap(action =>
        this.service.createResource(action.resource).pipe(
          map(resource => this.formActions.createSuccess({ resource })),
          catchError((error: ErrorDto) => of(this.formActions.createFailure({ error })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.save),
      switchMap(({ resource }) =>
        this.service.saveResource(resource).pipe(
          map(response => this.formActions.saveSuccess({ resource: response })),
          catchError((error: ErrorDto) => of(this.formActions.saveFailure({ error })))
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.delete),
      exhaustMap(action =>
        this.service.deleteResource(action.id).pipe(
          map(() => this.formActions.deleteSuccess({ id: action.id })),
          catchError((error: ErrorDto) => of(this.formActions.deleteFailure({ error })))
        )
      )
    )
  );

  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.deleteSuccess),
      tap(() => {
        this.snackBar.open('The resource was removed successfully', 'OK');
        this.router.navigate(['..']);
      })
    )
  );

  createSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.createSuccess),
      tap(() => {
        this.router.navigate(['..']);
      })
    )
  );

  navigateToCreateResource$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.navigateToCreate),
      map(() => this.formActions.reset()),
      tap(() => {
        this.router.navigate(['..']);
      })
    )
  );

  copy$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(this.formActions.copy),
        tap(() => {
          this.router.navigate(['..']);
        })
      ),
    { dispatch: false }
  );

  copySelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.copySelected),
      map(({ id }) => this.formActions.load({ id }))
    )
  );

  handleFailure$ = handleFailureEffect(
    this.actions$,
    this.formActions.saveFailure,
    this.formActions.loadFailure,
    this.formActions.deleteFailure,
    this.formActions.createFailure
  );

  protected constructor(
    private readonly router: Router,
    protected readonly actions$: Actions,
    protected readonly store: Store,
    private readonly service: FormService<T>,
    private readonly formActions: FormActions<T>,
    private readonly snackBar: MatSnackBar
  ) {}
}
