if (localStorage.getItem("fire_local")) {
  window.location.href = "index.html";
}

function showLoadingMessage(message) {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loadingMessage";
  loadingDiv.style.position = "fixed";
  loadingDiv.style.top = "50%";
  loadingDiv.style.left = "50%";
  loadingDiv.style.transform = "translate(-50%, -50%)";
  loadingDiv.style.background = "#000";
  loadingDiv.style.color = "#fff";
  loadingDiv.style.padding = "10px 20px";
  loadingDiv.style.borderRadius = "10px";
  loadingDiv.style.fontSize = "18px";
  loadingDiv.innerText = message;
  document.body.appendChild(loadingDiv);
}

function hideLoadingMessage() {
  const loadingDiv = document.getElementById("loadingMessage");
  if (loadingDiv) {
    document.body.removeChild(loadingDiv);
  }
}

document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  
  var url = "https://script.google.com/macros/s/AKfycbz4gDKt6KgIk5QAwbeCd4n6gUb9hSrPooKGQpzkEgTJwDtglmWpaV-naynIzYQbSSrB/exec";

  var data = {
    "username": username,
    "password": password
  };

  showLoadingMessage("Logging in...");
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(data)
  })
  .then(response => response.text())
  .then(responseText => {
    hideLoadingMessage();
    if (responseText === "success") {
      localStorage.setItem("fire_local", username);
      window.location.href = "index.html";
    } else {
      alert("Invalid username or password!");
    }
  })
  .catch(error => {
    hideLoadingMessage();
    console.error('Error:', error);
  });
});