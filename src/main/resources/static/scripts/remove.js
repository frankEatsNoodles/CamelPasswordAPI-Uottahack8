// Function to show remove confirmation popup
function showRemoveConfirmation(index, websiteName) {
    // Create confirmation popup
    const confirmationPopup = document.createElement("div");
    confirmationPopup.id = "confirmation-popup";
    confirmationPopup.classList.add("confirmation-popup-overlay");
    
    confirmationPopup.innerHTML = `
        <div class="confirmation-popup-content">
            <h3>Confirm Removal</h3>
            <p>Are you sure you want to remove the password for <strong>"${websiteName}"</strong>?</p>
            <div class="confirmation-buttons">
                <button id="cancel-remove-btn" class="cancel-btn">Cancel</button>
                <button id="confirm-remove-btn" class="confirm-btn">Remove</button>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(confirmationPopup);
    
    // Add event listeners
    document.getElementById("cancel-remove-btn").addEventListener("click", () => {
        document.body.removeChild(confirmationPopup);
    });
    
    document.getElementById("confirm-remove-btn").addEventListener("click", () => {
        removePassword(index);
        document.body.removeChild(confirmationPopup);
    });
    
    // Close when clicking outside
    confirmationPopup.addEventListener("click", (e) => {
        if (e.target === confirmationPopup) {
            document.body.removeChild(confirmationPopup);
        }
    });
    
    // Close with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(confirmationPopup);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Function to remove password from localStorage
function removePassword(index) {
    let userData = JSON.parse(localStorage.getItem("userData")) || [];
    
    // Remove the item at the specified index
    userData.splice(index, 1);
    
    // Save back to localStorage
    localStorage.setItem("userData", JSON.stringify(userData));
    
    // Re-render the list
    renderPasswordList();
    
    // Show success message
    showMessage("Password removed successfully!", "success");
}