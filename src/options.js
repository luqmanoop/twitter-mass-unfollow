import * as utils from './utils.js';

const form = document.querySelector('form');
const timerCheckbox = document.querySelector('#timer');
const reloadOnStoppedCheckbox = document.querySelector('#reload-on-stopped');

Promise.all([
  utils.storage.get(utils.timerKey),
  utils.storage.get(utils.reloadOnStoppedKey),
])
  .then(([timer, reload]) => {
    timerCheckbox.checked = timer;
    reloadOnStoppedCheckbox.checked = reload;
  })
  .catch(console.log);

[timerCheckbox, reloadOnStoppedCheckbox].forEach((elem) => {
  elem.addEventListener('change', (e) => {
    const key = e.target.getAttribute('data-key');
    console.log(key);
    utils.storage.set(key, e.target.checked);
  });
});

utils.storage.get(utils.whiteListedUsersKey).then((whitelistedUsers) => {
  if (!whitelistedUsers) return;
  document.querySelector('textarea').value = whitelistedUsers.join(', ');
});

const showNotification = async () => {
  const notification = document.querySelector('.notification');
  notification.style.visibility = 'visible';
  await utils.delay(1000);
  notification.style.visibility = 'hidden';
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let whitelistedUsers = document.querySelector('textarea').value;
  whitelistedUsers = whitelistedUsers
    .split(',')
    .filter(Boolean)
    .map((username) => username.trim().toLowerCase());
  utils.storage
    .set(utils.whiteListedUsersKey, whitelistedUsers)
    .then(showNotification);
});
