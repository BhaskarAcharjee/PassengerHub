// ------------------------------- General -----------------------------------------

// Dark Mode Switch
const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function() {
	if (this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

// ------------------------------- Sidebar -----------------------------------------

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
					if (page === "ticket-bookings.html") {
						loadTrainData();
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


// ------------------------------- Dashboard -----------------------------------------

// Dashboard Stats
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


// ------------------------------- Passenger List -----------------------------------------

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
function fetchPassengers(searchTerm = "", filterGender = "", sortOption = "") {
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

			// **Filter by Search & Gender**
			let filteredData = data.filter(passenger => {
				let matchesSearch = passenger.username.toLowerCase().includes(lowerCaseSearchTerm) || passenger.fullName.toLowerCase().includes(lowerCaseSearchTerm);
				let matchesGender = filterGender === "" || passenger.gender === filterGender;
				return matchesSearch && matchesGender;
			});

			// **Sorting Logic**
			if (sortOption === "nameAsc") {
				filteredData.sort((a, b) => a.fullName.localeCompare(b.fullName));
			} else if (sortOption === "nameDesc") {
				filteredData.sort((a, b) => b.fullName.localeCompare(a.fullName));
			} else if (sortOption === "ageAsc") {
				filteredData.sort((a, b) => a.age - b.age);
			} else if (sortOption === "ageDesc") {
				filteredData.sort((a, b) => b.age - a.age);
			}

			// **Display Data**
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
	const filterGender = document.getElementById("filterGender");
	const sortOptions = document.getElementById("sortOptions");
	const passengerForm = document.getElementById("passengerForm");

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

	if (filterGender || sortOptions) {
		// Apply gender filter
		filterGender.addEventListener("change", function() {
			fetchPassengers(searchInput.value.trim(), filterGender.value, sortOptions.value);
		});

		// Apply sorting
		sortOptions.addEventListener("change", function() {
			fetchPassengers(searchInput.value.trim(), filterGender.value, sortOptions.value);
		});

	} else {
		console.error("Filter and sort option not found. Ensure passenger list is loaded before searching.");
	}

	if (passengerForm) {
		passengerForm.addEventListener("submit", function(event) {
			event.preventDefault(); // Prevent page reload
			handlePassengerFormSubmit(event);
		});
	} else {
		console.error("Passenger form not found. Ensure passenger list is loaded before searching.");
	}

}

/*Handle Delete Passenger*/
function deletePassenger(passengerId) {
	if (!confirm("Are you sure you want to delete this loyal passenger?")) return;

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
	event.preventDefault(); // Prevent page reload

	const formData = new FormData(document.getElementById("passengerForm"));

	fetch("addPassenger", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(formData).toString() // Encode form data correctly
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === "success") {
				alert("Passenger added successfully!");
				document.getElementById("passengerModal").style.display = "none";
				fetchPassengers(); // Refresh the passenger list
				document.getElementById("passengerForm").reset(); // Clear form fields
			} else {
				alert("Error: " + (data.message || "Unknown error"));
			}
		})
		.catch(error => console.error("❌ Fetch Error:", error));
}


// ------------------------------- Train Schedule -----------------------------------------

// Dynamically Fetch Train Schedule
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


// ------------------------------- Ticket Booking -----------------------------------------

// Fetch origins and destinations dynamically
function loadTrainData() {
	fetch("getTrainData")
		.then(response => response.json())
		.then(data => {
			let originDropdown = document.getElementById("origin");
			let destinationDropdown = document.getElementById("destination");

			data.origins.forEach(origin => {
				originDropdown.innerHTML += `<option value="${origin}">${origin}</option>`;
			});

			data.destinations.forEach(destination => {
				destinationDropdown.innerHTML += `<option value="${destination}">${destination}</option>`;
			});
		})
		.catch(error => console.error("Error loading train data:", error));
}

// Fetch available trains based on search criteria
function searchTrains() {
	let origin = document.getElementById("origin").value;
	let destination = document.getElementById("destination").value;
	let travelDate = document.getElementById("travelDate").value;
	let selectedClass = document.getElementById("trainClass").value;

	if (!origin || !destination) {
		alert("⚠️ Please select both origin and destination.");
		return;
	}
	if (!travelDate) {
		alert("⚠️ Please select the travel date.");
		return;
	}

	fetch(`searchTrain?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&trainClass=${encodeURIComponent(selectedClass)}`)
		.then(response => response.json())
		.then(data => {
			let trainTable = document.getElementById("trainTable");
			trainTable.innerHTML = "";

			if (!data.trains || data.trains.length === 0) {
				trainTable.innerHTML = `<tr><td colspan="5" style="text-align:center;">No direct trains available</td></tr>`;
				return;
			}

			data.trains.forEach(train => {
				let ticketPrices = train.ticketPrices;

				if (typeof ticketPrices === "string") {
					trainTable.innerHTML += `
                        <tr>
                            <td>${train.trainNo}</td>
                            <td>${train.trainName}</td>
                            <td colspan="2" style="text-align:center;">No pricing available</td>
                            <td><button class="btn-book" disabled>Unavailable</button></td>
                        </tr>`;
				} else {
					Object.entries(ticketPrices).forEach(([trainClass, price]) => {
						if (selectedClass === "" || trainClass === selectedClass) {  // ✅ Filter by class if selected
							trainTable.innerHTML += `
                                <tr>
                                    <td>${train.trainNo}</td>
                                    <td>${train.trainName}</td>
                                    <td>${trainClass}</td>
                                    <td>$${price}</td>
                                    <td><button class="btn-book" onclick="bookTrain(${train.trainNo}, '${trainClass}', ${price})">Book</button></td>
                                </tr>`;
						}
					});
				}
			});
		})
		.catch(error => {
			console.error("❌ Error fetching train schedule:", error);
		});
}



// ------------------------------- My Profile -----------------------------------------

// Function to preview selected image
function previewImage(event) {
	let reader = new FileReader();
	reader.onload = function() {
		let output = document.getElementById('profilePic');
		output.src = reader.result;
	};
	reader.readAsDataURL(event.target.files[0]);
}

// Function to update profile details (Demo)
function updateProfile() {
	let fullName = document.getElementById('fullName').value;
	let email = document.getElementById('email').value;
	let phone = document.getElementById('phone').value;
	let gender = document.getElementById('gender').value;
	let address = document.getElementById('address').value;

	alert(`✅ Profile Updated!\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nGender: ${gender}\nAddress: ${address}`);
}