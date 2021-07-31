import { Injectable } from '@angular/core';
import { ErrorsVm, ListService, PatchResourceDto, ResourceDto } from '@demo/shared/acm/data-access/common';
import { resourceDtoFixture } from '@demo/shared/acm/data-access/common/test';
import { commonFixture } from '@demo/shared/data-access/test';
import { Actions } from '@ngrx/effects';
import { ActionCreator, createFeatureSelector, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable } from 'rxjs';
import { AbstractListEffects, createListActions, createListEntityAdapter, createListSelectors } from '../..';

export interface TestResourceDto extends ResourceDto {
  name: string;
}

export type PatchTestResource = PatchResourceDto<TestResourceDto>;
export type TestSummaryDto = TestResourceDto;

export function createTestResourceDtos(
  tenantId: number = commonFixture.getPositiveNumber(),
  nbOfForwarders = 3
): TestResourceDto[] {
  const result: TestResourceDto[] = [];

  for (let i = 0; i < nbOfForwarders; i++) {
    result.push(createTestResourceDto(tenantId));
  }

  return result;
}

export function createTestResourceDto(tenantId?: number): TestResourceDto {
  return {
    ...resourceDtoFixture.createPersistentResourceDto(tenantId),
    name: commonFixture.getWord()
  };
}

export const featureKey = 'testFeature';
export const resourcesActions = createListActions<TestResourceDto, PatchTestResource, TestSummaryDto>(featureKey);
export const testEntityAdapter = createListEntityAdapter<TestResourceDto>();
export const resourcesSelectors = createListSelectors<TestResourceDto>(
  testEntityAdapter,
  createFeatureSelector(featureKey)
);

@Injectable()
export class TestService implements ListService<TestResourceDto, PatchTestResource, TestSummaryDto> {
  queryResources;
  patchResources;
  deleteResources;
}

@Injectable()
export class TestEffects extends AbstractListEffects<TestResourceDto, PatchTestResource, TestSummaryDto> {
  constructor(actions$: Actions, store: Store, testService: TestService) {
    super(actions$, store, testService, resourcesActions, resourcesSelectors);
  }

  addGeneralErrorsArguments$(
    errors: ErrorsVm,
    failureAction: ActionCreator<string, ({ error }: { error: ErrorsVm }) => TypedAction<string>>
  ): Observable<TypedAction<string>> {
    return super.addGeneralErrorsArguments$(errors, failureAction);
  }
}
