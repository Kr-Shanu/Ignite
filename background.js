chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.insertHTML(null,{file:'./main.html'});
})
