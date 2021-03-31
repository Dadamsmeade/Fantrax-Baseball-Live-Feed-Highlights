/**
 * Created by dadamsmeade on 3/21/21.
 * This embeds video highlights from players on a given roster at the bottom of the team roster page
 */
var playerPitching = false;

var month_dict = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
};

gotMessage();

function gotMessage() {

    // We wanna check to make sure page is fully loaded so we can search for elements
    var checkExist = setInterval(function() {
        if (document.getElementsByClassName('scorer__info').length && matchRuleShort(location.href, "https://www.fantrax.com/fantasy/league/*/team/roster*")) {
            // Page is now fully loaded, don't have to keep checking anymore
            //console.log("Exists!");
            clearInterval(checkExist);

            // if video player doesn't exist yet, run the code below
            if (!document.getElementById('video-player-container')) {
                console.log("video player does not exist yet, checking background to make sure script not currently running...");

                // this script is for when users select a thumbnail, we want to throw that data onto the main video player
                var videoScript = document.createElement('script');
                videoScript.innerHTML = '\
                    function setMainVideoSrc(vidSrc, vidTitle, vidDate){\
                            document.getElementById("main-video-player").querySelector("iframe").src = vidSrc;\
                            document.getElementById("main-video-player").querySelector("h4").innerText = vidTitle;\
                            document.getElementById("main-video-player").querySelector("p").innerText = vidDate;\
                            console.log("setting main video src");\
                    }';
                document.getElementsByTagName('head')[0].appendChild(videoScript);

                // send message to background.js to check that another roster.js isn't already building the video player
                // if so, abort (we don't want duplicates)
                chrome.runtime.sendMessage({
                    from: 'roster_running',
                    running: true
                },
                function(response) {
                    if(response) {
                        console.log("green light to build video player!");
                        // We're good to go, proceed with code injection

                        // Create main container
                        var container = document.createElement('div');
                        container.id = 'video-player-container';

                        // Create header container
                        var headerContainer = document.createElement('div');
                        headerContainer.className = 'heading heading--small mobile-clearance margin--small';
                        headerContainer.style = 'border-bottom: 1px solid var(--color-gray-80);';

                        // Create header element
                        var videoHeader = document.createElement('h4');
                        videoHeader.innerText = "Player Highlights";

                        // Append header inside header container, then append header container inside main container
                        headerContainer.appendChild(videoHeader);
                        container.appendChild(headerContainer);

                        // Inject style sheet, main video player, and thumbnail carousel into main container
                        container.innerHTML += '\
                            <style> \
                                #main-video-player { \
                                    width: 100%;\
                                    padding-top: 56.25%;\
                                    margin-bottom: 1em;\
                                    position: relative;\
                                }\
                                #main-video-player iframe {\
                                    position: absolute;\
                                    width: 100%;\
                                    height: calc(100% - 60px);\
                                    top: 0;\
                                    border: none;\
                                }\
                                #carousel {\
                                    width: 100%;\
                                    min-height: 150px;\
                                    overflow: auto;\
                                    white-space: nowrap;\
                                    padding-top: 1em;\
                                    border-top: 1px solid var(--color-gray-80);\
                                }\
                                #carousel .video-slide{\
                                    display: inline-block;\
                                    position: relative;\
                                    border: none;\
                                    width: 270px;\
                                    margin-right: 10px;\
                                    padding: 10px 0;\
                                    overflow-wrap: normal;\
                                    cursor: pointer;\
                                }\
                                .slide-overlay {\
                                    width: 100%;\
                                    height: 100%;\
                                    position: absolute;\
                                    top: 0;\
                                }\
                                #carousel .video-slide iframe{\
                                    display: inline-block;\
                                    border: none;\
                                    width: 270px;\
                                }\
                                .slide-metadata h6 {\
                                    overflow: hidden;\
                                    text-overflow: ellipsis;\
                                }\
                                .slide-metadata h6, .slide-metadata p {\
                                    margin-top: 0.25em;\
                                    margin-bottom: 0;\
                                }\
                                .loader {\
                                    font-size: 10px;\
                                    margin: 50px auto;\
                                    text-indent: -9999em;\
                                    width: 11em;\
                                    height: 11em;\
                                    border-radius: 50%;\
                                    background: #ffffff;\
                                    background: -moz-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);\
                                    background: -webkit-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);\
                                    background: -o-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);\
                                    background: -ms-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);\
                                    background: linear-gradient(to right, #ffffff 10%, rgba(255, 255, 255, 0) 42%);\
                                    position: relative;\
                                    -webkit-animation: load3 1.4s infinite linear;\
                                    animation: load3 1.4s infinite linear;\
                                    -webkit-transform: translateZ(0);\
                                    -ms-transform: translateZ(0);\
                                    transform: translateZ(0);\
                                }\
                                .loader:before {\
                                    width: 50%;\
                                    height: 50%;\
                                    background: #ffffff;\
                                    border-radius: 100% 0 0 0;\
                                    position: absolute;\
                                    top: 0;\
                                    left: 0;\
                                    content: "";\
                                }\
                                .loader:after {\
                                    background: var(--color-white);\
                                    width: 75%;\
                                    height: 75%;\
                                    border-radius: 50%;\
                                    content: "";\
                                    margin: auto;\
                                    position: absolute;\
                                    top: 0;\
                                    left: 0;\
                                    bottom: 0;\
                                    right: 0;\
                                }\
                                @-webkit-keyframes load3 {\
                                    0% {\
                                    -webkit-transform: rotate(0deg);\
                                    transform: rotate(0deg);\
                                }\
                                    100% {\
                                    -webkit-transform: rotate(360deg);\
                                    transform: rotate(360deg);\
                                }\
                                }\
                                @keyframes load3 {\
                                    0% {\
                                    -webkit-transform: rotate(0deg);\
                                    transform: rotate(0deg);\
                                    }\
                                    100% {\
                                    -webkit-transform: rotate(360deg);\
                                    transform: rotate(360deg);\
                                    }\
                                }\
                                #loading-overlay {\
                                    position: absolute;\
                                    width: 100px;\
                                    height: 100px;\
                                    top: calc(50% - 130px);\
                                    left: calc(50% - 50px);\
                                }\
                            </style> \
                            <div id="main-video-player">\
                                <div id="loading-overlay" class="loader"></div>\
                            </div>\
                            <div id="carousel"></div>';

                        // Get reference node, which is what we will append the main container inside
                        var referenceNode = document.getElementsByClassName('main-content')[0].getElementsByTagName('bottom-ad')[0];

                        // Insert the new node before the reference node
                        referenceNode.before(container);

                        // Get list of player names and positions
                        var tables = document.getElementsByClassName('ultimate-table');
                        var hitterNames = tables[0].querySelectorAll('.scorer__info__name a');
                        var pitcherNames = tables[1].querySelectorAll('.scorer__info__name a');
                        var pitcherPositions = tables[1].querySelectorAll('.scorer__info__positions');

                        // Build URL to send to background.js for video_scrape.js to use
                        var hitterUrl = "https://www.mlb.com/video/search?q=Player+%3D+%5B";
                        for (var i = 0; i < hitterNames.length; i++) {
                            var hitterName = hitterNames[i].innerText.split(' ');
                            var hitterNameUrl = '%22';
                            for (var j = 0; j < hitterName.length; j++) {
                                hitterNameUrl += hitterName[j] + '+';
                            }
                            hitterNameUrl = hitterNameUrl.slice(0, -1) + '%22%2C';
                            hitterUrl += hitterNameUrl;
                        }
                        var pitcherUrl = "https://www.mlb.com/video/search?q=PitcherId+%3D+%5B";
                        for (var i = 0; i < pitcherNames.length; i++) {
                            if (pitcherPositions[i].firstChild.innerText != 'TmP') {
                                playerPitching = true;
                                var pitcherName = pitcherNames[i].innerText;
                                var pitcherID = getJSON(pitcherName);
                                pitcherUrl += pitcherID + '%2C';
                            } else {
                                playerPitching = false;
                            }
                        }
                        hitterUrl = hitterUrl.slice(0, -3) + '%5D+AND+HitResult+%3D+%5B"Hit"%5D+Order+By+Timestamp+DESC';
                        if (playerPitching) {
                            pitcherUrl = pitcherUrl.slice(0, -3) + '%5D+Order+By+Timestamp+DESC';
                        } else {
                            pitcherUrl = '';
                        }

                        // We need to get video data from MLB.com and we need to do this via background.js - send
                        // a message, background.js executes video_scrape.js in a window with the url provided, video_scrape.js
                        // parses site and returns subsequent video data in the response variable
                        chrome.runtime.sendMessage({
                                from: 'roster',
                                url: [hitterUrl, pitcherUrl]
                            },
                            function (response) {
                                // We got the info so we send another message to background.js and say that they can
                                // shut down and close the window that was running video_scrape.js
                                chrome.runtime.sendMessage({
                                        from: 'roster_return'
                                    },
                                    function (response) {

                                        // Create iframe element to house actual video
                                        var frame = document.createElement('iframe');
                                        frame.setAttribute('allowFullScreen', '');
                                        frame.src = response[0].link;

                                        // Create video title element
                                        var frameTitle = document.createElement('h4');
                                        frameTitle.innerText = response[0].title;
                                        frameTitle.style = "font-weight: 800; margin-top: 1em; margin-bottom: 0.25em;";

                                        // Create video date element
                                        var frameDate = document.createElement('p');
                                        frameDate.innerText = new Date(response[0].date).date2str();
                                        frameDate.style = "margin-top: 0.25em; margin-bottom: 0.5em;";

                                        // Append above elements into main video player
                                        document.getElementById('main-video-player').appendChild(frame);
                                        document.getElementById('main-video-player').appendChild(frameTitle);
                                        document.getElementById('main-video-player').appendChild(frameDate);

                                        // Loop through rest of video data and create thumbnails for each video in the
                                        // carousel below main video player
                                        var i;
                                        for (i = 0; i < response.length; i++) {
                                            // thumbnail slide container
                                            var slide = document.createElement('div');
                                            slide.className = "video-slide";

                                            // thumbnail image
                                            var image = document.createElement('iframe');
                                            image.src = response[i].link;

                                            // thumbnail title and date
                                            var metadata = document.createElement('div');
                                            metadata.className = "slide-metadata";
                                            var slideTitle = document.createElement('h6');
                                            slideTitle.innerText = response[i].title;
                                            var slideDate = document.createElement('p');
                                            slideDate.innerText = new Date(response[i].date).date2str();

                                            // invisible div to go over thumbnail so video doesn't start playing in
                                            // thumbnail when it's clicked
                                            var slideOverlay = document.createElement('div');
                                            slideOverlay.className = "slide-overlay";
                                            slideOverlay.setAttribute( "onClick", 'setMainVideoSrc("' + response[i].link + '","' + response[i].title + '","' + response[i].date + '")');

                                            // append title and date to metadata container
                                            metadata.appendChild(slideTitle);
                                            metadata.appendChild(slideDate);

                                            // append everything to thumbnail slide container - append to carousel
                                            slide.appendChild(image);
                                            slide.appendChild(metadata);
                                            slide.appendChild(slideOverlay);
                                            document.getElementById('carousel').appendChild(slide);
                                        }
                                    }
                                );

                            }
                        );

                        // We are done populating the page! We can tell background.js that we're done running
                        chrome.runtime.sendMessage({
                            from: 'roster_running',
                            running: false
                        },
                        function(response) {
                            console.log(response);
                        });
                    } else {
                        // there is another instance of roster.js populating the page already, so we abort.
                        console.log("video player already being built.");
                    }
                });

            } else if (document.querySelectorAll('#video-player-container').length > 1) {
                // we have duplicates
                // TODO: Remove duplicates when they arise
                console.log("We got duplicates!");
            }
        }
    }, 100); // check every 100ms


}

function getJSON (playerName) {
    //get JSON gameday data from statsapi.MLB.com, store in mlb_api_data
    var playerID = '';
    var nameArray = playerName.split(' ');
    var nameUrl = "";
    for (var i = 0; i < nameArray.length; i++) {
        nameUrl += nameArray[i] + "%20";
    }
    //console.log(nameUrl);
    var fullUrl = 'https://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code=%27mlb%27&active_sw=%27Y%27&name_part=%27' + nameUrl.slice(0, -3) + '%27';
    //console.log(fullUrl);
    $.ajax({
        url: fullUrl,
        async: false,
        dataType: 'json',
        success: function (data) {
            // do stuff with response.
            //console.log(data.search_player_all.queryResults.row.player_id);
            playerID = data.search_player_all.queryResults.row.player_id;
        }
    });

    return playerID;
}

Date.prototype.date2str = function() {
    var month = month_dict[this.getMonth()]; // getMonth() is zero-based
    var day = this.getDate();
    var year = this.getFullYear();

    return month + ' ' + day + ', ' + year;
};

function matchRuleShort(str, rule) {
    return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}