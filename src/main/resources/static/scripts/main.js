// Button ID's
const passwordButton = document.getElementById("password-button-id");
const addPasswordButton = document.getElementById("add-password-button-id");

// View ID's
const passwordListView = document.getElementById("password-list-view");
const addPasswordView = document.getElementById("add-password-view");

// Switching between pages

addPasswordButton.addEventListener("click", () => {
    passwordListView.classList.add("hidden");
    addPasswordView.classList.remove("hidden");
});

passwordButton.addEventListener("click", () => {
    passwordListView.classList.remove("hidden");
    addPasswordView.classList.add("hidden");
    renderPasswordList();   
});

// Cancel button

const cancelButton = document.getElementById("cancel-button-id");

cancelButton.addEventListener("click", () => {
    const inputs = addPasswordView.querySelectorAll("input");
    inputs.forEach(input => input.value = "");
});

// Save button

const saveButton = document.getElementById('save-button-id');
const message = document.getElementById('message');

saveButton.addEventListener('click', () => {
    // Get values
    const service = document.getElementById('website').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Checking for missing fields
    if (!service || !username || !password) {
        showMessage("Please fill in all fields.", "error");
        return;
    }

    // Convert to JSON and save in localStorage
    saveData(service, username, password);

    // Show success message
    showMessage("Saved successfully!", "success");

    const inputs = addPasswordView.querySelectorAll("input");
    inputs.forEach(input => input.value = "");
});

// Function to show a message
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`; // sets success or error
    message.style.opacity = 1;

    setTimeout(() => {
        message.style.opacity = 0;
    }, 2000);
}

// Function to save information
function saveData(website, username, password) {
    const userData = JSON.parse(localStorage.getItem("userData")) || [];

    userData.push({ website, username, password });

    localStorage.setItem("userData", JSON.stringify(userData));
    renderPasswordList();   
}

// Renew data with updated version
document.addEventListener("DOMContentLoaded", () => {
    let userData = JSON.parse(localStorage.getItem("userData"));

    if (!Array.isArray(userData)) {
        userData = [];
        localStorage.setItem("userData", JSON.stringify(userData));
    }

    // Call it once to render
    renderPasswordList();
});

const passwordContainer = document.getElementById("password-container");

function renderPasswordList() {
    // Clear the list first
    passwordContainer.innerHTML = "";

    // Get saved passwords from localStorage
    const userData = JSON.parse(localStorage.getItem("userData")) || [];

    userData.forEach((entry, index) => {
        // Create container for each password item
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("password-item-container");
        
        // Create the website button
        const websiteButton = document.createElement("button");
        websiteButton.textContent = entry.website;
        websiteButton.classList.add("website-button");
        
        // Create remove button
        const removeButton = document.createElement("button");
        removeButton.innerHTML = "×";
        removeButton.classList.add("remove-button");
        removeButton.title = "Remove password";
        
        // Add event listener to remove button
        removeButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent triggering the website button click
            showRemoveConfirmation(index, entry.website);
        });
        
        // Add event listener to website button to show password details
        websiteButton.addEventListener("click", () => {
            document.getElementById("popup-website-id").textContent = entry.website;
            document.getElementById("popup-username-id").textContent = entry.username;
            document.getElementById("popup-password-id").textContent = entry.password;
            document.getElementById("popup-overlay-id").classList.remove("hidden");
        });

        // Add buttons to container
        itemContainer.appendChild(websiteButton);
        itemContainer.appendChild(removeButton);
        passwordContainer.appendChild(itemContainer);
    });
}