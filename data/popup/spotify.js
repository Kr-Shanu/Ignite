document.getElementById("spotify_btn").addEventListener("click", launch_spotify);
// document.getElementById("focus_mode").addEventListener("click",foucsmode_trigger);

function launch_spotify() {
    chrome.runtime.sendMessage({
        greeting: "spotify_lnch"
    })
    // alert("press");
}