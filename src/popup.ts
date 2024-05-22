import { MessageType } from './types';
import { getCurrentTab, sendMessage } from './utils';

(function () {
  let inProgress: boolean = false;

  const demoBtn = document.querySelector<HTMLButtonElement>('#demo');
  const stopBtn = document.querySelector<HTMLButtonElement>('#stop');
  const unFollowAllBtn =
    document.querySelector<HTMLButtonElement>('#unfollow-all');
  const unFollowNotFollowingBtn = document.querySelector<HTMLButtonElement>(
    '#unfollow-not-following'
  );

  const rerenderButtons = (reset?: boolean) => {
    if (reset) {
      inProgress = false;
      unFollowAllBtn?.removeAttribute('disabled');
      unFollowNotFollowingBtn?.removeAttribute('disabled');
    } else {
      inProgress = true;
      unFollowAllBtn?.setAttribute('disabled', 'true');
      unFollowNotFollowingBtn?.setAttribute('disabled', 'true');
    }
  };

  window.addEventListener('load', async () => {
    const tab = await getCurrentTab();
    sendMessage({ type: MessageType.CHECK_IN_PROGRESS })
      .then((value) => {
        if (typeof value !== 'boolean') {
          chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            files: ['contentScript.js'],
          });

          return;
        }

        if (value) rerenderButtons();
      })
      .catch(() => {
        console.log('failed to inject content script');
      });
  });

  const init = (type: string) => {
    if (inProgress) return;
    rerenderButtons();
    sendMessage({ type });
  };

  demoBtn?.addEventListener('click', () => init(MessageType.DEMO));

  unFollowAllBtn?.addEventListener('click', () => {
    init(MessageType.UNFOLLOW_ALL);
  });

  unFollowNotFollowingBtn?.addEventListener('click', () =>
    init(MessageType.UNFOLLOW_NOT_FOLLOWING)
  );

  stopBtn?.addEventListener('click', () => {
    rerenderButtons(true);
    sendMessage({ type: MessageType.STOP });
  });
})();
