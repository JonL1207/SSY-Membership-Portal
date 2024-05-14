// Contants for council areas, skills and interests that do not change
const COUNCIL_AREAS = [
    "I'm not based in Scotland",
    "Aberdeen City",
    "Aberdeenshire",
    "Angus",
    "Argyll and Bute",
    "Clackmannanshire",
    "Dumfries and Galloway",
    "Dundee City",
    "East Ayrshire",
    "East Dumbartonshire",
    "East Loathian",
    "East Renfrewshire",
    "City of Edinburgh",
    "Falkirk",
    "Fife",
    "City of Glasgow",
    "Highland",
    "Inverclyde",
    "Midlothian",
    "Moray",
    "Na h-Elieanan Siar (Western Isles)",
    "North Aryshire",
    "North Lanarkshire",
    "Orkney Islands",
    "Perth and Kinross",
    "Renfrewshire",
    "Scottish Borders",
    "Shetland Islands",
    "South Ayrshire",
    "South Lanarkshire",
    "Stirling",
    "West Dumbartionshire",
    "West Lothian",
];
const SKILLS = [
    "Public Speaking",
    "Foreign Language",
    "Grassroots Campaining",
    "First Aid",
    "Non-violent Direct Action",
    "Community Organising",
    "Teaching",
    "Web Design",
    "Trade Union Organising",
    "Election Campaining",
    "Fundraising",
    "Event Planning",
    "Volunteer Management",
    "Project Management",
    "Treasurer Skills",
    "Conflict Management",
    "Equality, Diversity and Inclusion",
    "Videography",
    "Software Development",
    "Driving Licence",
    "Drawing/Illistration",
    "Graphic Design",
    "Photography",
    "Digital Activism",
    "Digital Marketing",
    "Social Media Management",
    "Media/Press Relations",
    "Legal Knowledge",
    "Data Analysis",
    "Policy Research",
];
const INTERESTS = [
    "Joining a group in my local area",
    "Starting a group in my local area",
    "Starting a national campaign",
    "Attending peer education meetings (e.g. book club, workshops, semiars)",
    "Organising peer education meetings",
    "Joining a national campaign group",
    "Attending solidarity actions with community groups and trade unions",
    "Organising solidarity efforts with community campaign groups",
    "Helping to coordinate a national campaign",
    "Working with the fundraising group",
    "Writing articles for the website",
    "Producing media content (e.g. podcasts episodes, videos)",
    "Designing graphics, art, and agitational propoganda",
];

// Initial values
var currentTab = 0;
var user = {
    firstName: "",
    lastName: "",
    pronouns: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    password: "",
    location: {},
    additionalDetails: {},
    externalMemberships: {},
    membership: {
        type: "",
        induction: {},
    },
};

// Gather DOM elements
const logoutSVG = document.getElementById("logout-svg");
logoutSVG.style.color = 'var(--primary)'
logoutSVG.style.cursor = 'default'


const allTabs = document.getElementsByClassName("tab");

const errorAlert = document.getElementById("error-alert");
const errorAlertMessage = document.getElementById("error-alert-message");

const backButton = document.getElementById("backBtn");
const nextButton = document.getElementById("nextBtn");

const skillArea = document.getElementById("skills");
const interestArea = document.getElementById("interests");
const allSkills = document.getElementsByClassName("skill");
const allInterests = document.getElementsByClassName("interest");
const addSkill = document.getElementById("addSkill");
const addInterest = document.getElementById("addInterest");
const addSkillButton = document.getElementById("addSkillBtn");
const addInterestButton = document.getElementById("addInterestBtn");

const councilSelect = document.getElementById("registerCouncil");

const allCheckboxes = document.getElementsByClassName("checkbox");
const supporterCheckbox = document.getElementById("supporter");
const generalCheckbox = document.getElementById("general");
const organiserCheckbox = document.getElementById("organiser");

const inductionOptions = document.getElementById("induction-options");
const physicalCheckbox = document.getElementById("physical");
const virtualCheckbox = document.getElementById("virtual");

const membershipCheckboxes = document.getElementsByClassName("membership-checkbox");
const identityCheckboxes = document.getElementsByClassName("identity-checkbox");
const identityInputs = document.getElementsByClassName("identity-input");

const tradeUnionInputContainer = document.getElementById("trade-union-input");
const tradeUnionInput = document.getElementById("registerTradeUnion");
const tenantsUnionInputContainer = document.getElementById("tenants-union-input");
const tenantsUnionInput = document.getElementById("registerTenantsUnion");
const politicalPartyInputContainer = document.getElementById("political-party-input");
const politicalPartyInput = document.getElementById("registerPoliticalParty");
const campaigningOrgInputContainer = document.getElementById("campaigning-organisation-input");
const campaigningOrgInput = document.getElementById("registerCampOrg");

const stageOne = document.getElementById("stage-one-circle");
const stageTwo = document.getElementById("stage-two-circle");
const stageThree = document.getElementById("stage-three-circle");
const stageFour = document.getElementById("stage-four-circle");

// Add options to select council area from array of councils
COUNCIL_AREAS.map((council) => {
    let option = document.createElement("option");
    option.value = council;
    option.textContent = council;
    councilSelect.appendChild(option);
});

// Add skills to the skill area
SKILLS.map((skill) => {
    let skillText = document.createElement("h3");
    skillText.textContent = skill;
    skillText.classList.add("ma-0");

    let skillDiv = document.createElement("div");
    skillDiv.classList.add("skill");
    skillDiv.append(skillText);

    skillArea.append(skillDiv);
});

// Add interests to the skill area
INTERESTS.map((interest) => {
    let interestText = document.createElement("h3");
    interestText.textContent = interest;
    interestText.classList.add("ma-0");

    let interestDiv = document.createElement("div");
    interestDiv.classList.add("interest");
    interestDiv.append(interestText);

    interestArea.append(interestDiv);
});

// Add event listeners
backButton.addEventListener("click", click);
nextButton.addEventListener("click", click);
Array.from(allCheckboxes).forEach((checkbox) => {
    checkbox.addEventListener("click", check);
});
Array.from(allSkills).forEach((skill) => {
    skill.addEventListener("click", () => {
        skill.classList.contains("selected") ? skill.classList.remove("selected") : skill.classList.add("selected");
    });
});
Array.from(allInterests).forEach((interest) => {
    interest.addEventListener("click", () => {
        interest.classList.contains("selected") ? interest.classList.remove("selected") : interest.classList.add("selected");
    });
});
addSkillButton.addEventListener("click", click);
addInterestButton.addEventListener("click", click);

// Display the appropriate register step page
function showTab(currentTab) {
    allTabs[currentTab].style.display = "block";

    //scroll to the top of the page
    window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
    });

    currentTab === 3 ? (nextButton.textContent = "submit") : (nextButton.textContent = "next");

    updateProgressBar(); //update the progress bar
}

// Update the progress bar
function updateProgressBar() {
    switch (currentTab) {
        case 1:
            stageOne.classList.replace("active", "completed");
            stageTwo.classList.add("active");
            stageTwo.classList.remove("completed");
            stageThree.classList.remove("active");
            break;
        case 2:
            stageTwo.classList.replace("active", "completed");
            stageThree.classList.add("active");
            stageThree.classList.remove("completed");
            stageFour.classList.remove("active");
            break;
        case 3:
            stageThree.classList.replace("active", "completed");
            stageFour.classList.add("active");
            break;
        default:
            stageOne.classList.add("active");
            stageOne.classList.remove("completed");
            stageTwo.classList.remove("active");
    }
}

// Handle button clicks
function click(event) {
    try {
        if (event.target.id === "addSkillBtn") {
            addNewSkill();
        } else if (event.target.id === "addInterestBtn") {
            addNewInterest();
        } else if (event.target.id === "backBtn") {
            back();
        } else {
            validateInputs(); //validate the inputs before preceeding
            next();

            errorAlert.style.display = "none";
        }
    } catch (err) {
        if (!err.message) {
            window.scroll({
                top: 340,
                left: 0,
                behavior: "smooth",
            });
            return;
        }

        if (err.message === "extMem") {
            window.scroll({
                top: 1250,
                left: 0,
                behavior: "smooth",
            });
            return;
        }

        errorAlert.style.display = "flex";
        errorAlertMessage.textContent = err.message;
        window.scroll({
            top: 250,
            left: 0,
            behavior: "smooth",
        });
    }
}

// Add skill to list of skills
function addNewSkill() {
    if (addSkill.value.trim() === "") {
        throw new Error("Please enter the skill you wish to add");
    }

    let skillText = document.createElement("h3");
    skillText.textContent = addSkill.value.trim();
    skillText.classList.add("ma-0");

    let skillDiv = document.createElement("div");
    skillDiv.classList.add("skill");
    skillDiv.append(skillText);
    skillDiv.addEventListener("click", () => {
        skillDiv.classList.contains("selected") ? skillDiv.classList.remove("selected") : skillDiv.classList.add("selected");
    });

    skillArea.append(skillDiv);

    addSkill.value = "";

    errorAlert.style.display = "none";
}

// Add interest to list of interests
function addNewInterest() {
    if (addInterest.value.trim() === "") {
        throw new Error("Please enter the interest you wish to add");
    }

    let interestText = document.createElement("h3");
    interestText.textContent = addInterest.value.trim();
    interestText.classList.add("ma-0");

    let interestDiv = document.createElement("div");
    interestDiv.classList.add("interest");
    interestDiv.append(interestText);
    interestDiv.addEventListener("click", () => {
        interestDiv.classList.contains("selected") ? interestDiv.classList.remove("selected") : interestDiv.classList.add("selected");
    });

    interestArea.append(interestDiv);

    addInterest.value = "";

    errorAlert.style.display = "none";
}

// Go back a step if current tab greater than 1 or back to login page if equal to 1
function back() {
    if (currentTab === 0) {
        location.href = window.location.origin + "/auth/login";
    } else {
        allTabs[currentTab].style.display = "none";
        currentTab--;
        showTab(currentTab);
    }
}

// Go to next step if current tab is less than 3 or submit register if equal to 3
async function next() {
    if (currentTab === 3) {
        await sendRequest();
    } else {
        allTabs[currentTab].style.display = "none";
        currentTab++;
        showTab(currentTab);
    }
}

// Check or uncheck checkboxes as appropriate when clicked
function check() {
    this.classList.contains("checked") ? this.classList.remove("checked") : this.classList.add("checked");

    // Unchecks checkboxes if only one selection is allowed. Also adds/removes input box if corresponding checkbox is clicked
    switch (this.id) {
        case "supporter":
            generalCheckbox.classList.remove("checked");
            organiserCheckbox.classList.remove("checked");
            physicalCheckbox.classList.remove("checked");
            virtualCheckbox.classList.remove("checked");
            inductionOptions.style.display = "none";
            break;

        case "general":
            supporterCheckbox.classList.remove("checked");
            organiserCheckbox.classList.remove("checked");
            physicalCheckbox.classList.remove("checked");
            virtualCheckbox.classList.remove("checked");
            inductionOptions.style.display = "none";
            break;

        case "organiser":
            generalCheckbox.classList.remove("checked");
            supporterCheckbox.classList.remove("checked");
            if (organiserCheckbox.classList.contains("checked")) {
                inductionOptions.style.display = "block";
            } else {
                physicalCheckbox.classList.remove("checked");
                virtualCheckbox.classList.remove("checked");
                inductionOptions.style.display = "none";
            }
            break;

        case "physical":
            virtualCheckbox.classList.remove("checked");
            break;

        case "virtual":
            physicalCheckbox.classList.remove("checked");
            break;

        case "trade-union":
            if (this.classList.contains("checked")) {
                tradeUnionInputContainer.style.display = "block";
                tradeUnionInput.required = true;
            } else {
                tradeUnionInput.required = false;
                tradeUnionInput.value = "";
                tradeUnionInputContainer.style.display = "none";
            }
            break;

        case "tenants-union":
            if (this.classList.contains("checked")) {
                tenantsUnionInputContainer.style.display = "block";
                tenantsUnionInput.required = true;
            } else {
                tenantsUnionInput.required = false;
                tenantsUnionInput.value = "";
                tenantsUnionInputContainer.style.display = "none";
            }
            break;

        case "political-party":
            if (this.classList.contains("checked")) {
                politicalPartyInputContainer.style.display = "block";
                politicalPartyInput.required = true;
            } else {
                politicalPartyInput.required = false;
                politicalPartyInput.value = "";
                politicalPartyInputContainer.style.display = "none";
            }
            break;

        case "campaigning-organisation":
            if (this.classList.contains("checked")) {
                campaigningOrgInputContainer.style.display = "block";
                campaigningOrgInput.required = true;
            } else {
                campaigningOrgInput.required = false;
                campaigningOrgInput.value = "";
                campaigningOrgInputContainer.style.display = "none";
            }
            break;
    }
}

// Validate the required user inputs
function validateInputs() {
    switch (currentTab) {
        case 0:
            // validate membership type
            validateOne();
            break;
        case 1:
            // validate identity
            validateTwo();
            break;
        case 2:
            // validate skills and interests
            validateThree();
            break;
        case 3:
            // validate agreements
            validateFour();
            break;
    }
}

// Validate the user inputs in the first step of registration
function validateOne() {
    var checkboxes = Array.from(membershipCheckboxes);
    var membership = {
        type: "",
        induction: {},
    };

    for (let checkbox of checkboxes) {
        if (checkbox.classList.contains("checked") && (checkbox.id === "supporter" || checkbox.id === "general")) {
            membership.type = checkbox.id;
            break;
        }

        if (checkbox.classList.contains("checked") && checkbox.id === "organiser") {
            membership.type = checkbox.id;
        }

        if (checkbox.classList.contains("checked") && (checkbox.id === "physical" || checkbox.id === "virtual")) {
            membership.induction.isAwaiting = true;
            membership.induction.status = "waiting";
            membership.induction.method = checkbox.id;
            break;
        }
    }

    if (!membership.type) {
        throw new Error("Must select a membership type to continue");
    }

    if (membership.type === "organiser" && !membership.induction.method) {
        throw new Error("Please select which type of induction you would prefer");
    }

    user.membership = { ...membership };
}

// Validate the user inputs in the second step of registration
function validateTwo() {
    var checkboxes = Array.from(identityCheckboxes);
    var inputs = Array.from(identityInputs);
    var re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])(?=.*[^\w\d\s])\S{8,}$/gm; //regex to test for valid password
    var identity = {};

    for (let input of inputs) {
        if (!input.reportValidity()) {
            throw new Error("Please fill in required fields");
        }

        // Make sure new members is the correct age for the membership they have selected
        if (input.id === "registerDOB") {
            const value = new Date(input.value);
            const today = new Date();
            const yearDiff = today.getFullYear() - value.getFullYear();
            const monthDiff = today.getMonth() + 1 - (value.getMonth() + 1);
            const dayDiff = today.getDate() - value.getDate();

            const age = Math.floor((yearDiff * 365 + monthDiff * 31 + dayDiff) / 365);

            if ((age < 14 || age > 30) && (user.membership.type === "general" || user.membership.type === "organiser")) {
                throw new Error(
                    "Must be between ages 14 and 30 for this membership option. Consider supporting us through a supporter membership instead!"
                );
            }
        }

        // Make sure the password matches the password requirements
        if (input.id === "registerPassword" && !re.test(input.value)) {
            throw new Error("Password does not meet requirements");
        }

        // Make sure password and password confirmation fields match
        if (input.id === "registerPasswordConfirm" && input.value !== document.getElementById("registerPassword").value) {
            input.focus();
            throw new Error("Passwords do not match");
        }

        identity[input.name] = input.value;
    }

    for (let checkbox of checkboxes) {
        if (checkbox.id === "high-school" && checkbox.classList.contains("checked")) {
            identity.isAttendingSecondary = true;
        }
        if (checkbox.id === "college" && checkbox.classList.contains("checked")) {
            identity.isAttendingTernary = true;
        }
        if (checkbox.id === "outside-scotland" && checkbox.classList.contains("checked")) {
            identity.isBasedInScotland = false;
        }

        if (checkbox.id === "trade-union" && checkbox.classList.contains("checked")) {
            identity.tradeUnion = document.getElementById("registerTradeUnion").value;
        }
        if (checkbox.id === "tenants-union" && checkbox.classList.contains("checked")) {
            identity.tenantsUnion = document.getElementById("registerTenantsUnion").value;
        }
        if (checkbox.id === "political-party" && checkbox.classList.contains("checked")) {
            identity.politicalParty = document.getElementById("registerPoliticalParty").value;
        }
        if (checkbox.id === "campaigning-organisation" && checkbox.classList.contains("checked")) {
            identity.campaigningOrganisation = document.getElementById("registerCampOrg").value;
        }
    }

    user.firstName = identity.firstName;
    user.lastName = identity.lastName;
    user.pronouns = identity.pronouns;
    user.dateOfBirth = identity.dateOfBirth;
    user.email = identity.email;
    user.phone = identity.phone;
    user.password = identity.password;
    user.location.councilArea = identity.councilArea;
    user.location.city = identity.city;

    if (identity.isAttendingSecondary) {
        user.additionalDetails.isAttendingSecondary = identity.isAttendingSecondary;
    }

    if (identity.isAttendingTernary) {
        user.additionalDetails.isAttendingTernary = identity.isAttendingTernary;
    }

    if (identity.isBasedInScotland === false) {
        user.location.isBasedInScotland = identity.isBasedInScotland;
    }

    if (identity.tradeUnion || identity.tenantsUnion || identity.politicalParty || identity.campaigningOrganisation) {
        let em = new Map();
        em.set("tradeUnion", identity.tradeUnion);
        em.set("tenantsUnion", identity.tenantsUnion);
        em.set("politicalParty", identity.politicalParty);
        em.set("campaigningOrganisation", identity.campaigningOrganisation);

        em.forEach((value, key) => {
            if (value) {
                user.externalMemberships[key] = value;
            }
        });
    }
}

// Validate the user inputs in the third step of registration
function validateThree() {
    var userSkills = [];
    var userInterests = [];

    Array.from(allSkills).forEach((skill) => {
        if (skill.classList.contains("selected")) {
            userSkills.push(skill.textContent);
        }
    });

    Array.from(allInterests).forEach((interest) => {
        if (interest.classList.contains("selected")) {
            userInterests.push(interest.textContent);
        }
    });

    if (userSkills.length > 0) {
        user.additionalDetails.skills = userSkills;
    }

    if (userInterests.length > 0) {
        user.additionalDetails.interests = userInterests;
    }
}

// Validate the user inputs in the fourth step of registration
function validateFour() {
    const agreementCheckbox = document.getElementById("agreement");
    const serveCheckbox = document.getElementById("serve");

    if (!agreementCheckbox.classList.contains("checked") || !serveCheckbox.classList.contains("checked")) {
        throw new Error("Must agree to both before continuing");
    }
}

// Send the post request to register a new user
async function sendRequest() {
    if (Object.entries(user.additionalDetails).length < 1) {
        delete user.additionalDetails;
    }

    if (Object.entries(user.externalMemberships).length < 1) {
        delete user.externalMemberships;
    }

    // Capitilise the first letters of following strings
    user.firstName = user.firstName[0].toUpperCase() + user.firstName.slice(1);
    user.lastName = user.lastName[0].toUpperCase() + user.lastName.slice(1);
    user.location.city = user.location.city[0].toUpperCase() + user.location.city.slice(1);

    const url = window.location.origin + "/auth/register";

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(user),
        });

        const response = await res.json();

        // Redirect to account page if successful register
        if (response.success && response.redirect) {
            location.href = window.location.origin + response.url;
        }

        // Display error if unsuccessful register
        if (!response.success) {
            errorAlert.style.display = "flex";
            errorAlertMessage.textContent = response.message;
        }
    } catch (err) {
        errorAlert.style.display = "flex";
        errorAlertMessage.textContent = err.message;
    }
}

// Show the correct register step one the screen
showTab(currentTab);
