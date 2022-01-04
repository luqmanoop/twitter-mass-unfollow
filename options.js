import * as shared from "./shared.js";

const form = document.querySelector("form");
const timerCheckbox = document.querySelector("#timer");
const reloadOnStoppedCheckbox = document.querySelector("#reload-on-stopped");

Promise.all([
  shared.storage.get(shared.timerKey),
  shared.storage.get(shared.reloadOnStoppedKey),
])
  .then(([timer, reload]) => {
    timerCheckbox.checked = timer;
    reloadOnStoppedCheckbox.checked = reload;
  })
  .catch(console.log);

[timerCheckbox, reloadOnStoppedCheckbox].forEach((elem) => {
  elem.addEventListener("change", (e) => {
    const key = e.target.getAttribute("data-key");
    console.log(key);
    shared.storage.set(key, e.target.checked);
  });
});

shared.storage.get(shared.whiteListedUsersKey).then((whitelistedUsers) => {
  if (!whitelistedUsers) return;
  document.querySelector("textarea").value = whitelistedUsers.join(", ");
});

const showNotification = async () => {
  const notification = document.querySelector(".notification");
  notification.style.visibility = "visible";
  await shared.delay(1000);
  notification.style.visibility = "hidden";
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let whitelistedUsers = document.querySelector("textarea").value;
  whitelistedUsers = whitelistedUsers
    .split(",")
    .filter(Boolean)
    .map((username) => username.trim().toLowerCase());
  shared.storage
    .set(shared.whiteListedUsersKey, whitelistedUsers)
    .then(showNotification);
});
