// var eyeprotect_btn = document.getElementById("eyeprot_btn");
// var eyeprot_output = document.getElementById("eyeprotectimer");
// var eyeprot_div = document.getElementById("eyeprot_div");
// var eye_reset=document.getElementById("eye_reset");

// var eyetim_value = 20 * 60;
// eyeprotect_btn.addEventListener("click", (event) => {
//     eyeprotoff = setInterval(eyetimer, 1000);

// })
// eye_reset.addEventListener("click", (event) => {
//     clearInterval(eyeprotoff);
// })
    
// function eyetimer() {
//     var minutes = parseInt((eyetim_value)/60);
//     var seconds = ((eyetim_value) % 60);
//     seconds = seconds < 10 ? '0' + seconds : seconds;
//     eyeprot_output.innerHTML = `${minutes}:${seconds}`;
//     eyetim_value--; // timervalue.value;
// }

// ****************eye protection****************
document.getElementById("eye_btn").addEventListener("click",alarm_trigger);
document.getElementById("checke").addEventListener("click",clear_message);
// document.getElementById("focus_mode").addEventListener("click",foucsmode_trigger);

function clear_message(){
    chrome.runtime.sendMessage({
        greeting: "clear_eye_alarm"
    })
}

function alarm_trigger(){
    const minutes=1.0;
    chrome.runtime.sendMessage({
        greeting: "put_eye_alarm"
    })
}

function foucsmode_trigger(){
    chrome.runtime.sendMessage({
        greeting:"focusmode_on"
    })
}

// ****************eye protection****************
