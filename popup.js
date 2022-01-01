import * as shared from "./shared.js";

let running;

const stopBtn = document.querySelector("#stop");
const unfollowAllBtn = document.querySelector("#unfollow-all");
const unfollowNotFollowingBtn = document.querySelector(
  "#unfollow-not-following"
);

const unfollowAllBtnText = unfollowAllBtn.textContent;
const unfollowNotFollowingBtnText = unfollowNotFollowingBtn.textContent;

const setButtonsText = (reset) => {
  if (reset) {
    running = false;

    unfollowAllBtn.textContent = unfollowAllBtnText;
    unfollowNotFollowingBtn.textContent = unfollowNotFollowingBtnText;

    unfollowAllBtn.disabled = false;
    unfollowNotFollowingBtn.disabled = false;
  } else {
    running = true;
    
    unfollowAllBtn.textContent = "🧙🏻‍♂️...";
    unfollowNotFollowingBtn.textContent = "🧙🏻‍♂️...";

    unfollowAllBtn.disabled = true;
    unfollowNotFollowingBtn.disabled = true;
  }
};

unfollowAllBtn.addEventListener("click", () => {
  if (running) return;
  setButtonsText();
  shared.sendMessage({ type: shared.UNFOLLOW_ALL });
});

unfollowNotFollowingBtn.addEventListener("click", () => {
  if (running) return;
  setButtonsText();
  shared.sendMessage({ type: shared.UNFOLLOW_NOT_FOLLOWING });
});

stopBtn.addEventListener("click", () => {
  setButtonsText(true);
  shared.sendMessage({ type: shared.STOP });
});
