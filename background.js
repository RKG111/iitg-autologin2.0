//NOTE: This extension was migrated form manifest v2 to v3. This means background.js is now a service worker and doesnt have DOMParser to parse the html string correctly.
//		As a temporary solution, I have used regex to extract data from the html string, this is not a good practice but I am lazy. To any juniors who are interested, 
//		go through the code, figure out a way to use parser instead of regex. The regex code is on line 50 and 106.



chrome.runtime.onInstalled.addListener(function (details) {
  chrome.runtime.openOptionsPage();
});

console.log("AutoLogin Started");
chrome.action.setIcon({ path: "iconDisconnected.png" });

var username;
var password;

function get_options() {
  chrome.storage.sync.get(["username", "password"], function (items) {
    if (items.username) {
      username = items.username;
      password = items.password;
      start();
    } else {
      console.log("AutoLogin credentials not saved");
      return;
    }
  });
}

async function start() {
	try {
		await fetch("https://agnigarh.iitg.ac.in:1442/logout?030403030f050d06", {
		  method: "GET",
		});
	
		const loginResponse = await fetch("https://agnigarh.iitg.ac.in:1442/login?", {
		  method: "GET",
		});
	
		const loginResult = await loginResponse.text();

		login(loginResult);
	  } catch (error) {
		console.log(error);
		start();
	  }
}

async function login(result) {
    const magicmatch = result.match(/name="magic"\s+value="([^"]+)"/);
    const magic = magicmatch ? magicmatch[1] : null;
    const Tredir = "https://agnigarh.iitg.ac.in:1442/login?"

    const payload = new URLSearchParams({
        '4Tredir': Tredir,
        magic: magic,
        username: username,
        password: password
    });



    try {
        const response = await fetch("https://agnigarh.iitg.ac.in:1442", {
            method: "POST",
            body: payload,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        });



        const result = await response.text();
        keepalive(result);
    } catch (error) {
        console.log(error);
        start();
    }
}

async function keepalive(result) {
  console.log(result);
  if (result.search("logged in as") != -1) {
    chrome.browserAction.setIcon({ path: "iconConnected.png" });
  }
  if (result.search("Firewall authentication failed") != -1) {
    chrome.notifications.create({
      type: "basic",
      title: "Incorrect Credentials!",
      iconUrl: "icon.png",
      message:
        "Credentials entered for AutoLogin are incorrect. Please change credentials and try again.",
    });
    return;
  }
  if (result.search("concurrent authentication") != -1) {
    chrome.notifications.create({
      type: "basic",
      title: "Concurrent limit reached!",
      iconUrl: "icon.png",
      message: "Maybe you are logged in somewhere else too.",
    });
    return;
  }
  const urlmatch = result.match(/window\.location\s?=\s?"([^"]+)"/);
  const url = urlmatch ? urlmatch[1]:null;
//   console.log(url);
if (url) {

	await fetch(url,{
		method: 'GET',

	})
	.then((response)=>{
		chrome.action.setIcon({ path: "iconConnected.png" });
        iconWatch(url);
	})
	.catch((error)=>{
		console.log(error);
        chrome.action.setIcon({ path: "iconDisconnected.png" });
	})
  }
}

function iconWatch(url) {
  setInterval(function () {
    if (url) {

	fetch(url,{
		method: 'GET'
	})
	.then((response)=>{
		chrome.action.setIcon({ path: "iconConnected.png" });
	})
	.catch((error)=>{
		chrome.action.setIcon({ path: "iconDisconnected.png" });
	})
    }
  }, 2000);
}
get_options();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.requestLogin) {

	  get_options();
	}
  });
