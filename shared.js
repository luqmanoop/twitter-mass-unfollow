/* messaging events */
export const DEMO = "DEMO";
export const UNFOLLOW_ALL = "UNFOLLOW_ALL";
export const UNFOLLOW_NOT_FOLLOWING = "UNFOLLOW_NOT_FOLLOWING";
export const STOP = "STOP";
export const CHECK_IN_PROGRESS = "CHECK_IN_PROGRESS";
/* --- end --- */

export const whiteListedUsersKey = "twitter-mass-unfollow-whitelisted";
export const timerKey = "twitter-mass-unfollow-timer";

export const sendMessage = async (msg) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  return new Promise((resolve, reject) => {
    if (!tabs.length) reject("No active tabs");

    chrome.tabs.sendMessage(tabs[0].id, msg, (response) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      if (response) resolve(response.payload);
      reject("No response");
    });
  }).catch(console.log);
};

export const isExtensionPage = () => {
  return /https:\/\/(.*\.)?twitter\.com\/.*\/following/.test(location.href);
};

export const storage = {
  set: async (key, value) => {
    return chrome.storage.sync
      .set({ [key]: value })
      .then(() => value)
      .catch(console.log);
  },
  get: async (key) => {
    return chrome.storage.sync
      .get(key)
      .then((result) => {
        return result[key];
      })
      .catch(console.log);
  },
};

export const delay = async (duration = 1000) =>
  new Promise((resolve) => setTimeout(resolve, duration));
