const pomo =document.getElementById("btn");
const pomo_list = document.getElementById("list");
pomo_list.style.display = "none";
pomo.addEventListener("click", (event)=>{
    if (pomo_list.style.display=="none"){
        pomo_list.style.display="block";
        // pomo_list.style.transitionProperty="all";
        // pomo_list.style.transitionDuration="1s";
        // pomo_list.style.transitionTimingFunction="ease-out";
        pomo_list.style.listStyle="none";
        // alert('button triggered');
    }
    else{
        pomo_list.style.display="none";
        // pomo_list.style.transitionProperty="all";
        // pomo_list.style.transitionDuration="1s";
        // pomo_list.style.transitionTimingFunction="ease-in";
        // pomo_list.style.listStyle="none";
    }
})

// script for pomodoro ends here.

const timer_drop =document.getElementById("timer_dropdown");
const timer_drop_content = document.getElementById("timer_dropdown_div");
timer_drop_content.style.display = "none";
timer_drop.addEventListener("click", (event)=>{
    if (timer_drop_content.style.display=="none"){
        timer_drop_content.style.display="block";
        timer_drop_content.style.listStyle="none";
    }
    else{
        timer_drop_content.style.display="none";
    }
})