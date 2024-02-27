// Gather elements
const joinButton = document.getElementById("joinBtn");
const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logout");
const errorAlert = document.getElementById("error-alert");
const errorAlertMessage = document.getElementById("error-alert-message");

// Add event listeners
joinButton.addEventListener("click", loadRegisterPage);
loginForm.addEventListener("submit", submitLoginForm);
logoutButton.addEventListener("click", logout);

// Direct user to register page
function loadRegisterPage() {
  location.href = getUrl("/auth/register");
}

// Attempt to log the user into their account
async function submitLoginForm(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const url = getUrl('/auth/login');

  try {
    const formData = new FormData(form); //Get inputs from form
    const formDataObject = Object.fromEntries(formData); //Turn form inputs into object
    const response = await sendRequest(url, formDataObject); //Send login request

    // Redirect to account page if successful login
    if (response.success && response.redirect) {
      location.href = getUrl(response.url);
    }

    // Display error if unsuccessful login
    if (!response.success) {
      errorAlert.style.display = "flex";
      errorAlertMessage.textContent = response.message;
    }
  } catch (err) {
    errorAlert.style.display = "flex";
    errorAlertMessage.textContent = err.message;
  }
}

// Attempt to log user out of account
async function logout() {
  const url = getUrl("/auth/logout");

  try {
    await sendRequest(url); //Send logout request
  } catch (err) {
    errorAlert.style.display = "flex";
    errorAlertMessage.textContent = err.message;
  }
}

// Sends post request
async function sendRequest(url, dataObject) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(dataObject),
  });

  return res.json();
}

// Structure the needed url to always have correct domain
function getUrl(location) {
  return window.location.origin + location;
}
