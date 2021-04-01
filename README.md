# Fantrax Baseball Live Feed + Highlights
Chrome extension for Fantrax fantasy baseball leagues that adds live stream links and video highlights to the team page

Link to extension page: https://chrome.google.com/webstore/detail/fantrax-baseball-live-fee/kmencimfjfllkmgngaolamlehdkngpgj

# Files and their functions
# manifest.json: 
JSON file required by Chrome to communicate between browser and website (basically the config file for the extension).

# background.js: 
Runs continuously in the background and is responsible for calling content.js, roster.js, and video_scrape.js when they're needed.

# content.js: 
Runs when user is on the Live Scoring page. Responsible for populating the Live Scoring page with live stream and MLB Gameday links.

# roster.js: 
Runs when user is on their team roster page. Responsible for populating team roster page with video highlights of their players.

# video_scrape.js: 
Runs when roster.js sends message to background.js telling it to open a new window at https://www.mlb.com/video/search and execute video_scrape.js on it. Video-scrape.js then scrapes page for video information and returns that info to roster.js to be inserted into the team roster page.

# declutter.js: 
Runs when user is directed to one of the live stream pages (volokit.com). It removes all content except the video stream on the site and also makes the stream full size for better visibility.
