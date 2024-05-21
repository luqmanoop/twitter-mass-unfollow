'use strict';

import * as utils from './utils.js';

const html = document.querySelector('html');
let timerHandle;
let previousScrollHeight = 0;
let inProgress;
const unFollowedUsers = [];

const tmuWrapper = document.createElement('div');
tmuWrapper.style.cssText = `
  position: fixed;
  right: 20px;
  bottom: 70px;
  z-index: 10;
  display: flex;
  visibility: hidden;`.trim();

let totalUnFollowed = document.createElement('h1');
totalUnFollowed.textContent = -1230;
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

let img = document.createElement('img');
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
  return document.querySelector('section[role=region] div');
};

const getFollowingButtons = () =>
  Array.from(document.querySelectorAll("button[data-testid$='-unfollow']"));

const getUsername = (followingBtn) => {
  return followingBtn
    .getAttribute('aria-label')
    .toLowerCase()
    .replace(/.*@/, '');
};

const filterFollowings = async (followings, unfollowNotFollowing) => {
  const whitelistedUsers = await utils.storage.get(utils.whiteListedUsersKey);

  const toUnfollow = followings.filter((followingBtn) => {
    if (!whitelistedUsers) return true;
    const username = getUsername(followingBtn);
    return !whitelistedUsers.includes(username);
  });

  return unfollowNotFollowing
    ? toUnfollow.filter((following) => {
        const followsYou =
          !!following.parentElement.parentElement.querySelector(
            '[data-testid="userFollowIndicator"]'
          );

        return followsYou ? false : true;
      })
    : toUnfollow;
};

const confirmUnfollow = async () => {
  const confirmUnfollowButton = await utils.waitForElement(
    '[data-testid=confirmationSheetDialog] button[data-testid=confirmationSheetConfirm]'
  );

  if (!confirmUnfollowButton) {
    inProgress = false;
    console.log('confirm unfollow button not found');
    return;
  }

  confirmUnfollowButton.click();
};

const unfollow = async (followingButtons = [], demo) => {
  for (const followingButton of followingButtons) {
    const username = getUsername(followingButton);
    if (!unFollowedUsers.includes(username)) {
      unFollowedUsers.push(username);
      totalUnFollowed.textContent = `-${unFollowedUsers.length}`;

      if (demo) {
        followingButton.firstElementChild.firstElementChild.firstElementChild.textContent =
          'Follow';
      } else {
        followingButton.click();
        await confirmUnfollow();
      }
      await utils.delay(500);
    }
  }
};

const scrollFollowingList = async ({ unfollowNotFollowing, demo } = {}) => {
  if (
    previousScrollHeight !== html.scrollHeight &&
    inProgress &&
    utils.isExtensionPage()
  ) {
    previousScrollHeight = html.scrollHeight;

    const followingsContainer = getFollowingsContainer();
    const scrollBy = followingsContainer.clientHeight;

    const followings = getFollowingButtons();
    const accountsToUnfollow = await filterFollowings(
      followings,
      unfollowNotFollowing
    );

    await unfollow(accountsToUnfollow, demo);

    html.scroll({
      top: followingsContainer.offsetHeight + scrollBy,
      behavior: 'smooth',
    });

    await utils.delay(3000);
    scrollFollowingList({ unfollowNotFollowing, demo });
  }
};

const stopUnfollowing = async () => {
  if (!inProgress) return;

  inProgress = false;
  if (timerHandle) clearInterval(timerHandle);

  const shouldReload = await utils.storage.get(utils.reloadOnStoppedKey);
  img.src =
    'https://github.com/luqmanoop/assets/blob/main/gifs/mario_wave.gif?raw=true';
  await utils.delay(2000);
  if (shouldReload) window.location.reload();
  tmuWrapper.style.visibility = 'hidden';
  img.src =
    'https://github.com/luqmanoop/assets/blob/main/gifs/eevee.gif?raw=true';
};

const startTimer = () => {
  utils.storage.get(utils.timerKey).then((autoStop) => {
    if (autoStop) {
      timerHandle = setTimeout(() => stopUnfollowing(), 1000 * 60); // 60secs
    }
  });
};

const run = ({ unfollowNotFollowing, demo } = {}) => {
  if (inProgress) return;

  inProgress = true;
  showContentInDOM();
  scrollFollowingList({ unfollowNotFollowing, demo });
  startTimer();
};

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  try {
    switch (message.type) {
      case utils.UNFOLLOW_ALL:
        run();
        return;
      case utils.UNFOLLOW_NOT_FOLLOWING:
        run({ unfollowNotFollowing: true });
        return;
      case utils.DEMO:
        run({ demo: true });
        return;
      case utils.STOP:
        stopUnfollowing();
        return;
      case utils.CHECK_IN_PROGRESS:
        reply({ payload: previousScrollHeight !== 0 && inProgress });
        return;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

window.addEventListener('beforeunload', () => stopUnfollowing());

document.body.addEventListener('click', () => {
  if (!utils.isExtensionPage() && inProgress) stopUnfollowing();
});
