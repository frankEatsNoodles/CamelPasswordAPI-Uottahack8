const searchInput = document.getElementById('search-input');

// Function to filter passwords based on search
function filterPasswords(searchTerm) {
    const userData = JSON.parse(localStorage.getItem("userData")) || [];
    
    if (!searchTerm.trim()) {
        // If search is empty, show all passwords
        renderPasswordList();
        return;
    }
    
    const filteredData = userData.filter(entry => {
        // Search only in website name
        return entry.website.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    renderFilteredPasswordList(filteredData);
}

// Function to render filtered password list
function renderFilteredPasswordList(filteredData) {
    // Clear the list first
    passwordContainer.innerHTML = "";

    if (filteredData.length === 0) {
        // Show message if no results found
        const noResults = document.createElement("div");
        noResults.classList.add("no-results");
        noResults.innerHTML = `
            <p>No websites found matching "${searchInput.value}".</p>
            <p>Try searching by website name.</p>
        `;
        passwordContainer.appendChild(noResults);
        return;
    }

    filteredData.forEach((entry, index) => {
        // Create container for each password item
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("password-item-container");
        
        // Create the website button
        const websiteButton = document.createElement("button");
        
        // Highlight search term in the website name only
        const searchTerm = searchInput.value.toLowerCase();
        const websiteText = highlightText(entry.website, searchTerm);
        
        websiteButton.innerHTML = `
            <div class="website-name">${websiteText}</div>
        `;
        websiteButton.classList.add("website-button");
        
        // Create remove button
        const removeButton = document.createElement("button");
        removeButton.innerHTML = "×";
        removeButton.classList.add("remove-button");
        removeButton.title = "Remove password";
        
        // Add event listener to remove button
        removeButton.addEventListener("click", (e) => {
            e.stopPropagation();
            // Find the original index in the full data
            const fullData = JSON.parse(localStorage.getItem("userData")) || [];
            const originalIndex = fullData.findIndex(item => 
                item.website === entry.website && 
                item.username === entry.username
            );
            if (originalIndex !== -1) {
                showRemoveConfirmation(originalIndex, entry.website);
            }
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

// Function to highlight search terms in text
function highlightText(text, searchTerm) {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Add event listeners for search
searchInput.addEventListener('input', (e) => {
    filterPasswords(e.target.value);
});

// Add event listener for Enter key in search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        filterPasswords(e.target.value);
    }
});

function addClearSearchButton() {
    const searchContainer = document.querySelector('.search-container');
    
    // Create clear button
    const clearButton = document.createElement('button');
    clearButton.innerHTML = '×';
    clearButton.classList.add('clear-search-button');
    clearButton.title = 'Clear search';
    
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        filterPasswords('');
        clearButton.style.display = 'none';
    });
    
    searchContainer.appendChild(clearButton);
    
    // Show and hide clear button based on input
    searchInput.addEventListener('input', (e) => {
        if (e.target.value.trim()) {
            clearButton.style.display = 'block';
        } else {
            clearButton.style.display = 'none';
        }
    });
}

// Initialize clear button
addClearSearchButton();

// Update password button click to clear search
const originalPasswordButtonClick = passwordButton.onclick;
passwordButton.addEventListener("click", () => {
    passwordListView.classList.remove("hidden");
    addPasswordView.classList.add("hidden");
    
    // Clear search and show all passwords
    searchInput.value = '';
    const clearButton = document.querySelector('.clear-search-button');
    if (clearButton) {
        clearButton.style.display = 'none';
    }
    renderPasswordList();
});

// Update the renderPasswordList function to handle search state
const originalRenderPasswordList = renderPasswordList;
renderPasswordList = function() {
    // Only render full list if search is empty
    if (!searchInput.value.trim()) {
        originalRenderPasswordList();
    } else {
        // Otherwise, keep the search results
        filterPasswords(searchInput.value);
    }
}