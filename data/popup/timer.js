'use strict';

const timer = {};
window.timer = timer;

const hours = document.querySelector('.timer input[data-id="hours"]');         //taking the data from the html
const minutes = document.querySelector('.timer input[data-id="minutes"]');
const seconds = document.querySelector('.timer input[data-id="seconds"]');


timer.ms2time = duration => ({                                 //elapsed time function it should be used in the further script
  seconds: Math.floor((duration / 1000) % 60),
  minutes: Math.floor((duration / (1000 * 60)) % 60),
  hours: Math.floor((duration / (1000 * 60 * 60)) % 24)
});

timer.format = num => ('00' + num).substr(-2);      //format of the timer

timer.tick = (once = false) => {
  const n = timer.when - Date.now();      //human redable format ie in minutes and seconds

  if (n > 0) {                        //if the timer is running
    const o = timer.ms2time(n);     //elapsed time
    hours.value = timer.format(o.hours);        //hour hand value
    minutes.value = timer.format(o.minutes);   //minute hand value
    seconds.value = timer.format(o.seconds);  //second hand value

    window.clearTimeout(timer.id);     
    if (once !== true) {                                  
      timer.id = window.setTimeout(timer.tick, 1000);       //timer start function
    }
  }
  else {
    timer.pause(true);    //stop the javascript timer
  }
};

timer.start = () => {       //from line no.38 to 42 it insures that the valid values should be show 
  hours.value = timer.format(Math.max(0, hours.value));
  minutes.value = timer.format(Math.min(59, Math.max(0, minutes.value)));
  seconds.value = timer.format(Math.min(59, Math.max(0, seconds.value)));

  const when = ((Number(hours.value) * 60 + Number(minutes.value)) * 60 + Number(seconds.value)) * 1000;//human redable format
  if (when) {
    timer.resume(Date.now() + when, 1000);        //show the present time
  }
  else {
    timer.pause(true);            //stop the javascript timer
  }
};

timer.pause = (reset = false) => {   //timer stop function
  window.clearTimeout(timer.id);    //responsible for the stopping the timer
  chrome.runtime.sendMessage({
    method: 'clear-alarm',
    name: 'timer-1'
  });
  if (reset) {
    hours.value = '00';               //when the timer reset the value will be 30 minutes by default
    minutes.value = '30';
    seconds.value = '00';
    document.body.dataset.timer = 'start';  //swapping the button to start
    localStorage.removeItem('timer-when');  //storing the 30 minutes value
  }
  else {
    document.body.dataset.timer = 'paused';     //if timer is paused then swap the start button to paused
    localStorage.setItem('timer-when', timer.when - Date.now());  //show the paused value
  }
};

timer.resume = (when = timer.when, delay = 0, post = true) => {
  timer.when = when;        

  window.clearTimeout(timer.id);
  if (delay >= 0) {                 //when timer is running
    if (post) {
      chrome.runtime.sendMessage({               //send message to alarm api in background.js   
        method: 'set-alarm',
        name: 'timer-1',
        info: {
          when: timer.when
        }
      });
    }
    timer.id = window.setTimeout(timer.tick, delay);    // setting the timer id which was used above
    document.body.dataset.timer = 'working';
  }
  else {
    timer.tick(true);
    document.body.dataset.timer = 'paused';
  }
};

// restore
chrome.runtime.sendMessage({    //below every line is used for restoring the extension data or to make it working if we even close and reopen it
  method: 'get-alarm',
  name: 'timer-1'
}, alarm => {
  if (alarm) {
    if (alarm.scheduledTime > Date.now()) {
      return timer.resume(alarm.scheduledTime, 0, false);
    }
  }
  const w = localStorage.getItem('timer-when');
  if (w) {
    timer.resume(Number(w) + Date.now(), -1);
  }
});

document.querySelector('.timer [data-id="presets"]').addEventListener('click', e => {
  const value = e.target.dataset.value;

  if (value) {
    const [hh, mm, ss] = value.split(':');
    hours.value = hh.padStart(2, '0');
    minutes.value = mm.padStart(2, '0');
    seconds.value = ss.padStart(2, '0');
  }
});
