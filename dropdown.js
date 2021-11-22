const pomo = document.getElementById("btn");
const pomo_list = document.getElementById("list");
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

// script for pomodoro ends here.

const timer_drop = document.getElementById("timer_dropdown");
const timer_drop_content = document.getElementById("timer_dropdown_div");
timer_drop_content.style.display = "none";
timer_drop.addEventListener("click", (event) => {
    if (timer_drop_content.style.display == "none") {
        timer_drop_content.style.display = "block";
        timer_drop_content.style.listStyle = "none";
    }
    else {
        timer_drop_content.style.display = "none";
    }
})

// script for dropdown for timer in  focus mode ends here

const focusmode_drop = document.getElementById("focusmode_dropdown");
const focusmode_drop_content = document.getElementById("focusmode_dropdown_div");
focusmode_drop_content.style.display = "none";
focusmode_drop.addEventListener("click", (event) => {
    if (focusmode_drop_content.style.display == "none") {
        focusmode_drop_content.style.display = "block";
        focusmode_drop_content.style.listStyle = "none";
    }
    else {
        focusmode_drop_content.style.display = "none";
    }
})

//  script for focus mode dropdown ends here

const timebox_switch = document.getElementById("timebox_switch");
const timebox = document.getElementById("timebox");
const timer_txt = document.getElementById("timer_text");
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