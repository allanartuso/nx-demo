// TODO: move to a common lib
import { commonFixture } from '@demo/shared/data-model/test';

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
