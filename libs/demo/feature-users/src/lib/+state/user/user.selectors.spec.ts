import { ImageDto } from '@demo/shared/acm/data-access/common';
import { UserDto } from '@demo/shared/acm/data-access/users';
import { avatarDtoFixture, userDtoFixture } from '@demo/shared/acm/data-access/users/test';
import { RequestState } from '@demo/shared/data-access';
import { formSelectors } from './user.selectors';

describe('users formSelectors', () => {
  let user: UserDto;
  let avatar: ImageDto;

  beforeEach(() => {
    user = userDtoFixture.createPersistentUser();
    avatar = avatarDtoFixture.createPersistentAvatar();
  });

  describe('isReady', () => {
    it('returns true if the user and avatar are defined.', () => {
      expect(formSelectors.isReady.projector(user, avatar, RequestState.SUCCESS)).toBe(true);
    });

    it('returns true if the user is defined and the user avatar does not exit.', () => {
      user.avatarReference = null;
      expect(formSelectors.isReady.projector(user, undefined, RequestState.SUCCESS)).toBe(true);
    });

    it('returns false if the user is not defined.', () => {
      expect(formSelectors.isReady.projector(undefined, avatar, RequestState.SUCCESS)).toBe(false);
    });

    it('returns false if the avatar is not defined.', () => {
      expect(formSelectors.isReady.projector(user, undefined, RequestState.SUCCESS)).toBe(false);
    });

    it('returns false if the loading state is not success.', () => {
      expect(formSelectors.isReady.projector(user, undefined, RequestState.IN_PROGRESS)).toBe(false);
    });
  });
});
