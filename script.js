const html = document.querySelector("html");
let previousScrollHeight = 0;

let shared = {}; // shared.js module
(async () => {
  const sharedSrc = chrome.runtime.getURL("shared.js");
  shared = await import(sharedSrc);
})();

const delay = async (duration = 1000) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const getFollowingsContainer = () => {
  return document.querySelector('[aria-label="Timeline: Following"]');
};

const getFollowings = () =>
  Array.from(
    document.querySelectorAll('[aria-label~="Following"][role=button]')
  );

const filterFollowings = async (followings, unfollowAll = false) => {
  if (unfollowAll) return followings;

  const whitelistedUsers = await shared.storage.get(shared.whiteListedUsersKey);

  const toUnfollow = followings.filter((following) => {
    if (!whitelistedUsers) return true;
    const username = following
      .getAttribute("aria-label")
      .toLowerCase()
      .replace("following @", "");

    return !whitelistedUsers.includes(username);
  });

  return toUnfollow;
};

const confirmUnfollow = () => {
  document
    .querySelector("[data-testid=confirmationSheetDialog] div[role=button]")
    .click();
};

const unfollow = (unfollowButtons = []) => {
  unfollowButtons.forEach((unfollowButton) => {
    // unfollowButton.click();
    // confirmUnfollow();
    console.log('confirm unfollow')
  });
};

const scroll = async () => {
  if (previousScrollHeight !== html.scrollHeight) {
    previousScrollHeight = html.scrollHeight;

    const followingsContainer = getFollowingsContainer();
    const scrollBy = followingsContainer.clientHeight;

    const followings = getFollowings();
    const accountsToUnffolow = await filterFollowings(followings);

    unfollow(accountsToUnffolow);

    html.scroll({
      top: followingsContainer.offsetHeight + scrollBy,
      behavior: "smooth",
    });

    await delay(3000);
    scroll();
  }
};

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  switch (message.type) {
    case shared.UNFOLLOW_ALL:
      scroll();
      return;
    default:
      break;
  }
});
