# Fantrax Baseball Live Feed + Highlights
Chrome extension for Fantrax fantasy baseball leagues that adds live stream links and video highlights to the team page

Link to extension page: https://chrome.google.com/webstore/detail/fantrax-baseball-live-fee/kmencimfjfllkmgngaolamlehdkngpgj

## Files and their functions
#### manifest.json: 
JSON file required by Chrome to communicate between browser and website (basically the config file for the extension).

#### background.js: 
Runs continuously in the background and is responsible for calling content.js, roster.js, and video_scrape.js when they're needed.

#### content.js: 
Runs when user is on the Live Scoring page. Responsible for populating the Live Scoring page with live stream and MLB Gameday links.

#### roster.js: 
Runs when user is on their team roster page. Responsible for populating team roster page with video highlights of their players.

#### video_scrape.js: 
Runs when roster.js sends message to background.js telling it to open a new window at https://www.mlb.com/video/search and execute video_scrape.js on it. Video-scrape.js then scrapes page for video information and returns that info to roster.js to be inserted into the team roster page.

#### declutter.js: 
Runs when user is directed to one of the live stream pages (volokit.com). It removes all content except the video stream on the site and also makes the stream full size for better visibility.

#### jquery.min.js:
Jquery library for use in content.js


## CHANGELOG:
1.1: Changed Washington Nationals abbreviation from "WAS" to "WSH"
1.2: Updated URL change for foodexsport streaming service used for declutter.js
1.3: Updated content.js, page format changed and broke my code so needed to update
1.4: Updated URL string for Arizona Diamondbacks from "diamondbacks" to "d-backs"
1.5: Added MLB Gameday icon next to video stream icon that links to the MLB Gameday page for each player's team
1.5.1: Bug fix for the Live Scoring page, icons weren't showing up on the Period setting
1.5.2: Video streaming URL changed from foodexsports.com to volokit.com, updated code to recognize that
1.5.3: Video streaming URL changed from volokit.com/mlb-games/* to volokit.com/volostream/mlb-games/*
2.0: Updated declutter.js, content.js, page formats changed so needed to update. Added video highlights at bottom of Team Roster page (roster.js/video_scrape.js). Updated background.js, changed messaging configuration to optimize script executions. Updated live stream and Gameday feed icons.
2.1: Updated extension to work with most fantasy baseball league formats now (Roto, H2H, Keeper, Re-draft, etc.), added player pitcher highlights on team page.
