import * as shared from "./shared.js";

const btn = document.querySelector("#btn");

btn.addEventListener("click", () => {
  shared.sendMessage({ type: shared.UNFOLLOW_ALL });
});
