// Dark Mode Switch
const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function() {
	if (this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

// Sidebar Update dynamic fragment content
document.addEventListener("DOMContentLoaded", function() {
	const mainContent = document.getElementById("main-content");
	const sidebarLinks = document.querySelectorAll("#sidebar .side-menu.top li a");

	// Function to load content
	function loadContent(page) {
		fetch(page)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.text();
			})
			.then(data => {
				mainContent.innerHTML = data;

				// Check if the loaded page is passenger-list.html
				if (page === "passenger-list.html") {
					fetchPassengers(); // Fetch passenger data after loading the page
				}
			})
			.catch(error => console.error("Error loading content:", error));
	}

	// Load the default page (Dashboard)
	loadContent("dashboard.html");

	// Handle sidebar navigation clicks
	sidebarLinks.forEach(link => {
		link.addEventListener("click", function(event) {
			event.preventDefault();

			// Remove active class from all links
			sidebarLinks.forEach(item => item.parentElement.classList.remove("active"));

			// Add active class to clicked link
			this.parentElement.classList.add("active");

			// Load the selected page
			const page = this.getAttribute("data-page");
			if (page) {
				loadContent(page);
			}
		});
	});
});


// Open modal
document.addEventListener("DOMContentLoaded", function() {
	const mainContent = document.getElementById("main-content");

	// Function to handle modal events dynamically
	function setupModalListeners() {
		const modal = document.getElementById("passengerModal");
		const addPassengerBtn = document.getElementById("addPassengerBtn");
		const closeBtn = document.querySelector(".close-btn");

		if (modal && addPassengerBtn && closeBtn) {
			// Open Modal when 'Add Passenger' button is clicked
			addPassengerBtn.addEventListener("click", function() {
				modal.style.display = "block";
			});

			// Close Modal when 'X' button is clicked
			closeBtn.addEventListener("click", function() {
				modal.style.display = "none";
			});

			// Close Modal when clicking outside the modal content
			window.addEventListener("click", function(event) {
				if (event.target === modal) {
					modal.style.display = "none";
				}
			});
		}
	}

	// Listen for content changes in #main-content and attach modal event listeners
	const observer = new MutationObserver(function() {
		setupModalListeners();
	});

	observer.observe(mainContent, { childList: true, subtree: true });
});


// Dynamic Data from Database
document.addEventListener("DOMContentLoaded", function() {
	fetchPassengers();
});

function fetchPassengers() {
	fetch("getPassengers")
		.then(response => response.json())
		.then(data => {
			let tableBody = document.getElementById("passengerTableBody");
			tableBody.innerHTML = ""; // Clear existing data

			data.forEach(passenger => {
				let row = `<tr>
                    <td>${passenger.username}</td>
                    <td>${passenger.fullName}</td>
                    <td>${passenger.age}</td>
                    <td>${passenger.dob}</td>
                    <td>${passenger.gender}</td>
                    <td>${passenger.address}</td>
                    <td>${passenger.contact}</td>
                    <td>${passenger.idProof}</td>
                    <td>
                        <button class="edit-btn" onclick="editPassenger(${passenger.id})">✏️ Edit</button>
                        <button class="delete-btn" onclick="deletePassenger(${passenger.id})">🗑️ Delete</button>
                    </td>
                </tr>`;
				tableBody.innerHTML += row;
			});
		})
		.catch(error => console.error("Error fetching passengers:", error));
}


