let shared = {};
(async () => {
  const sharedSrc = chrome.runtime.getURL("shared.js");
  shared = await import(sharedSrc);
})();

let intervalHandle;

function scroll() {
  const html = document.querySelector("html");
  const timelineFollowing = document.querySelector(
    '[aria-label="Timeline: Following"]'
  );

  const scrollBy = timelineFollowing.clientHeight;

  if (intervalHandle) clearInterval(intervalHandle);

  intervalHandle = setInterval(() => {
    html.scroll({
      top: timelineFollowing.offsetHeight + scrollBy,
      behavior: "smooth",
    });
  }, 3000);
}

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  switch (message.type) {
    case shared.UNFOLLOW_ALL:
      console.log("here we go");
      scroll();
      return;
    default:
      break;
  }
});
