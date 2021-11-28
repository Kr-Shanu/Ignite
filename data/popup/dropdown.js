let pomo = document.getElementById("btn");
let pomo_list = document.getElementById("list");
function dropdown_fnc(pomo_list, pomo) {
    pomo_list.style.display = "none";
    pomo.addEventListener("click", (event) => {
        if (pomo_list.style.display == "none") {
            pomo_list.style.display = "block";
            // pomo_list.style.transitionProperty="all";
            // pomo_list.style.transitionDuration="1s";
            // pomo_list.style.transitionTimingFunction="ease-out";
            pomo_list.style.listStyle = "none";
            // alert('button triggered');
        }
        else {
            pomo_list.style.display = "none";
            // pomo_list.style.transitionProperty="all";
            // pomo_list.style.transitionDuration="1s";
            // pomo_list.style.transitionTimingFunction="ease-in";
            // pomo_list.style.listStyle="none";
        }
    })
}
dropdown_fnc(pomo_list,pomo);

// script for pomodoro ends here.

let timer_drop = document.getElementById("alarm");
const timer_drop_content = document.getElementById("timer_dropdown_div");
dropdown_fnc(timer_drop_content,timer_drop);


// script for dropdown for timer in  focus mode ends here

const focusmode_drop = document.getElementById("focusmode_dropdown");
const focusmode_drop_content = document.getElementById("focusmode_dropdown_div");
dropdown_fnc(focusmode_drop_content,focusmode_drop);

//  script for focus mode dropdown ends here

const timebox_switch = document.getElementById("timebox_switch");   //the switch of the timer
const timebox = document.getElementById("timebox");      //the content under timer button
const timer_txt = document.getElementById("timer_text"); //turn the timer on text
timebox.style.display = "none";
timebox_switch.addEventListener("click", (event) => {
    // alert("check message");
    if (timebox.style.display == "none") {
        timebox.style.display = "block";
        timebox.style.listStyle = "none";
        timer_txt.innerHTML = `Turn the timer off`;
    }
    else {
        timebox.style.display = "none";
        timer_txt.innerHTML = `Turn the timer on`;
    }
})

//timer dropdown ends here

