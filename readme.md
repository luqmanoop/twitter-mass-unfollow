# X (Twitter) Mass Unfollow

<img src="/images/extension.png" alt="X (Twitter) Mass Unfollow extension UI" width="65%">

> A simple (configurable) way to mass unfollow your X (Twitter) followings

If your Twitter following is a mess and you'd like to start afresh, look no further. `Twitter Mass Unfollow` will automagically unfollow all or some of your following so you don't have to "clicky clicky" because let's face it, no one has the time for that.

## Prerequisites

- A laptop/desktop computer (lol)
- [Google Chrome browser](https://www.google.com/chrome/)

## Usage

- [Install the extension from Chrome Web Store](https://chrome.google.com/webstore/detail/twitter-mass-unfollow/bidolfkgmbnlnijabkjafdajjpocfhol)
  - TIP: Pin it for easy access
- Visit your [Twitter following page](https://twitter.com/following)
- Click the **DEMO** button to see the extension in action without unfollowing anyone or
- Click **ALL** to unfollow all followings or **NOT FOLLOWING** to unfollow accounts you follow that are not following you
- Use **STOP** to abort the whole process

```
Once started, keep the page opened while the extension do its thing.
You can continue to using Twitter in a new tab/window
```

## Options

The extension can be configured from the options page.

<img src="/images/extension-option.png" alt="extension option page" width="75%" />

#### Exclude users

Keep a whitelist of users (Twitter handles/usernames) to not be unfollowed. This could be people that you both are following each other or not. Twitter handles added here will always be given priority regardless of the action button clicked.

#### Stop after 1 minute

The extension will stop running (unfollowing users) after 1minute from time started. **If unchecked, it will run until there's no one to unfollow & you'd have to manually "STOP" the process as you see fit** See [NOTE](#note) below

#### Reload on finished

Whether the extension should reload the current page after the running process is finished/done. By default, page will be refreshed. You can uncheck this to manually reload the page yourself.

## NOTE

By default, the unfollow process runs for 1 minute (which can be turned off in the extension options page) and there's a delay between each unfollowing action. This is a safety measure to not violate [Twitter Rule](https://help.twitter.com/en/using-twitter/twitter-follow-limit) which could lead to having your account restricted by Twitter.
