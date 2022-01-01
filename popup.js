import * as shared from "./shared.js";

const unfollowAllBtn = document.querySelector("#unfollow-all");
const unfollowNotFollowingBtn = document.querySelector(
  "#unfollow-not-following"
);

unfollowAllBtn.addEventListener("click", () => {
  shared.sendMessage({ type: shared.UNFOLLOW_ALL });
});

unfollowNotFollowingBtn.addEventListener("click", () => {
  shared.sendMessage({ type: shared.UNFOLLOW_NOT_FOLLOWING });
});
