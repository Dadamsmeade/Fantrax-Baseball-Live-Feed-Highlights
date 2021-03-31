// We need a background process running to detect when we select the live scoring tab because the page doesn't do a true
// reload so our extension won't fire unless this is in place or the users does a browser refresh on the live scoring page

console.log("Background Running");
var currentTab = 0;
var scrapeTab = 0;
var scrapeWindow = 0;
var rosterRunning = false;
var secondVideoScrape = 1;
var hitterUrl = '';
var pitcherUrl = '';
var liveScoringRunning = false;
var importData = '';
var importData2 = '';

function matchRuleShort(str, rule) {
    return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

function compareSecondColumn(a, b) {
    if (a.date === b.date) {
        return 0;
    }
    else {
        return (a.date > b.date) ? -1 : 1;
    }
}

setInterval(function() {
    // get active tab's URL to check if and which script we should run
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        if (tabs[0]){
            // bool variable rosterRunning lets background.js know if roster.js is currently populating fantrax.com/league/*/team/roster* page
            rosterRunning = false;
            if (matchRuleShort(tabs[0].url, "https://www.fantrax.com/fantasy/league/*/team/roster*") && rosterRunning == false) {
                // We're on the team roster page, run roster.js
                //console.log("on team roster page, running roster.js script..."); // debugging
                chrome.tabs.executeScript(tabs[0].id, { file: "jquery.min.js" }, function() {
                    chrome.tabs.executeScript(tabs[0].id, {file: "roster.js"});
                });
            } else if (matchRuleShort(tabs[0].url, "https://www.fantrax.com/fantasy/league/*/livescoring*")) {
                // We're on live scoring page, run content.js (need jquery as well)
                //console.log("on live scoring page, running roster.js script..."); // debugging
                chrome.tabs.executeScript(tabs[0].id, { file: "jquery.min.js" }, function() {
                    chrome.tabs.executeScript(tabs[0].id, { file: "content.js" });
                });
            }
        }
    });
}, 1000);

chrome.runtime.onMessage.addListener(
    function(msg, sender, onSuccess) {
        if (msg.from == 'roster_running') {
            // getting message from roster.js
            if (msg.running == true) {
                // checking to make sure roster.js isn't already populating page
                console.log('message from roster.js asking to run...');
                if (!rosterRunning) {
                    // roster.js isn't currently populating, free to run
                    console.log('permission granted to roster.js, setting rosterRunning to TRUE.');
                    rosterRunning = true;
                    onSuccess(true);
                } else {
                    // roster.js already populating, abort
                    console.log('permission denied to roster.js, rosterRunning is currently set to TRUE.');
                    onSuccess(false);
                }
            } else {
                // roster.js done populating
                console.log('message from roster.js saying they are done running, setting rosterRunning to FALSE.');
                rosterRunning = false;
                onSuccess("rosterRunning has been set to FALSE.");
            }

            return true;

        } else if (msg.from == 'roster') {
            // getting message from roster.js with url to get video data from mlb.com/video/search/<player data> (usually very long)
            currentTab = sender.tab.id;
            hitterUrl = msg.url[0];
            pitcherUrl = msg.url[1];
            chrome.windows.create({url: hitterUrl, focused: false, height: 100, width: 100}, function (hiddenWindow) {
                // new window created behind active window (this is a workaround for CORS issues)
                secondVideoScrape = 1;
                chrome.tabs.executeScript(hiddenWindow.tabs[0].id, {file: "video_scrape.js"});
                // running video_scrape.js on the provided mlb.com/video/search... to get video data to send back to roster.js
                //TODO: Create .js file to parse mlb page, send message back here to send to roster.js via onSuccess()
                onSuccess("window created, script running");

                // remember the tab id for this window for later use when we send info back to roster.js
                scrapeTab = hiddenWindow.tabs[0].id;
                scrapeWindow = hiddenWindow.id;
                //console.log(hiddenWindow);
            });

            return true;  // Will respond asynchronously.

        } else if (msg.from == 'video_scrape_hitters') {
                // getting message from video_scrape.js with video data to populate web page that roster.js is running on
                //console.log(msg.data);

                // grab data from message (contains video links, titles, and dates) and store in importData variable
                importData = msg.data;
                console.log("video scrape 1");

                if (pitcherUrl != '') {
                    console.log('we have a pitcher url');
                    chrome.tabs.create({windowId: scrapeWindow, url: pitcherUrl}, function(tab) {
                        chrome.tabs.executeScript(tab.id, {file: "video_scrape.js"});
                    });
                } else {
                    importData2 = '1';
                    chrome.windows.remove(scrapeWindow);
                }

            return true;

        } else if (msg.from == 'video_scrape_pitchers') {
            // getting message from video_scrape.js with video data to populate web page that roster.js is running on

            // then delete created window that video_scrape.js ran in, we don't need it anymore
            console.log("pitcher video data");

            importData = importData.concat(msg.data);
            importData.sort(compareSecondColumn);
            importData.splice(40);
            importData2 = msg.data;

            console.log(importData);
            //console.log(importData2);

            chrome.windows.remove(scrapeWindow);

            return true;

        } else if (msg.from == 'roster_return') {
            // getting message from roster.js asking for video data that will be provided by video_scrape.js
            var checkExist = setInterval(function() {
                if (importData && importData2) {
                    // video_scrape has successfully run and video data has been stored in importData, ready to send to
                    // roster.js for population, close out of interval
                    console.log("Link exists!");
                    clearInterval(checkExist);

                    // send video data back to roster.js in response and clear importData
                    onSuccess(importData);
                    importData = '';
                    importData2 = '';
                }
                // video_scrape has not finished running, video data not ready yet, run check again
            }, 100); // check every 100ms

            return true;
        }
    }
);

