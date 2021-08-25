import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormService } from '@demo/shared/data-access';
import { commonFixture } from '@demo/shared/data-access/test';
import { Actions } from '@ngrx/effects';
import { createFeatureSelector, Store } from '@ngrx/store';
import { AbstractFormEffects } from '../+state/abstract-form-effects';
import { createFormActions } from '../+state/form-actions';
import { createFormSelectors } from '../+state/form-selectors';

export interface TestResource {
  id: string;
  name: string;
}

export function createTestResources(nResources = 3): TestResource[] {
  return [...Array(nResources)].map(() => createTestResource());
}

export function createTestResource(): TestResource {
  return {
    id: commonFixture.getWord(),
    name: commonFixture.getWord()
  };
}

export const featureKey = 'testFeature';
export const i18nScope = 'testScope';
export const formActions = createFormActions<TestResource>(featureKey);
export const formSelectors = createFormSelectors<TestResource>(createFeatureSelector(featureKey));
const mockSnackBar = {
  open: jest.fn()
} as unknown as MatSnackBar;

@Injectable()
export class TestService implements FormService<TestResource> {
  loadResource = jest.fn();
  saveResource = jest.fn();
  createResource = jest.fn();
  deleteResource = jest.fn();
}

@Injectable()
export class TestEffects extends AbstractFormEffects<TestResource> {
  constructor(router: Router, actions$: Actions, store: Store, testService: TestService) {
    super(router, actions$, store, testService, formActions, mockSnackBar);
  }
}
