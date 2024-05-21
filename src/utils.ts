import elementReady from 'element-ready';

import type { Message } from './types';

export const $ = {
  one<T extends Element>(selector: string) {
    return document.querySelector<T>(selector);
  },
  many<T extends Element>(selector: string) {
    return document.querySelectorAll<T>(selector);
  },
  create<K extends keyof HTMLElementTagNameMap>(tag: K) {
    return document.createElement(tag);
  },
};

export const getCurrentTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
};

export const waitForElement = async (selector: string) => {
  const element = await elementReady(selector, { stopOnDomReady: false });
  return element;
};

export const sendMessage = async (msg: Message) =>
  chrome.runtime.sendMessage(msg);

export const isExtensionPage = (url: string = location.href) => {
  return /https:\/\/(.*\.)?x\.com\/.*\/following/.test(url);
};

export const storage = {
  set: async (key: string, value: any) => {
    return chrome.storage.sync
      .set({ [key]: value })
      .then(() => value)
      .catch(console.log);
  },
  get: async (key: string) => {
    return chrome.storage.sync
      .get(key)
      .then((result) => result[key])
      .catch(console.log);
  },
  timerKey: 'twitter-mass-unfollow-timer',
  whiteListedUsersKey: 'twitter-mass-unfollow-whitelisted',
  reloadOnStoppedKey: 'twitter-mass-unfollow-reload-on-stopped',
};

export const waitFor = async (duration = 1000) =>
  new Promise((resolve) => setTimeout(resolve, duration));
