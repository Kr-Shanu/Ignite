
// We are selecting two buttons using the id motivation on and off and then we are calling two function
// to trigger it and switch it off.
document.getElementById("motivation_on").addEventListener("click", newQuote);
document.getElementById("motivation_off").addEventListener("click", clear_quote);

// function to stop motivational quotes
function clear_quote() {
    chrome.runtime.sendMessage({
        greeting: "clear_motivation"
    })
}

// Function to generate two motivational quotes.
function newQuote() {
    chrome.runtime.sendMessage({
        greeting: "put_motivation"
    })
}