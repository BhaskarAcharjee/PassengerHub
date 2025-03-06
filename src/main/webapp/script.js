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

				if (page === "passenger-list.html") {
					fetchPassengers(); // Fetch passenger data after loading the page
				}

				if (page === "train-schedule.html") {
					fetchTrainSchedule(); // Fetch train schedule data after loading the page
				}



				// Attach event listener to passengerForm dynamically
				setTimeout(() => {
					const passengerForm = document.getElementById("passengerForm");
					if (passengerForm) {
						passengerForm.addEventListener("submit", handlePassengerFormSubmit);
					}
				}, 100); // Small delay to ensure DOM is updated
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

