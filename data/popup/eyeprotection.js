// ****************eye protection****************
// We have selected two elements with id eye_btn and fresh check and 
// then we are callling the alarm with their click.
document.getElementById("eye_btn").addEventListener("click",alarm_trigger);
document.getElementById("checke").addEventListener("click",clear_message);

// function to clear eye protection alarm!!
function clear_message(){
    chrome.runtime.sendMessage({
        greeting: "clear_eye_alarm"
    })
}

// function to trigger eye protection alarm!!
function alarm_trigger(){
    chrome.runtime.sendMessage({
        greeting: "put_eye_alarm"
    })
}
// ****************eye protection****************