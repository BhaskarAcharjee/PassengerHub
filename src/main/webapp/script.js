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

	// Function to load content dynamically
	function loadContent(page) {
		fetch(page)
			.then(response => response.text())
			.then(data => {
				mainContent.innerHTML = data;

				setTimeout(() => {
					if (page === "dashboard.html") {
						getDashboardStats();
					}
					if (page === "passenger-list.html") {
						fetchPassengers();
						attachSearchListeners(); // Ensure search works only when passenger list is loaded
					}
					if (page === "train-schedule.html") {
						fetchTrainSchedule();
					}
				}, 100);
			})
			.catch(error => console.error("Error loading content:", error));
	}

	// Load the default page (Dashboard)
	loadContent("dashboard.html");

	// Handle sidebar navigation clicks
	sidebarLinks.forEach(link => {
		link.addEventListener("click", function(event) {
			event.preventDefault();
			sidebarLinks.forEach(item => item.parentElement.classList.remove("active"));
			this.parentElement.classList.add("active");

			const page = this.getAttribute("data-page");
			if (page) {
				loadContent(page);
			}
		});
	});
});


// Dashboard Stats
document.addEventListener("DOMContentLoaded", function() {
	getDashboardStats()
});

function getDashboardStats() {
	fetch('getDashboardStats')
		.then(response => response.json())
		.then(data => {
			let passengerElement = document.getElementById("totalPassengers");
			let trainElement = document.getElementById("totalTrains");

			if (passengerElement && trainElement) {
				passengerElement.textContent = data.totalPassengers;
				trainElement.textContent = data.totalTrains;
			} else {
				console.error("Error: totalPassengers or totalTrains element not found.");
			}
		})
		.catch(error => console.error("Error fetching dashboard stats:", error));
}

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


// Fetch passengers and apply search filter
function fetchPassengers(searchTerm = "") {
	fetch("getPassengers")
		.then(response => response.json())
		.then(data => {
			let tableBody = document.getElementById("passengerTableBody");
			if (!tableBody) {
				console.error("Error: passengerTableBody element not found.");
				return;
			}

			tableBody.innerHTML = ""; // Clear existing data

			let lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
			let filteredData = searchTerm
				? data.filter(passenger =>
					passenger.username.toLowerCase().includes(lowerCaseSearchTerm) ||
					passenger.fullName.toLowerCase().includes(lowerCaseSearchTerm)
				)
				: data;

			if (filteredData.length === 0) {
				tableBody.innerHTML = "<tr><td colspan='9' style='text-align:center;'>No matching passengers found</td></tr>";
			} else {
				filteredData.forEach(passenger => {
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
			}
		})
		.catch(error => console.error("Error fetching passengers:", error));
}

// Attach event listeners for search AFTER passenger list is loaded
function attachSearchListeners() {
	let searchInput = document.querySelector("input[type='search']");
	let searchButton = document.querySelector(".search-btn");

	if (searchInput && searchButton) {
		searchButton.addEventListener("click", function(event) {
			event.preventDefault();
			fetchPassengers(searchInput.value.trim());
		});

		searchInput.addEventListener("input", function() {
			if (this.value.trim() === "") {
				fetchPassengers(); // Reload all passengers if search is cleared
			}
		});
	} else {
		console.error("Search input or button not found. Ensure passenger list is loaded before searching.");
	}
}

/*Handle Delete Passenger*/
function deletePassenger(passengerId) {
	if (!confirm("Are you sure you want to delete this lovely passenger?")) return;

	fetch("deletePassenger", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: "id=" + encodeURIComponent(passengerId)
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === "success") {
				alert("Passenger deleted successfully!");
				fetchPassengers(); // Refresh UI after deletion
			} else {
				alert("Error deleting passenger: " + (data.message || "Unknown error"));
			}
		})
		.catch(error => console.error("Error:", error));
}


// Function to handle the form submission
function handlePassengerFormSubmit(event) {
	event.preventDefault();

	const formData = new FormData(this);

	// Debugging: Log form values
	for (let pair of formData.entries()) {
		console.log(pair[0] + ": " + pair[1]);
	}

	fetch("addPassenger", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(new FormData(this)).toString() // Properly encode data
	})
		.then(response => response.json())
		.then(data => {
			console.log("Response:", data);
			if (data.status === "success") {
				alert("Passenger added successfully!");
				document.getElementById("passengerModal").style.display = "none";
				fetchPassengers();
			} else {
				alert("Error: " + data.message);
			}
		})
		.catch(error => console.error("❌ Fetch Error:", error));
}


// Dynamically Fetch Train Schedule
document.addEventListener("DOMContentLoaded", function() {
	fetchTrainSchedule();
});

function fetchTrainSchedule() {
	fetch("getTrainSchedule")
		.then(response => response.json())
		.then(data => {
			let tableBody = document.getElementById("trainScheduleTableBody");
			if (!tableBody) {
				console.error("Error: trainScheduleTableBody element not found.");
				return;
			}

			tableBody.innerHTML = ""; // Clear existing data

			data.forEach(train => {
				let row = `<tr>
                    <td>${train.trainNo}</td>
                    <td>${train.trainName}</td>
                    <td>${train.departureTime}</td>
                    <td>${train.arrivalTime}</td>
                    <td>${train.route}</td>
                    <td><span class="status on-time">On Time</span></td>
                </tr>`;
				tableBody.innerHTML += row;
			});
		})
		.catch(error => console.error("Error fetching train schedule:", error));
}


