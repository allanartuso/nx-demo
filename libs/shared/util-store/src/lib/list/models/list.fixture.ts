import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorDto, ListService } from '@demo/shared/data-model';
import { Actions } from '@ngrx/effects';
import { ActionCreator, createFeatureSelector, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable } from 'rxjs';
import { AbstractListEffects } from '../+state/abstract-list-effects';
import { createListActions } from '../+state/list-actions';
import { createListEntityAdapter } from '../+state/list-reducer';
import { createListSelectors } from '../+state/list-selectors';
import { TestResource } from '../../models/store.fixture';

export const featureKey = 'testFeature';
export const listActions = createListActions<TestResource>(featureKey);
export const testEntityAdapter = createListEntityAdapter<TestResource>();
export const listSelectors = createListSelectors<TestResource>(testEntityAdapter, createFeatureSelector(featureKey));

@Injectable()
export class TestListService implements ListService<TestResource> {
  queryResources = jest.fn();
  patchResources = jest.fn();
  deleteResources = jest.fn();
}

const mockSnackBar = { open: jest.fn() } as unknown as MatSnackBar;
const mockDialog = { open: jest.fn(), afterClosed: jest.fn() } as unknown as MatDialog;

@Injectable()
export class TestListEffects extends AbstractListEffects<TestResource> {
  constructor(router: Router, actions$: Actions, store: Store, testService: TestListService) {
    super(router, actions$, store, mockSnackBar, testService, listActions, listSelectors, mockDialog);
  }

  override addGeneralErrorsArguments$(
    errors: ErrorDto,
    failureAction: ActionCreator<string, ({ error }: { error: ErrorDto }) => TypedAction<string>>
  ): Observable<TypedAction<string>> {
    return super.addGeneralErrorsArguments$(errors, failureAction);
  }
}
