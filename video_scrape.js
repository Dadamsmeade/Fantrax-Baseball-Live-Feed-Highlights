/**
 * Created by dadamsmeade on 3/21/21.
 * This embeds video highlights from players on a given roster at the bottom of the team roster page
 */

gotMessage();


function gotMessage() {

    setTimeout( function() {
        window.close();
    }, 40000);

    console.log("checking for stuff");

    // We wanna check to make sure page is fully loaded so we can search for elements
    var checkExist = setInterval(function() {
        if (document.querySelectorAll('[class^="contentCardstyle__Metadata"]').length) {
            // Page is now fully loaded, don't have to keep checking anymore
            console.log("Exists!");
            clearInterval(checkExist);

            // Proceed with web scrape

            // Get list of all video elements to parse
            var videoList = document.querySelectorAll('[class^="grid-itemstyle"]');
            var importData = [];

            // Loop through video elements and grab info that we wanna send back to background.js
            var i;
            for (i = 0; i < videoList.length; i++) {
                //var img_src = videoList[0].querySelector('img').getAttribute("src");
                //var img_srcset = videoList[i].querySelector('img').getAttribute("srcset");
                var link = 'https://streamable.com/m' + videoList[i].querySelector('a').getAttribute("href").split('?')[0].substring(6);
                var metadata = videoList[i].querySelectorAll('[class^="contentCardstyle__Metadata"]');
                var title = metadata[0].getElementsByTagName('div')[0].textContent;
                var date = metadata[0].getElementsByTagName('p')[0].textContent;
                importData.push({link: link, title: title, date: new Date(date)});
            }

            // Done scraping and info has been stored in importData, now we send the info back to background.js
            console.log(document.querySelector('[class^="Tagsstyle__TagGroupLabel"]').innerText);
            if (document.querySelector('[class^="Tagsstyle__TagGroupLabel"]').innerText == 'Pitcher Name') {
                console.log("pitchers");
                chrome.runtime.sendMessage({from: "video_scrape_pitchers", data: importData}, function(response) {
                    console.log("bye");
                });
            } else {
                chrome.runtime.sendMessage({from: "video_scrape_hitters", data: importData}, function(response) {
                    console.log("bye");
                });
            }
        }
    }, 100); // check every 100ms


}

function dataProcessFunction(data) {
    console.log(data);
}