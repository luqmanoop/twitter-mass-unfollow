let shared = {};
(async () => {
  const sharedSrc = chrome.runtime.getURL("shared.js");
  shared = await import(sharedSrc);
})();

let scrollHandle;
const cleanupHandle = setInterval(() => cleanup(), 1500);

const cleanup = () => {
  if (!shared.isExtensionPage() && scrollHandle) {
    clearInterval(scrollHandle);
    clearInterval(cleanupHandle);
  }
};

const getAccountsToUnfollow = async (unfollowAll = false) => {
  const followings = Array.from(
    document.querySelectorAll('[aria-label~="Following"][role=button]')
  );

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

async function scroll() {
  const html = document.querySelector("html");
  const timelineFollowing = document.querySelector(
    '[aria-label="Timeline: Following"]'
  );
  const scrollBy = timelineFollowing.clientHeight;

  if (scrollHandle) clearInterval(scrollHandle);
  const accountsToUnffolow = await getAccountsToUnfollow();
  //   scrollHandle = setInterval(() => {
  //     html.scroll({
  //       top: timelineFollowing.offsetHeight + scrollBy,
  //       behavior: "smooth",
  //     });
  //   }, 3000);
}

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  switch (message.type) {
    case shared.UNFOLLOW_ALL:
      scroll();
      return;
    default:
      break;
  }
});
