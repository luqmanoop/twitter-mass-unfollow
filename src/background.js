chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    await chrome.storage.sync.set({
      'twitter-mass-unfollow-reload-on-stopped': true,
    });
    await chrome.storage.sync.set({ 'twitter-mass-unfollow-timer': true });
    chrome.tabs.create({
      url: 'options.html',
    });
  }
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    const rules = [
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostSuffix: '.x.com',
              pathContains: 'following',
              schemes: ['https'],
            },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});
