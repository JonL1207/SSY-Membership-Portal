document.getElementById("my-details").classList.add("current");

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", logout);

// Attemp to logout the user
async function logout() {
    const url = getUrl("/auth/logout");

    try {
        const response = await sendRequest(url); //Send logout request

        // Redirect to account page if successful login
        if (response.success && response.redirect) {
            location.href = getUrl(response.url);
        }

        // Display error if unsuccessful login
        if (!response.success) {
            // errorAlert.style.display = "flex";
            // errorAlertMessage.textContent = response.message;
            console.log(response.message);
        }
    } catch (err) {
        // errorAlert.style.display = "flex";
        // errorAlertMessage.textContent = err.message;
        console.log(err);
    }
}

// Sends post request
async function sendRequest(url) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    return res.json();
}

// Structure the needed url to always have correct domain
function getUrl(location) {
    return window.location.origin + location;
}
