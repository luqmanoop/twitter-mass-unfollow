import * as shared from "./shared.js";

let inProgress;

const stopBtn = document.querySelector("#stop");
const unfollowAllBtn = document.querySelector("#unfollow-all");
const unfollowNotFollowingBtn = document.querySelector(
  "#unfollow-not-following"
);

const unfollowAllBtnText = unfollowAllBtn.textContent;
const unfollowNotFollowingBtnText = unfollowNotFollowingBtn.textContent;

window.addEventListener("load", () => {
  shared.sendMessage({ type: shared.IN_PROGRESS }).then((value) => {
    if (value) rerenderButtons();
  });
});

const rerenderButtons = (reset) => {
  if (reset) {
    inProgress = false;

    unfollowAllBtn.textContent = unfollowAllBtnText;
    unfollowNotFollowingBtn.textContent = unfollowNotFollowingBtnText;

    unfollowAllBtn.disabled = false;
    unfollowNotFollowingBtn.disabled = false;
  } else {
    inProgress = true;

    unfollowAllBtn.textContent = "🧙🏻‍♂️...";
    unfollowNotFollowingBtn.textContent = "🧙🏻‍♂️...";

    unfollowAllBtn.disabled = true;
    unfollowNotFollowingBtn.disabled = true;
  }
};

unfollowAllBtn.addEventListener("click", () => {
  if (inProgress) return;
  rerenderButtons();
  shared.sendMessage({ type: shared.UNFOLLOW_ALL });
});

unfollowNotFollowingBtn.addEventListener("click", () => {
  if (inProgress) return;
  rerenderButtons();
  shared.sendMessage({ type: shared.UNFOLLOW_NOT_FOLLOWING });
});

stopBtn.addEventListener("click", () => {
  rerenderButtons(true);
  shared.sendMessage({ type: shared.STOP });
});
