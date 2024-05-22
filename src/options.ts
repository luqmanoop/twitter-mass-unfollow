import { $, waitFor, storage } from './utils';

const form = $.one<HTMLFormElement>('form')!;
const timerCheckbox = $.one<HTMLInputElement>('#timer')!;
const reloadOnStoppedCheckbox = $.one<HTMLInputElement>('#reload-on-stopped')!;

Promise.all([
  storage.get(storage.timerKey),
  storage.get(storage.reloadOnStoppedKey),
])
  .then(([timer, reload]: Array<boolean>) => {
    timerCheckbox.checked = timer;
    reloadOnStoppedCheckbox.checked = reload;
  })
  .catch(console.log);

[timerCheckbox, reloadOnStoppedCheckbox].forEach((elem) => {
  elem.addEventListener('change', (e) => {
    const checkbox = e.target as HTMLInputElement;
    const key = checkbox.getAttribute('data-key');

    if (!key) return;

    storage.set(key, checkbox.checked);
  });
});

storage.get(storage.whiteListedUsersKey).then((whitelistedUsers) => {
  if (!whitelistedUsers) return;

  const whitelistTextBox = $.one<HTMLTextAreaElement>('textarea');

  if (!whitelistTextBox) return;

  whitelistTextBox.value = whitelistedUsers.join(', ');
});

const showNotification = async () => {
  const notification = $.one<HTMLParagraphElement>('.notification');

  if (!notification) return;

  notification.style.visibility = 'visible';
  
  await waitFor(1000);

  notification.style.visibility = 'hidden';
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const whitelistTextBox = $.one<HTMLTextAreaElement>('textarea');

  if (!whitelistTextBox) return;

  let whitelistedUsers = whitelistTextBox.value
    .split(',')
    .filter(Boolean)
    .map((username) => username.trim().toLowerCase());

  storage
    .set(storage.whiteListedUsersKey, whitelistedUsers)
    .then(showNotification);
});
