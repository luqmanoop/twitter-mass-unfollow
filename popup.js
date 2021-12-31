import * as shared from "./shared.js";

const btn = document.querySelector("#btn");

btn.addEventListener("click", () => {
  console.log("starting");
  shared.sendMessage({ type: shared.UNFOLLOW_ALL });
});
