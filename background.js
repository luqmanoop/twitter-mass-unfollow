chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.sync
      .set({ "twitter-mass-unfollow-timer": true })
      .then(() => {
        chrome.tabs.create({
          url: "options.html",
        });
      });
  }
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    const rules = [
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostSuffix: ".twitter.com",
              pathContains: "following",
              schemes: ["https"],
            },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});
