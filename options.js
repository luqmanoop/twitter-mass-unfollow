import * as shared from "./shared.js";

const form = document.querySelector("form");

shared.storage.get(shared.whiteListedUsersKey).then((whitelistedUsers) => {
  if (!whitelistedUsers) return;
  document.querySelector("textarea").value = whitelistedUsers.join(", ");
});

const showSavedNotification = async () => {
  const notification = document.querySelector(".notification");
  notification.style.display = "block";
  await shared.delay(1000);
  notification.style.display = "none";
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
    .then(showSavedNotification);
});
