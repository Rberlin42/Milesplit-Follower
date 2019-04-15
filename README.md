# Milesplit Follower

Milesplit Follower is a chrome extension that allows users to follow athletes on [milesplit.com](https://www.milesplit.com/) like they would on any other social media platform.  The extension creates notifications that helps users stay up to date on any new results and PR's from any of their followed athletes.  While this may serve many purposes, it can be particularly useful for scouting and recruiting high school athletes.

## Features

#### Following and Unfollowing Athletes

With this extension installed, a new Follow/Unfollow button will appear on every athlete's Milesplit profile, right next to the "Claim Athlete" button.  To view all followed athletes, click the "Following" tab in the extension popup.  From this page, multiple athletes can be unfollowed at once by selecting the corresponding checkboxes and clicking the "Unfollow" button.

#### New Result Notifications

The extension will automatically generate notifications for every new result that is posted to Milesplit for all followed athletes.  These notifications can be viewed and cleared within the extension popup, which groups the results by each athlete. For each result, it also lists the event, time/mark, and whether it was a PR.

#### Badge Color/Text

In order for the extension to pull data from Milesplit, the user must have an open session with Milesplit, signed into a Milesplit Pro account.  The badge color reflects its connection to Milesplit: green if it can properly pull data, and red if it cannot.  If the badge is red, it will not be able to fetch new results.

The text on the badge is a number representing the amount of current notifications.

#### Chrome Sync

This extension utilizes the chrome.storage.sync API to store all information. This means that all data regarding followed athletes and notifications will be synced to the Google account that the browser is logged into, and can be accessed from any computer that is signed into the same account.