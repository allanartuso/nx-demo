import { AbstractFormEffects } from '@demo/shared/util-store';
import { UserEffects } from './user.effects';

describe('UserEffects', () => {
  it('shout extend abstract form effects', () => {
    expect(UserEffects.prototype).toBeInstanceOf(AbstractFormEffects);
  });
});
