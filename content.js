/**
 * Fantrax Gameday Extension
 * Created by dadamsmeade on 3/6/18.
 *
 * This extension adds a video icon to players' names in the live scoring section of fantasy baseball leagues on Fantrax
 * Users can click on their players' respective video icon and a new tab will open showing the home team's live stream
 * of that game.
 */

var dict = {
    "BAL": ["orioles", 110],
    "BOS": ["red-sox", 111],
    "CHW": ["white-sox", 145],
    "CLE": ["indians", 114],
    "DET": ["tigers", 116],
    "HOU": ["astros", 117],
    "KC": ["royals", 118],
    "LAA": ["angels", 108],
    "MIN": ["twins", 142],
    "NYY": ["yankees", 147],
    "OAK": ["athletics", 133],
    "SEA": ["mariners", 136],
    "TB": ["rays", 139],
    "TEX": ["rangers", 140],
    "TOR": ["blue-jays", 141],
    "ARI": ["d-backs", 109],
    "ATL": ["braves", 144],
    "CHC": ["cubs", 112],
    "CIN": ["reds", 113],
    "COL": ["rockies", 115],
    "LAD": ["dodgers", 119],
    "MIA": ["marlins", 146],
    "MIL": ["brewers", 158],
    "NYM": ["mets", 121],
    "PHI": ["phillies", 143],
    "PIT": ["pirates", 134],
    "SD": ["padres", 135],
    "SF": ["giants", 137],
    "STL": ["cardinals", 138],
    "WSH": ["nationals", 120]
};

var tmp_dict = {
    "Baltimore" : "BAL",
    "Boston" : "BOS",
    "Chicago Sox" : "CHW",
    "Cleveland" : "CLE",
    "Detroit" : "DET",
    "Houston" : "HOU",
    "Kansas City" : "KC",
    "LA Angles" : "LAA",
    "Minnesota" : "MIN",
    "NY Yankees" : "NYY",
    "Oakland" : "OAK",
    "Seattle" : "SEA",
    "Tampa Bay" : "TB",
    "Texas" : "TEX",
    "Toronto" : "TOR",
    "Arizona" : "ARI",
    "Atlanta" : "ATL",
    "Chicago" : "CHC",
    "Cincinnati" : "CIN",
    "Colorado" : "COL",
    "LA Dodgers" : "LAD",
    "Miami" : "MIA",
    "Milwaukee" : "MIL",
    "NY Mets" : "NYM",
    "Philadelphia" : "PHI",
    "Pittsburgh" : "PIT",
    "San Diego" : "SD",
    "San Francisco" : "SF",
    "St. Louis" : "STL",
    "Washington" : "WSH"
};

var roto_dict = {
    "Baltimore Orioles": ["orioles", 110],
    "Boston Red Sox": ["red-sox", 111],
    "Chicago White Sox": ["white-sox", 145],
    "Cleveland Indians": ["indians", 114],
    "Detroit Tigers": ["tigers", 116],
    "Houston Astros": ["astros", 117],
    "Kansas City Royals": ["royals", 118],
    "Los Angeles Angels": ["angels", 108],
    "Minnesota Twins": ["twins", 142],
    "New York Yankees": ["yankees", 147],
    "Oakland Athletics": ["athletics", 133],
    "Seattle Mariners": ["mariners", 136],
    "Tampa Bay Rays": ["rays", 139],
    "Texas Rangers": ["rangers", 140],
    "Toronto Blue Jays": ["blue-jays", 141],
    "Arizona Diamondbacks": ["d-backs", 109],
    "Atlanta Braves": ["braves", 144],
    "Chicago Cubs": ["cubs", 112],
    "Cincinnati Reds": ["reds", 113],
    "Colorado Rockies": ["rockies", 115],
    "Los Angeles Dodgers": ["dodgers", 119],
    "Miami Marlins": ["marlins", 146],
    "Milwaukee Brewers": ["brewers", 158],
    "New York Mets": ["mets", 121],
    "Philadelphia Phillies": ["phillies", 143],
    "Pittsburgh Pirates": ["pirates", 134],
    "San Diego Padres": ["padres", 135],
    "San Francisco Giants": ["giants", 137],
    "St. Louis Cardinals": ["cardinals", 138],
    "Washington Nationals": ["nationals", 120]
};

var mlb_api_data = {};
var count = 0;

function getJSON () {
    //get JSON gameday data from statsapi.MLB.com, store in mlb_api_data
    var json_data = "";
    $.ajax({
        url: 'https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1',
        async: false,
        dataType: 'json',
        success: function (data) {
            // do stuff with response.
            json_data = data.dates[0].games;
        }
    });

    Array.prototype.forEach.call(json_data, function(game) {
        var gamePk = game;
        // console.log(game.teams.away.team.name);
        // console.log(game.teams.home.team.name);
        mlb_api_data[game.teams.away.team.id] = gamePk;
        mlb_api_data[game.teams.home.team.id] = gamePk;
    });
}

function matchRuleShort(str, rule) {
    return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

// function that checks to make sure table info has been properly loaded before we run our runScript function
var checkExist = setInterval(function() {
    count++;

    if (document.querySelectorAll('.scorer__info').length) {
        // table info has been properly loaded, don't have to keep checking anymore
        clearInterval(checkExist);
        //console.log("live-scoring exists!");

        if (matchRuleShort(location.href, "https://www.fantrax.com/fantasy/league/*/livescoring*") && !document.getElementsByClassName('videoIcon')[0]) {
            console.log("video links not populated yet...");
            getJSON();
            runScript();
        }
    } else if (count == 20) {
        clearInterval(checkExist);
        console.log('page timeout or not on livescoring page');
    }
}, 500);

// main function - populates player divs with video links to their corresponding baseball game streams
function runScript() {

    // get list of all "players" (includes pitching staffs, which we filter by position name)
    //var players = document.getElementsByClassName('live-scoring-table__cell');
    var players = document.getElementsByClassName('scorer__info');

    // if table is already populated, skip all of this
    // mutatuion observer above can trigger multiple times which triggers check()/runScript() multiple times
    // which would populate our page with a bunch of duplicate video icons, so we prevent that here
    if (!document.getElementsByClassName('videoIcon')[0]) {

        // For each "player" in our players array of elements
        Array.prototype.forEach.call(players, function(player) {
            if (player.getElementsByClassName('scorer__info__positions')[0].getElementsByTagName('span')[0].textContent) {

                // Assign variables to be used later
                var home, away, path, team, gamePk, gameTeams, gamedayURL = "";

                // this gets a bunch of player info such as position, batting order, team abbr, etc. We're interested in the team abbr.
                var player_info = player.getElementsByClassName('scorer__info__positions')[0];
                var pos = player_info.getElementsByTagName('span')[0].textContent;

                // This will find the team name abbr. which we will assign to our variable 'team'
                if (pos != 'TmP') {
                    if (player_info.getElementsByClassName('ng-star-inserted')[0].textContent == '(R)') {
                        // Rookie player - an R shows up next to position so we grab one element later
                        team = player_info.getElementsByClassName('ng-star-inserted')[1].textContent.substr(1);
                    } else {
                        team = player_info.getElementsByClassName('ng-star-inserted')[0].textContent.substr(1);
                    }
                } else {
                    // Dealing with pitching staff, find team name abbr. via tmp_dict dictionary
                    team = tmp_dict[player.getElementsByClassName('scorer__info__name')[0].textContent];
                    //console.log(pos);
                }

                // Check to make sure this player has a game scheduled for today, if not, skip
                if (mlb_api_data[dict[team][1]]) {

                    // We want to grab the associated Gameday ID for our team in the mlb_api_data as well as
                    // away and home team indicators from our mlb api dictionary, which we built in the getJSON function below.
                    // This is to correctly embed the right MLB Gameday and live stream URLs for each player
                    gamePk = mlb_api_data[dict[team][1]].gamePk;
                    home = roto_dict[mlb_api_data[dict[team][1]].teams.home.team.name][0];
                    away = roto_dict[mlb_api_data[dict[team][1]].teams.away.team.name][0];

                    // Now we have the home team and away team names, concatenate the two to form the URL path for our link
                    path = away + '-vs-' + home;

                    // create the <a href> element
                    var link = document.createElement('a');
                    // so video opens in a new tab
                    link.target = '_blank';
                    // create img where video icon presides
                    link.innerHTML = "<img class='videoIcon' onerror='console.log(\'error\')' src='#'>";

                    // get the img element that we just created
                    var icon = link.getElementsByClassName("videoIcon")[0];

                    // assign src image & styles
                    icon.src = chrome.extension.getURL('icons/video-player.png');
                    icon.style.width = "16px";
                    icon.style.paddingLeft = "2px";

                    // set href link for video
                    link.setAttribute('href', 'http://www.volokit.com/sport/' + path);
                    // append to player div cell
                    player.getElementsByClassName('scorer__info__positions')[0].appendChild(link);


                    // Let's do the same thing for MLB Gameday
                    // create the <a href> element
                    var gameday_link = document.createElement('a');
                    // so Gameday opens in a new tab
                    gameday_link.target = '_blank';
                    // create img where Gameday icon presides
                    gameday_link.innerHTML = "<img class='gamedayIcon' onerror='console.log(\'error\')' src='#'>";

                    // get the img element that we just created
                    var gameday_icon = gameday_link.getElementsByClassName("gamedayIcon")[0];

                    // assign src image & styles
                    gameday_icon.src = chrome.extension.getURL('icons/baseball.png');
                    gameday_icon.style.width = "16px";
                    gameday_icon.style.paddingLeft = "4px";
                    //gameday_icon.style.opacity = "0.4";

                    // set href link for Gameday
                    gameday_link.setAttribute('href', 'https://www.mlb.com/gameday/' + gamePk);
                    // append to player div cell
                    player.getElementsByClassName('scorer__info__positions')[0].appendChild(gameday_link);
                } else {
                    // player isn't playing today
                    console.log(team, "doesn't play today");
                }

                // All done!
                return true;
            }

        });
    } else {
        return false;
    }
}