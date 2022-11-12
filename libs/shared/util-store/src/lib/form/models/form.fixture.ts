import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormService } from '@demo/shared/data-model';
import { Actions } from '@ngrx/effects';
import { createFeatureSelector, Store } from '@ngrx/store';
import { AbstractFormEffects } from '../+state/abstract-form-effects';
import { createFormActions } from '../+state/form-actions';
import { createFormSelectors } from '../+state/form-selectors';
import { featureKey } from '../../list/models/list.fixture';
import { TestResource } from '../../models/store.fixture';

export const formActions = createFormActions<TestResource>(featureKey);
export const formSelectors = createFormSelectors<TestResource>(createFeatureSelector(featureKey));
const mockSnackBar = {
  open: jest.fn()
} as unknown as MatSnackBar;

@Injectable()
export class TestFormService implements FormService<TestResource> {
  loadResource = jest.fn();
  saveResource = jest.fn();
  createResource = jest.fn();
  deleteResource = jest.fn();
}

@Injectable()
export class TestFormEffects extends AbstractFormEffects<TestResource> {
  constructor(router: Router, actions$: Actions, store: Store, testService: TestFormService) {
    super(router, actions$, store, testService, formActions, mockSnackBar);
  }
}
