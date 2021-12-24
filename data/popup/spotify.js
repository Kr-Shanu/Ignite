// We are selecting a button spotify_btn 
document.getElementById("spotify_btn").addEventListener("click", launch_spotify);

//  function to trigger the spotify window!!
function launch_spotify() {
    chrome.runtime.sendMessage({
        greeting: "spotify_lnch"
    })
}
