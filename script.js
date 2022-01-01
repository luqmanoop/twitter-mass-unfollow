const html = document.querySelector("html");
let previousScrollHeight = 0;
let stop;

let shared = {}; // shared.js module
(async () => {
  const sharedSrc = chrome.runtime.getURL("shared.js");
  shared = await import(sharedSrc);
})();

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

const unfollow = async (unfollowButtons = []) => {
  for (const unfollowButton of unfollowButtons) {
    // unfollowButton.click();
    // confirmUnfollow();
    await shared.delay(50);
  }
};

const scroll = async (notFollowing) => {
  if (
    previousScrollHeight !== html.scrollHeight &&
    !stop &&
    shared.isExtensionPage()
  ) {
    previousScrollHeight = html.scrollHeight;

    const followingsContainer = getFollowingsContainer();
    const scrollBy = followingsContainer.clientHeight;

    const followings = getFollowings();
    const accountsToUnffolow = await filterFollowings(followings, notFollowing);

    await unfollow(accountsToUnffolow);

    html.scroll({
      top: followingsContainer.offsetHeight + scrollBy,
      behavior: "smooth",
    });

    await shared.delay(3000);
    scroll(notFollowing);
  }
};

const startTimer = () => {
  shared.storage.get(shared.timerKey).then((autoStop) => {
    console.log(autoStop);
    if (autoStop) {
      setTimeout(() => {
        stop = true;
      }, 1000 * 60);
    }
  });
};

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  switch (message.type) {
    case shared.UNFOLLOW_ALL:
      stop = false;
      scroll();
      startTimer();
      return;
    case shared.UNFOLLOW_NOT_FOLLOWING:
      stop = false;
      scroll(true);
      startTimer();
      return;
    case shared.STOP:
      stop = true;
      return;
    default:
      break;
  }
});
