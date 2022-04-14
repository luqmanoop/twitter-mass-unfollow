import * as shared from "./shared.js";

let inProgress;

const demoBtn = document.querySelector("#demo");
const stopBtn = document.querySelector("#stop");
const unfollowAllBtn = document.querySelector("#unfollow-all");
const unfollowNotFollowingBtn = document.querySelector(
  "#unfollow-not-following"
);

const rerenderButtons = (reset) => {
  if (reset) {
    inProgress = false;
    unfollowAllBtn.disabled = false;
    unfollowNotFollowingBtn.disabled = false;
  } else {
    inProgress = true;
    unfollowAllBtn.disabled = true;
    unfollowNotFollowingBtn.disabled = true;
  }
};

window.addEventListener("load", async () => {
  const tab = await shared.getCurrentTab();
  shared
    .sendMessage({ type: shared.CHECK_IN_PROGRESS })
    .then((value) => {
      if (typeof value !== "boolean") {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["script.js"],
        });

        return;
      }

      if (value) rerenderButtons();
    })
    .catch(() => {
      console.log("inject it");
    });
});

const init = (type) => {
  if (inProgress) return;
  rerenderButtons();
  shared.sendMessage({ type });
};

demoBtn.addEventListener("click", () => init(shared.DEMO));

unfollowAllBtn.addEventListener("click", () => init(shared.UNFOLLOW_ALL));

unfollowNotFollowingBtn.addEventListener("click", () =>
  init(shared.UNFOLLOW_NOT_FOLLOWING)
);

stopBtn.addEventListener("click", () => {
  rerenderButtons(true);
  shared.sendMessage({ type: shared.STOP });
});
