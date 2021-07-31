import { Injectable } from '@angular/core';
import { FormService } from '@demo/shared/data-access';
import { commonFixture } from '@demo/shared/data-access/test';
import { Actions } from '@ngrx/effects';
import { createFeatureSelector, Store } from '@ngrx/store';
import { AbstractFormEffects } from '../+state/abstract-form-effects';
import { createFormActions } from '../+state/form-actions';
import { createFormSelectors } from '../+state/form-selectors';

export interface TestResourceDto {
  id: string;
  name: string;
}

export function createTestResourceDto(id?: string): TestResourceDto {
  return {
    id: commonFixture.getWord(),
    name: commonFixture.getWord()
  };
}

export const featureKey = 'testFeature';
export const i18nScope = 'testScope';
export const formActions = createFormActions<TestResourceDto>(featureKey);
export const formSelectors = createFormSelectors<TestResourceDto>(createFeatureSelector(featureKey));

@Injectable()
export class TestService implements FormService<TestResourceDto> {
  loadResource;
  saveResource;
  createResource;
  deleteResource;
}

@Injectable()
export class TestEffects extends AbstractFormEffects<TestResourceDto> {
  constructor(actions$: Actions, store: Store, testService: TestService) {
    super(actions$, store, testService, formActions, formSelectors);
  }
}
