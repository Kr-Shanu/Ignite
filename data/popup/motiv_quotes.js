document.getElementById("motivation_on").addEventListener("click", newQuote);
document.getElementById("motivation_off").addEventListener("click", clear_quote);
// document.getElementById("focus_mode").addEventListener("click",foucsmode_trigger);

function clear_quote() {
    chrome.runtime.sendMessage({
        greeting: "clear_motivation"
    })
    // alert("press");
}

function newQuote() {
    const minutes = 1.0;
    chrome.runtime.sendMessage({
        greeting: "put_motivation"
    })
}
