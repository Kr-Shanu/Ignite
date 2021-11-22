var set.document.getElementById("set_btn");
var timervalue.document.getElementById("timer_value");
let timer.document.getElementById("countdown");
set.addEventListener("click", (event) => {
    timer = timervalue;
    alert("btn working");
    if (timer == null) {                                  //ye function kaam hi nahi kar rha
        alert("Please enter time in minutes");
    }
})
setInterval(timerupdate,1000);
function timerupdate() {
    var minutes = (timer / 60);
    var seconds = (timer % 60);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timer.innerhtml=`${minutes}:${seconds}`;
    timer--;
}