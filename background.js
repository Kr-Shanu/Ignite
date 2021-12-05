'use strict';

const isFirefox = /Firefox/.test(navigator.userAgent) || typeof InstallTrigger !== 'undefined';

const audio = {};
audio.cache = {};
audio.play = (id, src, n = 5, volume = 0.8) => {
  audio.stop(id);
  const e = new Audio();
  e.volume = volume;
  e.addEventListener('ended', function () {
    n -= 1;
    if (n > 0) {
      e.currentTime = 0;
      e.play();
    }
    else {
      delete audio.cache[id];
    }
  }, false);
  audio.cache[id] = e;
  e.src = src;
  e.play();
};
audio.stop = id => {
  const e = audio.cache[id];
  if (e) {
    e.pause();
    e.currentTime = 0;
    delete audio.cache[id];
  }
};

const alarms = {
  create(name, info) {
    const d = info.when - Date.now();
    if (d < 60 * 1000) {
      if (alarms.cache[name]) {
        window.clearTimeout(alarms.cache[name].id);
      }
      alarms.cache[name] = {
        id: window.setTimeout(() => {
          delete alarms.cache[name];
          alarms.fire({
            name,
            scheduledTime: info.when
          });
        }, d),
        when: info.when
      };
    }
    else {
      chrome.alarms.create(name, info);
    }
  },
  fire({ name }) {
    const set = (name, title, message = `Time's up`) => chrome.notifications.clear(name, () => {
      const opts = {
        type: 'basic',
        iconUrl: 'data/icons/48.png',
        title,
        message: message + '\n\n' + (new Date()).toLocaleString(),
        priority: 2,
        requireInteraction: true,
        buttons: [{
          title: 'Snooze after 5 minutes'
        }, {
          title: 'Snooze after 10 minutes'
        }]
      };
      if (isFirefox) {
        delete opts.buttons;
        delete opts.requireInteraction;
      }
      chrome.notifications.create(name, opts);
    });

    if (name.startsWith('timer-')) {
      chrome.storage.local.get({
        'src-timer': 'data/sounds/4.mp3',
        'repeats-timer': 5,
        'volume-timer': 0.8
      }, prefs => {
        audio.play(name, prefs['src-timer'], prefs['repeats-timer'], prefs['volume-timer']);
        set(name, 'Timer');
      });
    }
    else if (name.startsWith('alarm-')) {
      const id = name.split(':')[0];
      chrome.storage.local.get({
        'alarms': [],
        'src-alarm': 'data/sounds/1.mp3',
        'repeats-alarm': 5,
        'volume-alarm': 0.8
      }, prefs => {
        const o = prefs.alarms.filter(a => a.id === id).shift();
        if (o.snooze) {
          alarms.create('audio-' + id + '/1', {
            when: Date.now() + 5 * 60 * 1000
          });
          alarms.create('audio-' + id + '/2', {
            when: Date.now() + 10 * 60 * 1000
          });
        }
        audio.play(id, prefs['src-alarm'], prefs['repeats-alarm'], prefs['volume-alarm']);
        set(id, 'Alarm', o.name);
      });
    }
    else if (name.startsWith('audio-')) {
      const id = name.replace('audio-', '').split('/')[0];
      chrome.storage.local.get({
        'src-misc': 'data/sounds/5.mp3',
        'repeats-misc': 5,
        'volume-misc': 0.8
      }, prefs => {
        audio.play(id, prefs['src-misc'], prefs['repeats-misc'], prefs['volume-misc']);
        let title = 'Misc';
        if (id.startsWith('alarm-')) {
          title = 'Alarm';
        }
        else if (id.startsWith('timer-')) {
          title = 'Timer';
        }
        set(id, title);
      });
    }
  },
  clear(name, callback = () => { }) {
    if (alarms.cache[name]) {
      window.clearTimeout(alarms.cache[name].id);
      callback();
    }
    else {
      chrome.alarms.clear(name, callback);
    }
  },
  get(name, c) {
    if (alarms.cache[name]) {
      c({
        name,
        scheduledTime: alarms.cache[name].when
      });
    }
    else {
      chrome.alarms.get(name, c);
    }
  },
  getAll(c) {
    const locals = Object.entries(alarms.cache).map(([name, { when }]) => {
      return {
        name,
        scheduledTime: when
      };
    });
    chrome.alarms.getAll(alarms => c([
      ...locals,
      ...alarms
    ]));
  }
};
alarms.cache = {};
chrome.alarms.onAlarm.addListener(alarms.fire);

const silent = (id, callback = () => { }) => {
  audio.stop(id);
  chrome.notifications.clear(id);

  alarms.getAll(as => {
    as = as.filter(a => a.name.startsWith('audio-' + id));
    const v = as.map(a => new Promise(resolve => alarms.clear(a.name, resolve)));
    Promise.all(v).then(callback);
  });
};
chrome.notifications.onClicked.addListener(id => silent(id));
chrome.notifications.onClosed.addListener(id => silent(id));

if (chrome.notifications.onShowSettings) {
  chrome.notifications.onShowSettings.addListener(id => silent(id));
}
if (chrome.notifications.onPermissionLevelChanged) {
  chrome.notifications.onPermissionLevelChanged.addListener(id => silent(id));
}
chrome.notifications.onButtonClicked.addListener((id, buttonIndex) => {
  silent(id, () => {
    buttonIndex += 1;
    alarms.create('audio-' + id + '/' + buttonIndex, {
      when: Date.now() + buttonIndex * 5 * 60 * 1000
    });
  });
});

const onMessage = (request, sender, respose) => {
  if (request.method === 'set-alarm') {
    alarms.create(request.name, request.info);
  }
  else if (request.method === 'clear-alarm') {
    request.name = request.name.split(':')[0];
    alarms.getAll(as => {
      as = as.filter(a => a.name.indexOf(request.name) !== -1);
      as.forEach(a => {
        alarms.clear(a.name);
      });
    });
  }
  else if (request.method === 'get-alarm') {
    alarms.get(request.name, respose);
    return true;
  }
  else if (request.method === 'get-alarms') {
    alarms.getAll(respose);
    return true;
  }
  else if (request.method === 'batch') {
    const sets = request.jobs.filter(j => j.method === 'set-alarm').map(j => j.name);
    const clears = request.jobs.filter(j => j.method === 'clear-alarm').filter(j => sets.indexOf(j.name) === -1);
    for (const job of clears) {
      onMessage({
        method: 'clear-alarm',
        name: job.name
      });
    }
    request.jobs.filter(j => j.method === 'set-alarm').forEach(j => alarms.create(j.name, j.info));
  }
  else if (request.method === 'remove-all-notifications') {
    chrome.notifications.getAll(ns => Object.keys(ns).forEach(silent));
  }
};
chrome.runtime.onMessage.addListener(onMessage);

const onCommand = command => {
  if (command === 'open-interface') {
    chrome.storage.local.get({
      width: 400,
      height: 600,
      left: screen.availLeft + Math.round((screen.availWidth - 400) / 2),
      top: screen.availTop + Math.round((screen.availHeight - 600) / 2)
    }, prefs => chrome.windows.create({
      url: 'data/popup/index.html?mode=pp',
      width: prefs.width,
      height: prefs.height,
      left: prefs.left,
      top: prefs.top,
      type: 'popup'
    }));
  }
};
chrome.commands.onCommand.addListener(onCommand);
chrome.browserAction.onClicked.addListener(() => onCommand('open-interface'));


chrome.storage.onChanged.addListener(ps => {
  if (ps.mode) {
    chrome.browserAction.setPopup({
      popup: ps.mode.newValue === 'pp' ? '' : 'data/popup/index.html'
    });
  }
});
{
  const once = () => chrome.storage.local.get({
    mode: 'bp'
  }, prefs => chrome.browserAction.setPopup({
    popup: prefs.mode === 'pp' ? '' : 'data/popup/index.html'
  }));
  chrome.runtime.onInstalled.addListener(once);
  chrome.runtime.onStartup.addListener(once);
}

/* FAQs & Feedback */
{
  const { management, runtime: { onInstalled, setUninstallURL, getManifest }, storage, tabs } = chrome;
  if (navigator.webdriver !== true) {
    const page = getManifest().homepage_url;
    const { name, version } = getManifest();
    onInstalled.addListener(({ reason, previousVersion }) => {
      management.getSelf(({ installType }) => installType === 'normal' && storage.local.get({
        'faqs': true,
        'last-update': 0
      }, prefs => {
        if (reason === 'install' || (prefs.faqs && reason === 'update')) {
          const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
          if (doUpdate && previousVersion !== version) {
            tabs.query({ active: true, currentWindow: true }, tbs => tabs.create({
              url: page + '?version=' + version + (previousVersion ? '&p=' + previousVersion : '') + '&type=' + reason,
              active: reason === 'install',
              ...(tbs && tbs.length && { index: tbs[0].index + 1 })
            }));
            storage.local.set({ 'last-update': Date.now() });
          }
        }
      }));
    });
    setUninstallURL(page + '?rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
  }
}


// *************************    EYE protection    *********************************

function create_alarm() {
  console.log("eye protec alarm set");
  chrome.alarms.create("blink_eye", { periodInMinutes: 1.0 });
}
// create_alarm(minute);
chrome.alarms.onAlarm.addListener(function (eye_alm) {
  // alert("its been soo long look away");

  console.log("inside blink alarm functions");
})
function clear_alarms() {
  chrome.alarms.clear(
    "blink_eye", function () {
      alert("All blink eye alarms cleared");
    }
  )
}
// eyetimer_notif();   //just to check if the notificaiton api is working or not, this line can be deleted
function eyetimer_notif() {
  chrome.notifications.create("eye_tim_notif", {
    type: "basic",
    iconUrl: "/data/icons/32.png",
    title: "Care for your eyes : Ignite",
    message: "look away you have been seeing your screens since 20 minutes straight it will harm your eyes"
  }, function (n) { console.log("notificaiton api in action with eye protection") })               // call back funciton in case you don't understand.
}
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.greeting == "put_eye_alarm") {
      console.log("passed message to set alarm reached");
      // create_alarm();
      eyeprotoff = setInterval(eyetimer, 1000);
    }
  });
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.greeting == "clear_eye_alarm") {
      // clear_alarms();
      clearInterval(eyeprotoff);
      console.log("clear eye alarm");
    }
  });
var eyetim_value = 20 * 60;

// eyeprotoff = setInterval(eyetimer, 1000);
let eyeprotoff;



function eyetimer() {
  var minutes = parseInt((eyetim_value) / 60);
  var seconds = ((eyetim_value) % 60);
  seconds = seconds < 10 ? '0' + seconds : seconds;
  eyetim_value++; // timervalue.value;
  console.log(minutes);
  console.log(seconds);
  if (minutes % 2 == 0 && seconds === '0' + '0') {
    eyetimer_notif();
  }
}


// **************************   EYE protection    ********************************

// ********************************motivational quotes************************
function loadJSON(callback) {

  let xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', './quotes.json', true);
  xobj.onreadystatechange = () => {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  }
  xobj.send(null);
}
let quote = '';
let author = '';

function motivation_notif() {
  loadJSON((response) => {
    // Parse JSON string into object
    let quotes = JSON.parse(response);
    let randomNumber = Math.random() * (Object.keys(quotes).length - 1);
    randomNumber = Math.round(randomNumber);
    quote = quotes[randomNumber].quote;
    author = quotes[randomNumber].author;
    // alert(quote);

  })
  chrome.notifications.create("motivation_notification", {

    type: "basic",
    iconUrl: "/data/icons/32.png",
    title: quote,
    message: author,
  }, function () { console.log("notificaiton motivation api in action") })               // call back funciton in case you don't understand.
}

function create_motivation_alarm() {
  console.log(" motivation alarm set");
  chrome.alarms.create("motivaite_notif", { periodInMinutes: 1.0 });
}

// create_alarm(minute);
chrome.alarms.onAlarm.addListener(function () {
  motivation_notif();
  console.log("inside motivation alarm functions");
})

function clear_motiv_alarms() {
  chrome.alarms.clear(
    "motivaite_notif", function () {
      alert("All motivation alarms cleared");
    }
  )
}

chrome.runtime.onMessage.addListener(
  function (request3, sender, sendResponse) {
    if (request3.greeting == "put_motivation") {
      console.log("passed message to set motivation alarm reached");
      create_motivation_alarm();
    }
  });
chrome.runtime.onMessage.addListener(
  function (request2, sender, sendResponse) {
    if (request2.greeting == "clear_motivation") {
      clear_motiv_alarms();
      console.log("motivation clear");
    }
  }
);