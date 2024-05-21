import { MessageType, type RunOptions } from './types';
import { $, storage, waitForElement, waitFor, isExtensionPage } from './utils';

const html = document.querySelector('html')!;
const unFollowedUsers: string[] = [];

let timerHandler: ReturnType<typeof setTimeout> | null = null;
let previousScrollHeight = 0;
let inProgress: boolean = false;

const tmuWrapper = $.create('div');
tmuWrapper.style.cssText = `
  position: fixed;
  right: 20px;
  bottom: 70px;
  z-index: 10;
  display: flex;
  visibility: hidden;`.trim();

let totalUnFollowed = $.create('h1');

totalUnFollowed.textContent = '-1230';
totalUnFollowed.style.cssText = `
  background: #1da1f2;
  color: #fff;
  font-weight: bold;
  border-radius: 50%;
  margin-right: 10px;
  font-size: 16px;
  width: 50px;
  height: 50px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
`;

let img = $.create('img');
img.style.width = '80px';
img.alt = 'running';
img.src =
  'https://github.com/luqmanoop/assets/blob/main/gifs/eevee.gif?raw=true';

tmuWrapper.appendChild(totalUnFollowed);
tmuWrapper.appendChild(img);

document.body.appendChild(tmuWrapper);

const showContentInDOM = () => {
  tmuWrapper.style.visibility = 'visible';
};

const getFollowingsContainer = () => {
  return $.one<HTMLDivElement>('section[role=region] div');
};

const getFollowingButtons = () => {
  return Array.from(
    $.many<HTMLButtonElement>("button[data-testid$='-unfollow']")
  );
};

const getUsername = (followingBtn: HTMLButtonElement) => {
  return (
    followingBtn.getAttribute('aria-label')?.toLowerCase().replace(/.*@/, '') ||
    ''
  );
};

const filterFollowings = async (
  followings: HTMLButtonElement[],
  unFollowNotFollowing: boolean
) => {
  const whitelistedUsers = await storage.get(storage.whiteListedUsersKey);

  const accountsToUnFollow = followings.filter((followingBtn) => {
    if (!whitelistedUsers) return true;
    const username = getUsername(followingBtn);
    return !whitelistedUsers.includes(username);
  });

  return unFollowNotFollowing
    ? accountsToUnFollow.filter((following) => {
        const followsYou =
          !!following.parentElement?.parentElement?.querySelector(
            '[data-testid="userFollowIndicator"]'
          );

        return followsYou ? false : true;
      })
    : accountsToUnFollow;
};

const confirmUnFollow = async () => {
  const confirmUnFollowButton = await waitForElement(
    '[data-testid=confirmationSheetDialog] button[data-testid=confirmationSheetConfirm]'
  );

  if (!confirmUnFollowButton) {
    inProgress = false;
    console.log('confirm unfollow button not found');
    return;
  }

  confirmUnFollowButton.click();
};

const unFollow = async (
  followingButtons: HTMLButtonElement[] = [],
  demo: boolean
) => {
  for (const followingButton of followingButtons) {
    const username = getUsername(followingButton);
    if (!unFollowedUsers.includes(username)) {
      unFollowedUsers.push(username);
      totalUnFollowed.textContent = `-${unFollowedUsers.length}`;

      if (demo) {
        const [element] = Array.from(
          followingButton.querySelectorAll('span')
        ).splice(-1);

        if (element) element.textContent = 'Follow';
      } else {
        followingButton.click();
        await confirmUnFollow();
      }
      await waitFor(500);
    }
  }
};

const scrollFollowingList = async (options: RunOptions) => {
  const { shouldUnFollowNotFollowingOnly = false, isDemo = false } =
    options || {};
  if (
    previousScrollHeight !== html.scrollHeight &&
    inProgress &&
    isExtensionPage()
  ) {
    previousScrollHeight = html.scrollHeight;

    const followingsContainer = getFollowingsContainer();

    const followings = getFollowingButtons();
    const accountsToUnfollow = await filterFollowings(
      followings,
      shouldUnFollowNotFollowingOnly
    );

    await unFollow(accountsToUnfollow, isDemo);

    if (followingsContainer) {
      const scrollBy = followingsContainer.clientHeight;

      html.scroll({
        top: followingsContainer.offsetHeight + scrollBy,
        behavior: 'smooth',
      });
    }

    await waitFor(3000);
    scrollFollowingList({
      shouldUnFollowNotFollowingOnly,
      isDemo: isDemo,
    });
  }
};

const abort = async () => {
  if (!inProgress) return;

  inProgress = false;
  if (timerHandler) clearInterval(timerHandler);

  const shouldReload = await storage.get(storage.reloadOnStoppedKey);
  img.src =
    'https://github.com/luqmanoop/assets/blob/main/gifs/mario_wave.gif?raw=true';
  await waitFor(2000);
  if (shouldReload) window.location.reload();
  tmuWrapper.style.visibility = 'hidden';
  img.src =
    'https://github.com/luqmanoop/assets/blob/main/gifs/eevee.gif?raw=true';
};

const startTimer = () => {
  storage.get(storage.timerKey).then((autoStop) => {
    if (autoStop) {
      timerHandler = setTimeout(() => abort(), 1000 * 60); // 60secs
    }
  });
};

const run = (options?: RunOptions) => {
  const { shouldUnFollowNotFollowingOnly = false, isDemo = false } =
    options || {};

  if (inProgress) return;

  inProgress = true;
  showContentInDOM();
  scrollFollowingList({
    shouldUnFollowNotFollowingOnly,
    isDemo: isDemo,
  });
  startTimer();
};

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  try {
    switch (message.type) {
      case MessageType.UNFOLLOW_ALL:
        run();
        return;
      case MessageType.UNFOLLOW_NOT_FOLLOWING:
        run({ shouldUnFollowNotFollowingOnly: true });
        return;
      case MessageType.DEMO:
        run({ isDemo: true });
        return;
      case MessageType.STOP:
        abort();
        return;
      case MessageType.CHECK_IN_PROGRESS:
        reply({ payload: previousScrollHeight !== 0 && inProgress });
        return;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

window.addEventListener('beforeunload', () => abort());

document.body.addEventListener('click', () => {
  if (!isExtensionPage() && inProgress) abort();
});
