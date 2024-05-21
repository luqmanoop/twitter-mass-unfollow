import * as utils from './utils.js';

(function () {
  let inProgress;

  const demoBtn = document.querySelector('#demo');
  const stopBtn = document.querySelector('#stop');
  const unfollowAllBtn = document.querySelector('#unfollow-all');
  const unfollowNotFollowingBtn = document.querySelector(
    '#unfollow-not-following'
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

  window.addEventListener('load', async () => {
    const tab = await utils.getCurrentTab();
    utils
      .sendMessage({ type: utils.CHECK_IN_PROGRESS })
      .then((value) => {
        if (typeof value !== 'boolean') {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['contentScript.js'],
          });

          return;
        }

        if (value) rerenderButtons();
      })
      .catch(() => {
        console.log('inject it');
      });
  });

  const init = (type) => {
    if (inProgress) return;
    rerenderButtons();
    utils.sendMessage({ type });
  };

  demoBtn.addEventListener('click', () => init(utils.DEMO));

  unfollowAllBtn.addEventListener('click', () => init(utils.UNFOLLOW_ALL));

  unfollowNotFollowingBtn.addEventListener('click', () =>
    init(utils.UNFOLLOW_NOT_FOLLOWING)
  );

  stopBtn.addEventListener('click', () => {
    rerenderButtons(true);
    utils.sendMessage({ type: utils.STOP });
  });
})();
