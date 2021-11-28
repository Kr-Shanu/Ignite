var set_btns = document.getElementById("set_btn");
var timervalue = document.getElementById("timer_value").value;
var breakt = document.getElementById("breaktime");
var breakdiv = document.getElementById("breakdiv");
var output_div = document.getElementById("countdown");
// let timer_focus = (timervalue.value)*60;
// let timer_focus=2;
// let exp=timervalue.value;
// timervalue.addEventListener("click", (event) => {
//     var timer_focus = prompt("enter the time in minutes", "59");
// })
set_btns.addEventListener("click", (event) => {
    if (isNaN(timervalue)) {
        alert("Please enter time in minutes");
    }
    runing = setInterval(timerupdate, 1000);
    // breakdiv.style.display == "none";
    
    // breakt.addEventListener("click", (event) => {
    //     if (breakdiv.style.display == "block") {
        //         clearInterval(runing);
        //         breakdiv.style.display="none";
        
        //     }
        //     else {
            //         runing = setInterval(timerupdate, 1000);
            //         breakdiv.style.display="block";    
            //     }
            // })
        })
        var timer_focus = timervalue;
    //    var timer_focus=timer_focus*60;
        if (timebox.style.display == "block") {
            
    // alert("check");
}
breakt.addEventListener("click", (event) => {
    if (breakdiv.style.display == "none") {
        breakdiv.style.display = "block";

    }
    else {
        // runing = setInterval(timerupdate, 1000);
        clearInterval(runing);
        breakdiv.style.display = "none";
    }
})

function timerupdate() {
    var minutes = parseInt((timer_focus)/60);
    var seconds = ((timer_focus) % 60);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    output_div.innerHTML = `${minutes}:${seconds}`;
    timer_focus--;
    // timervalue.value;
}
output_div.innerHTML = "00:00";
