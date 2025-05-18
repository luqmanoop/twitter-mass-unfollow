<div align="center">
<img src="/images/icon.png" width="150" height="150" />
<h1>X (Twitter) Mass Unfollow</h1>
<p>A simple (configurable) way to mass unfollow your X (Twitter) followings</p>

</div>

<img src="/images/extension.png" alt="X (Twitter) Mass Unfollow extension UI" width="65%">

Reclaim your X (Twitter) feed — Mass unfollow users with a click of a button.

## Features
- Bulk unfollow options: Unfollow all accounts or selectively unfollow those who don't follow you back.
- Demo mode: Preview the unfollow process without making any changes to your account.
- Whitelist functionality: Protect specific accounts from being unfollowed by adding them to a whitelist.
- Session control: Configurable option to stop the unfollow process after `n` minutes.

## Usage

- [Install the extension from Chrome Web Store](https://chrome.google.com/webstore/detail/twitter-mass-unfollow/bidolfkgmbnlnijabkjafdajjpocfhol)
  - TIP: Pin the extension for easy access
- Visit your [X/Twitter following page](https://x.com/following)
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
