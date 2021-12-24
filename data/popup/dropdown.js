
//  here we have 2 selection, 1 list and the other is button element.
let pomo = document.getElementById("btn");
let pomo_list = document.getElementById("liste");


function dropdown_fnc(pomo_list, pomo) {
    pomo_list.style.display = "none";
    pomo.addEventListener("click", (event) => {
        if (pomo_list.style.display == "none") {
            pomo_list.style.display = "block";
            pomo_list.style.listStyle = "none";
        }
        else {
            //  Here we will make the style tag of list to none in the else part.
            pomo_list.style.display = "none";
        }
    })
}

dropdown_fnc(pomo_list,pomo);

//**************************************script for dropdown for timer in  focus mode ends here********
let eyeprot_btn = document.getElementById("eyeprot_btn");
let eyeprot_divn = document.getElementById("eyeprot_divn");

dropdown_fnc(eyeprot_divn,eyeprot_btn);


// ********************************eyeprot dropdown ends***************************************
let motiv_switch = document.getElementById("motiv_switch");
let motiv_div = document.getElementById("motiv_div");
dropdown_fnc(motiv_div,motiv_switch);


// **************************************motiv dropdown ends here ***************************************