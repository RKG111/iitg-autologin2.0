
chrome.storage.sync.get([
  "username", 
  "password"
], function (items) {
  if (items.username) {
    document.getElementById("msg").style.display = "none";

    document.getElementById("logout").addEventListener("click", function () {
      fetch("https://agnigarh.iitg.ac.in:1442/logout?090f080208090603", {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then(() => {
          chrome.action.setIcon({ path: "iconDisconnected.png" });
        })
        .catch((error) => {
          console.log(error);
        });
    });

    document.getElementById("login").addEventListener("click", function () {

      chrome.runtime.sendMessage({ requestLogin: true });
    });
  } else {
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "none";
  }
});

document.getElementById("changecred").addEventListener("click", function () {
  chrome.runtime.openOptionsPage();
});

