// Gather elements
const allTabs = document.getElementsByClassName("tab");
const backButton = document.getElementById("backBtn");
const nextButton = document.getElementById("nextBtn");
const errorAlert = document.getElementById("error-alert");
const errorAlertMessage = document.getElementById("error-alert-message");

// Add event listeners
backButton.addEventListener("click", click);
nextButton.addEventListener("click", click);

// Set initial variables
var user = {};
var currentTab = 0;

showTab();

// Display the appropriate register step page
function showTab() {
  allTabs[currentTab].style.display = "block";

  document.body.scrollTop = document.documentElement.scrollTop = 0; //scroll to toop of page

  if (currentTab === 3) {
    nextButton.textContent = "submit";
  } else {
    nextButton.textContent = "next";
  }

  updateProgressBar(); //update the prgress bar
}

// Handle button clicks
function click(event) {
  try {
    validateInputs(); //validate user inputs before button progress

    // Handle logic based on what button was clicked
    if (event.target.id === "backBtn") {
      back();
    }

    if (event.target.id === "nextBtn") {
      next();
    }
  } catch (err) {
    document.body.scrollTop = document.documentElement.scrollTop = 0; //scroll to toop of page

    errorAlert.style.display = "flex";
    errorAlertMessage.textContent = err.message;
  }
}

// Logic if back button clicked
function back() {
  if (currentTab === 0) {
    location.href = window.location.origin + "/auth/login";
  } else {
    allTabs[currentTab].style.display = "none";
    currentTab--;
    showTab();
  }
}

// Logic if next button clicked
async function next() {
  if (currentTab === 3) {
    await sendRequest();
  } else {
    allTabs[currentTab].style.display = "none";
    currentTab++;
    showTab();
  }
}

// Validate the required user inputs
function validateInputs() {
  //throw new Error("This is an error");
}

// Update the progress bar
function updateProgressBar() {}

// Send the post request to register a new user
async function sendRequest() {}
