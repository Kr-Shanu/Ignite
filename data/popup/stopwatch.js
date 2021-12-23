'use strict';

const stopwatch = {};
window.stopwatch = stopwatch;

stopwatch.ms2time = duration => ({
  milliseconds: parseInt((duration % 1000) / 100),
  seconds: Math.floor((duration / 1000) % 60),   //declaring the seconds milliseconds hour because the stopwatch needs to be precise at milisecond level
  minutes: Math.floor((duration / (1000 * 60)) % 60),
  hours: Math.floor((duration / (1000 * 60 * 60)) % 24)
});

stopwatch.format = o => ('0' + o.hours).substr(-2) + ':' +
  ('0' + o.minutes).substr(-2) + ':' +
  ('0' + o.seconds).substr(-2) + '.' +                        //the format of the stopwatch hh:mm:ss
  ('0' + o.milliseconds).substr(-2);

stopwatch.start = (when = Date.now()) => {       //present date and time is required to start any clock in javascript
  stopwatch.when = when;
  stopwatch.lastlap = 0;
  localStorage.setItem('stopwatch-when', stopwatch.when);  //storage api to remember the stopwatch timer
  localStorage.removeItem('stopwatch-passed');            //updating the stopwach value in storage api
  stopwatch.step();
};
stopwatch.stop = () => {
  window.clearTimeout(stopwatch.id);      //stopping the javascript timer
  stopwatch.passed = Date.now() - stopwatch.when;     //showing the stopped time
  localStorage.setItem('stopwatch-passed', stopwatch.passed); //storing in storage
  localStorage.removeItem('stopwatch-when');             //removing the previously stored value   
  document.body.dataset.stopwatch = 'paused';     //showing in the html button that it is paused
};
stopwatch.lap = (d = Date.now() - stopwatch.when, record = true) => {
  document.querySelector('.stopwatch [data-id=center]').classList.add('hidden');  //under class stopwatch with id "center"
  stopwatch.laps.push(d);  //pushing the
  if (record) {               
    localStorage.setItem('stopwatch-laps', JSON.stringify(stopwatch.laps));//sending laps to storage in forms of strings
  }
  const tr = document.createElement('tr');  // making the table row dynamically for the laps
  const one = document.createElement('td'); //making data cell dynamically for the laps
  one.textContent = ('0' + stopwatch.laps.length).substr(-2);  //input to the data cell
  tr.appendChild(one);   // input to the table row to appent
  const two = document.createElement('td'); //again making the data cell
  const o = stopwatch.ms2time(d);    //elapsed time function
  two.textContent = stopwatch.format(o); //again input to the datacell for the stopwatch format
  tr.appendChild(two);   //appending the table row
  {
    const o = stopwatch.ms2time(d - stopwatch.lastlap);  //difference of the elapsed time and last time lap
    const three = document.createElement('td'); //again creating data cell
    three.textContent = stopwatch.format(o); //formatting the text of data cell
    tr.appendChild(three);   //appending the table row
  }
  stopwatch.lastlap = d;
  if (record) {
    localStorage.setItem('stopwatch-lastlap', d);  //setting the data to the local storage for the last lap
  }
  document.querySelector('.stopwatch [data-id=content] tbody').appendChild(tr);  //appending the table row in class stopwatch in id content
  const root = document.querySelector('.stopwatch [data-id=content]'); 
  root.scrollTop = root.scrollHeight;  //adjustting the height of the vbox due to increase of the row due to laps
};
stopwatch.laps = [];
stopwatch.reset = () => {
  document.querySelector('.stopwatch [data-id=center]').classList.remove('hidden');  //removing all screen data like laps and all
  localStorage.removeItem('stopwatch-when');
  localStorage.removeItem('stopwatch-passed');              //removing all the items because the stopwatch has been stopped
  localStorage.removeItem('stopwatch-lastlap');
  localStorage.removeItem('stopwatch-laps');
  stopwatch.laps = [];
  document.body.dataset.stopwatch = 'start';       //swapping the button text from reset to start
  document.querySelector('.stopwatch [data-id=content] tbody').textContent = '';  //removing everthing and changing it like new
  stopwatch.when = Date.now();  //resetting the date in javascript 
  stopwatch.step(true);
};
stopwatch.resume = () => {
  localStorage.removeItem('stopwatch-passed');
  stopwatch.when = Date.now() - stopwatch.passed;               //same as line no. 21 22
  localStorage.setItem('stopwatch-when', stopwatch.when);
  stopwatch.step();
};
{
  const e = document.querySelector('.stopwatch [data-id="counter"]');
  stopwatch.step = (once = false) => {
    const d = Date.now() - stopwatch.when;
    const o = stopwatch.ms2time(d);
    e.textContent = stopwatch.format(o);// the timer is running because of this
    window.clearTimeout(stopwatch.id);
    if (once !== true) {
      stopwatch.id = window.setTimeout(stopwatch.step, 385);
      document.body.dataset.stopwatch = 'working';
    }
  };
}

// init
{
  const when = localStorage.getItem('stopwatch-when');   //setting the variable "when" for getting the data from local storage
  const passed = localStorage.getItem('stopwatch-passed');//same thing as above or we can say just passed time
  if (passed) {
    document.body.dataset.stopwatch = 'paused';       //passed timer should be stopped
    stopwatch.passed = Number(passed);                //just passed time
    stopwatch.when = Date.now() - stopwatch.passed;   //getting the just passed time
    stopwatch.step(true);
  }
  else if (when) {
    stopwatch.when = Number(when);                    //bhagwan jane kya hai e
    stopwatch.step();
  }

  stopwatch.lastlap = 0;   //initially the laps are 0
  const laps = localStorage.getItem('stopwatch-laps');   //if not 0 then getting from local storage 
  if (laps) {
    for (const d of JSON.parse(laps)) {    //in the form of json
      stopwatch.lap(d, false);
    }
  }
  stopwatch.lastlap = Number(localStorage.getItem('stopwatch-lastlap')) || 0; //last line maam nahi puchengi
}
