document.addEventListener('DOMContentLoaded', function () {

  function getOptions() {
    chrome.storage.sync.get(["username", "password"], function (items) {
      const saveBtn = document.getElementById('save');
      const status = document.getElementById('status');

      if (items.username) {
        saveBtn.textContent = "Update";
        status.textContent = 'Credentials saved.';
      } else {
        status.textContent = 'Credentials not saved.';
      }
    });
  }


  function saveOptions() {
    const username = document.getElementById('un').value;
    const password = document.getElementById('pd').value;

    chrome.storage.sync.set({
      username,
      password
    }, getOptions);
  }


  document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    saveOptions();

    document.getElementById('un').value = "";
    document.getElementById('pd').value = "";


    getOptions();
  });


  getOptions();
});
