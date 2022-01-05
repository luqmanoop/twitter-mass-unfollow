const html = document.querySelector("html");
let timerHandle;
let previousScrollHeight = 0;
let stop;
const unfollowedUsers = [];

let shared = {}; // shared.js module
(async () => {
  const sharedSrc = chrome.runtime.getURL("shared.js");
  shared = await import(sharedSrc);
})();

const tmuWrapper = document.createElement("div");
tmuWrapper.className = "tmu-wrapper";

let totalUnfollowed = document.createElement("h1");
totalUnfollowed.textContent = -1230;
totalUnfollowed.className = "tmu-counter";

let img = document.createElement("img");
img.className = "tmu-img";
img.alt = "running";
img.src =
  "https://github.com/codeshifu/assets/blob/main/gifs/eevee.gif?raw=true";

tmuWrapper.appendChild(totalUnfollowed);
tmuWrapper.appendChild(img);

document.body.appendChild(tmuWrapper);

const showContentInDOM = () => {
  tmuWrapper.style.visibility = "visible";
};

const getFollowingsContainer = () => {
  return document.querySelector('[aria-label="Timeline: Following"]');
};

const getFollowings = () =>
  Array.from(
    document.querySelectorAll('[aria-label~="Following"][role=button]')
  );

const getUsername = (followingBtn) => {
  return followingBtn
    .getAttribute("aria-label")
    .toLowerCase()
    .replace("following @", "");
};

const filterFollowings = async (followings, unfollowNotFollowing) => {
  const whitelistedUsers = await shared.storage.get(shared.whiteListedUsersKey);

  const toUnfollow = followings.filter((followingBtn) => {
    if (!whitelistedUsers) return true;
    const username = getUsername(followingBtn);
    return !whitelistedUsers.includes(username);
  });

  return unfollowNotFollowing
    ? toUnfollow.filter((following) => {
        const elem = Array.from(
          following.parentElement.parentElement.firstElementChild.querySelectorAll(
            "span"
          )
        ).slice(-1)[0];

        if (!elem) return true;
        return !elem.textContent.toLowerCase().includes("follows you");
      })
    : toUnfollow;
};

const confirmUnfollow = () => {
  document
    .querySelector("[data-testid=confirmationSheetDialog] div[role=button]")
    .click();
};

const unfollow = async (followingButtons = [], demo) => {
  for (const followingButton of followingButtons) {
    const username = getUsername(followingButton);
    if (!unfollowedUsers.includes(username)) {
      unfollowedUsers.push(username);
      totalUnfollowed.textContent = `-${unfollowedUsers.length}`;

      if (demo) {
        followingButton.firstElementChild.firstElementChild.firstElementChild.textContent =
          "Follow";
      } else {
        followingButton.click();
        confirmUnfollow();
      }
      await shared.delay(500);
    }
  }
};

const scrollFollowingList = async ({ unfollowNotFollowing, demo } = {}) => {
  if (
    previousScrollHeight !== html.scrollHeight &&
    !stop &&
    shared.isExtensionPage()
  ) {
    previousScrollHeight = html.scrollHeight;

    const followingsContainer = getFollowingsContainer();
    const scrollBy = followingsContainer.clientHeight;

    const followings = getFollowings();
    const accountsToUnffolow = await filterFollowings(
      followings,
      unfollowNotFollowing
    );

    await unfollow(accountsToUnffolow, demo);

    html.scroll({
      top: followingsContainer.offsetHeight + scrollBy,
      behavior: "smooth",
    });

    await shared.delay(3000);
    scrollFollowingList({ unfollowNotFollowing, demo });
  }
};

const stopUnfollowing = async () => {
  stop = true;
  if (timerHandle) clearInterval(timerHandle);

  const shouldReload = await shared.storage.get(shared.reloadOnStoppedKey);
  img.src =
    "https://github.com/codeshifu/assets/blob/main/gifs/mario_wave.gif?raw=true";
  await shared.delay(2000);
  if (shouldReload) window.location.reload();
  tmuWrapper.style.visibility = "hidden";
  img.src =
    "https://github.com/codeshifu/assets/blob/main/gifs/eevee.gif?raw=true";
};

const startTimer = () => {
  shared.storage.get(shared.timerKey).then((autoStop) => {
    if (autoStop) {
      timerHandle = setTimeout(() => stopUnfollowing(), 1000 * 60); // 60secs
    }
  });
};

const run = ({ unfollowNotFollowing, demo } = {}) => {
  stop = false;
  showContentInDOM();
  scrollFollowingList({ unfollowNotFollowing, demo });
  startTimer();
};

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  switch (message.type) {
    case shared.UNFOLLOW_ALL:
      run();
      return;
    case shared.UNFOLLOW_NOT_FOLLOWING:
      run({ unfollowNotFollowing: true });
      return;
    case shared.DEMO:
      run({ demo: true });
      return;
    case shared.STOP:
      stopUnfollowing();
      return;
    case shared.CHECK_IN_PROGRESS:
      reply({ payload: previousScrollHeight !== 0 && !stop });
      return;
    default:
      break;
  }
});
