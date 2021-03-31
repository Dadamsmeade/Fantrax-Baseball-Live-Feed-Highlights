/**
 * Created by dadamsmeade on 4/4/19.
 * This removes all content except the video stream on the site we redirect users to for baseball streams, also makes
 * the stream full size for better visibility
 */

gotMessage();

function gotMessage() {

    var stream = document.getElementsByClassName('voloplayer')[0];
    

    var feedsbtns = document.getElementsByClassName('volo-feedsbtns')[0];


    stream.style.height = '95%';
    stream.style.maxHeight = '56vw';
    stream.style.left = '0';
    stream.style.right = '0';
    stream.style.position = 'absolute';
    stream.style.paddingBottom = '0';
    stream.style.top = '5%';
    stream.style.bottom = '0';

    feedsbtns.style.width = '100%';
    feedsbtns.style.position = 'absolute';
    feedsbtns.style.top = '0';
    feedsbtns.style.bottom = '0';
    feedsbtns.style.backgroundColor = "black";

    if (feedsbtns.getElementsByTagName('button')[1]) {
        feedsbtns.getElementsByTagName('button')[1].style.border = '2px solid #bfb15d';
    }

    document.getElementsByTagName('body')[0].innerHTML = "";
    document.getElementsByTagName('body')[0].appendChild(feedsbtns);
    document.getElementsByTagName('body')[0].appendChild(stream);

    console.log(stream);

}