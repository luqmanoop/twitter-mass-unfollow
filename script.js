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

function scroll() {
  const html = document.querySelector("html");
  const timelineFollowing = document.querySelector(
    '[aria-label="Timeline: Following"]'
  );

  const scrollBy = timelineFollowing.clientHeight;

  if (scrollHandle) clearInterval(scrollHandle);

  scrollHandle = setInterval(() => {
    html.scroll({
      top: timelineFollowing.offsetHeight + scrollBy,
      behavior: "smooth",
    });
  }, 3000);
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
