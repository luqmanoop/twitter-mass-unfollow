const html = document.querySelector("html");
let img = document.createElement("img");
img.style.position = "fixed";
img.style.right = "20px";
img.style.bottom = "50px";
img.style.width = "80px";
img.alt = "running";
img.style.zIndex = 10;
img.style.visibility = "hidden";
img.src =
  "https://github.com/codeshifu/assets/blob/main/gifs/eevee.gif?raw=true";

document.body.appendChild(img);

let timerHandle;
let previousScrollHeight = 0;
let stop;

let shared = {}; // shared.js module
(async () => {
  const sharedSrc = chrome.runtime.getURL("shared.js");
  shared = await import(sharedSrc);
})();

const showImage = () => {
  img.style.visibility = "visible";
};

const getFollowingsContainer = () => {
  return document.querySelector('[aria-label="Timeline: Following"]');
};

const getFollowings = () =>
  Array.from(
    document.querySelectorAll('[aria-label~="Following"][role=button]')
  );

const filterFollowings = async (followings, unfollowNotFollowing) => {
  const whitelistedUsers = await shared.storage.get(shared.whiteListedUsersKey);

  const toUnfollow = followings.filter((following) => {
    if (!whitelistedUsers) return true;
    const username = following
      .getAttribute("aria-label")
      .toLowerCase()
      .replace("following @", "");

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

const unfollow = async (unfollowButtons = [], demo) => {
  for (const unfollowButton of unfollowButtons) {
    if (demo) {
      unfollowButton.firstElementChild.firstElementChild.firstElementChild.textContent =
        "Follow";
    } else {
      unfollowButton.click();
      confirmUnfollow();
    }
    await shared.delay(50);
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
  if (shouldReload) {
    img.src =
      "https://github.com/codeshifu/assets/blob/main/gifs/mario_wave.gif?raw=true";

    await shared.delay(3000);
    window.location.reload();
  }
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
  showImage();
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
