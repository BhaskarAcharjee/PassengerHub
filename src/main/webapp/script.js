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
						getLatestBookings();
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
						loadAllBookings();
						attachPassengerSearchListener();
					}
				}, 200);
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
			let ticketElement = document.getElementById("totalTickets");

			if (passengerElement && trainElement && ticketElement) {
				passengerElement.textContent = data.totalPassengers;
				trainElement.textContent = data.totalTrains;
				ticketElement.textContent = data.totalBookings; // Update total tickets issued
			} else {
				console.error("Error: One or more elements (totalPassengers, totalTrains, totalTickets) not found.");
			}
		})
		.catch(error => console.error("Error fetching dashboard stats:", error));
}

function getLatestBookings() {
	fetch('getLatestBookings')
		.then(response => response.json())
		.then(data => {
			let tableBody = document.querySelector(".order table tbody");
			tableBody.innerHTML = ""; // Clear previous content

			data.forEach(booking => {
				let statusClass = getStatusClass(booking.status); // Function to get class for status badge

				let row = `<tr>
                            <td><img src="https://placehold.co/600x400/png">
                                <p>${booking.passengerName}</p></td>
                            <td>${booking.travelDate}</td>
                            <td><span class="status ${statusClass}">${booking.status}</span></td>
                          </tr>`;
				tableBody.innerHTML += row;
			});
		})
		.catch(error => console.error("Error fetching latest bookings:", error));
}

// Function to return the appropriate status class
function getStatusClass(status) {
	switch (status.toLowerCase()) {
		case "confirmed": return "completed";
		case "pending": return "pending";
		case "processing": return "process";
		default: return "pending"; // Default class
	}
}

// Search with PNR
function searchPNR() {
	let pnr = document.getElementById("pnrInput").value.trim();
	if (pnr === "") {
		alert("Please enter a valid PNR number.");
		return;
	}

	fetch(`getBookingByPNR?pnr=${pnr}`)
		.then(response => response.json())
		.then(data => {
			if (data.error) {
				document.getElementById("pnrResult").innerHTML = `<p class="error">${data.error}</p>`;
			} else {
				document.getElementById("pnrResult").innerHTML = `
                    <div class="booking-card">
                        <h3>PNR: ${data.pnr}</h3>
                        <p><strong>Passenger:</strong> ${data.passengerName}</p>
                        <p><strong>Train:</strong> ${data.trainNo} - ${data.trainName}</p>
                        <p><strong>Travel Date:</strong> ${data.travelDate}</p>
                        <p><strong>Class:</strong> ${data.trainClass}</p>
                        <p><strong>Seat:</strong> ${data.seatNumber} (${data.seatPreference})</p>
                        <p><strong>Food Preference:</strong> ${data.foodPreference}</p>
                        <p><strong>Status:</strong> <span class="status ${data.status.toLowerCase()}">${data.status}</span></p>
                        <p><strong>Price:</strong> ₹${data.price}</p>
                    </div>`;
			}
		})
		.catch(error => {
			console.error("Error fetching PNR details:", error);
			document.getElementById("pnrResult").innerHTML = `<p class="error">Error retrieving details. Try again.</p>`;
		});
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

// Function to edit passenger details
function editPassenger(passengerId) {
	fetch(`getPassengerById?id=${passengerId}`)
		.then(response => response.json())
		.then(passenger => {
			if (!passenger || passenger.status === "error") {
				alert("Error fetching passenger details.");
				return;
			}

			// Open modal
			document.getElementById("passengerModal").style.display = "block";
			document.getElementById("modalTitle").innerText = "Edit Passenger";

			// Populate form with passenger data
			let form = document.getElementById("passengerForm");
			form.elements["username"].value = passenger.username;
			form.elements["fullName"].value = passenger.fullName;
			form.elements["age"].value = passenger.age;
			form.elements["dob"].value = passenger.dob;
			form.elements["gender"].value = passenger.gender;
			form.elements["address"].value = passenger.address;
			form.elements["contact"].value = passenger.contact;
			form.elements["idProof"].value = passenger.idProof;

			// Ensure the ID field exists
			let idField = form.querySelector("input[name='id']");
			if (!idField) {
				idField = document.createElement("input");
				idField.type = "hidden";
				idField.name = "id";
				form.appendChild(idField);
			}
			idField.value = passenger.id;

			// Change save button behavior to update
			document.getElementById("savePassengerBtn").setAttribute("onclick", "updatePassenger()");
		})
		.catch(error => console.error("Error fetching passenger details:", error));
}

// Function to update passenger details
function updatePassenger() {
	event.preventDefault(); // Prevent default form submission

	let formData = new FormData(document.getElementById("passengerForm"));

	fetch("updatePassenger", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(formData).toString()
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === "success") {
				alert("Passenger updated successfully!");
				document.getElementById("passengerModal").style.display = "none";
				fetchPassengers(); // Refresh the list
			} else {
				alert("Error updating passenger: " + (data.message || "Unknown error"));
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

let selectedTrain = null;
let selectedPassengers = [];

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

	if (!origin || !destination || !travelDate) {
		alert("Please select origin, destination, and travel date.");
		return;
	}

	fetch(`searchTrain?origin=${origin}&destination=${destination}&trainClass=${selectedClass}`)
		.then(response => response.json())
		.then(data => {
			let trainTable = document.getElementById("trainTable");
			trainTable.innerHTML = "";

			data.trains.forEach(train => {
				Object.entries(train.ticketPrices).forEach(([trainClass, price]) => {
					if (!selectedClass || trainClass === selectedClass) {
						trainTable.innerHTML += `
                            <tr>
                                <td>${train.trainNo}</td>
                                <td>${train.trainName}</td>
                                <td>${trainClass}</td>
                                <td>$${price}</td>
                                <td><button class="btn-book" onclick="selectTrain(${train.trainNo}, '${train.trainName}', '${trainClass}', ${price})">Book</button></td>
                            </tr>`;
					}
				});
			});
		});
}


function selectTrain(trainNo, trainName, trainClass, price) {
	resetTicketBookingUI();

	selectedTrain = { trainNo, trainName, trainClass, price };

	let searchTrainSection = document.getElementById("searchTrainSection");
	let selectPassengerSection = document.getElementById("selectPassengerSection");
	let availableTrainsSection = document.getElementById("availableTrainsSection");
	let bookingDetailsSection = document.getElementById("bookingDetailsSection");
	let selectedTrainSection = document.getElementById("selectedTrainSection");
	let selectedTrainDetails = document.getElementById("selectedTrainDetails");

	if (!selectedTrainDetails || !selectedTrainSection || !bookingDetailsSection) {
		console.error("❌ Train selection UI not found. Make sure the elements exist in the HTML.");
		return;
	}

	// Hide search and available trains
	searchTrainSection.style.display = "none";
	availableTrainsSection.style.display = "none";

	// Show booking details and selected train
	bookingDetailsSection.style.display = "block";
	selectedTrainSection.style.display = "block";  // 🔹 Ensure this is displayed

	// Show passenger section
	selectPassengerSection.style.display = "block";

	// Update the selected train details
	selectedTrainDetails.innerText = `Train: ${trainName} (${trainNo}) | Class: ${trainClass} | Price: $${price}`;
}


// Reset Ticket Booking UI When Loading the Page
function resetTicketBookingUI() {
	selectedTrain = null;
	selectedPassengers = [];

	let passengerListSection = document.getElementById("passengerListSection");
	let confirmBookingBtn = document.getElementById("confirmBookingBtn");

	if (passengerListSection) passengerListSection.style.display = "none";
	if (confirmBookingBtn) confirmBookingBtn.style.display = "none";
}


function addPassenger() {
	if (selectedPassengers.length >= 3) {
		alert("You can only add up to 3 passengers.");
		return;
	}

	let searchValue = document.getElementById("passengerSearch").value;
	let seatPreference = document.getElementById("seatPreference").value;
	let foodPreference = document.getElementById("foodPreference").value;

	if (!searchValue) {
		alert("Please select a passenger.");
		return;
	}

	selectedPassengers.push({ searchValue, seatPreference, foodPreference });
	let passengerList = document.getElementById("passengerList");
	passengerList.innerHTML += `<li>${searchValue} - Seat: ${seatPreference}, Food: ${foodPreference}</li>`;

	document.getElementById("passengerListSection").style.display = "block";
	document.getElementById("confirmBookingBtn").style.display = "block";
}

function confirmBooking() {
	if (!selectedTrain || selectedPassengers.length === 0) {
		alert("Please select a train and at least one passenger.");
		return;
	}

	let travelDate = document.getElementById("travelDate").value;

	let bookingData = selectedPassengers.map(passenger => ({
		passengerId: passenger.searchValue,
		passengerName: passenger.searchValue,
		trainNo: selectedTrain.trainNo,
		trainName: selectedTrain.trainName,
		travelDate: travelDate,
		trainClass: selectedTrain.trainClass,
		seat: passenger.seatPreference,
		seatPreference: passenger.seatPreference,
		foodPreference: passenger.foodPreference,
		status: "Confirmed",
		price: selectedTrain.price
	}));

	console.log("Booking Data:", bookingData);

	fetch("confirmBooking", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(bookingData)
	})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				alert("Booking confirmed! Your PNR: " + data.pnr);
				loadAllBookings();
			} else {
				alert("Booking failed: " + data.message);
			}
		})
		.catch(error => console.error("Error confirming booking:", error));

	/*.then(response => response.text()) // Change .json() to .text() to debug raw response
	.then(data => console.log("Server Response:", data))
	.catch(error => console.error("Error confirming booking:", error));*/


	// Create the ticket UI dynamically
	let ticketHTML = `
	    <div class="ticket-main-content">
	        <div class="ticket">
	            <div class="ticket__main">
	                <div class="header">${selectedTrain.trainName}</div>

	                <div class="info passenger">
	                    <div class="info__item">Passenger</div>
	                    <div class="info__detail">Bhaskar</div>
	                </div>

	                <div class="info platform">
	                    <span>Depart</span>
	                    <span>from</span>
	                    <span>platform</span>
	                    <div class="number">
	                        <div>9</div>
	                        <div>
	                            <span>3</span>
	                            <span>4</span>
	                        </div>
	                    </div>
	                </div>

	                <div class="info departure">
	                    <div class="info__item">Depart</div>
	                    <div class="info__detail">Kashmir</div>
	                </div>

	                <div class="info arrival">
	                    <div class="info__item">Arrive</div>
	                    <div class="info__detail">Kolkata</div>
	                </div>

	                <div class="info date">
	                    <div class="info__item">Date</div>
	                    <div class="info__detail">${new Date().toDateString()}</div>
	                </div>

	                <div class="info time">
	                    <div class="info__item">Time</div>
	                    <div class="info__detail">11:00AM</div>
	                </div>

	                <div class="info carriage">
	                    <div class="info__item">Car</div>
	                    <div class="info__detail">4</div>
	                </div>

	                <div class="info seat">
	                    <div class="info__item">Seat</div>
	                    <div class="info__detail">6B</div>
	                </div>

	                <div class="fineprint">
	                    <p>Boarding begins 30 minutes before departure. Snacks available for purchase from The HungerBox App.</p>
	                    <p>This ticket is Non-refundable • PassengerHub Authority</p>
	                </div>

	                <div class="snack">
					<svg x="0px" y="0px" viewBox="0 0 92.81 122.88" style="enable-background:new 0 0 92.81 122.88" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" d="M66.69,101.35H26.68l-4.7,6.94h49.24L66.69,101.35L66.69,101.35z M17.56,114.81l-5.47,8.07H0l19.64-29.46 h-3.49c-4.76,0-8.66-3.9-8.66-8.66V8.66C7.5,3.9,11.39,0,16.15,0h61.22c4.76,0,8.66,3.9,8.66,8.66v76.1c0,4.76-3.9,8.66-8.66,8.66 h-3.4l18.83,29.04H80.45l-4.99-7.65H17.56L17.56,114.81z M62.97,67.66h10.48c1.14,0,2.07,0.93,2.07,2.07V80.2 c0,1.14-0.93,2.07-2.07,2.07H62.97c-1.14,0-2.07-0.93-2.07-2.07V69.72C60.9,68.59,61.83,67.66,62.97,67.66L62.97,67.66z M18.98,67.66h10.48c1.14,0,2.07,0.93,2.07,2.07V80.2c0,1.14-0.93,2.07-2.07,2.07H18.98c-1.14,0-2.07-0.93-2.07-2.07V69.72 C16.91,68.59,17.84,67.66,18.98,67.66L18.98,67.66z M25.1,16.7h42.81c4.6,0,8.36,3.76,8.36,8.37v13.17c0,4.6-3.76,8.36-8.36,8.36 H25.1c-4.6,0-8.36-3.76-8.36-8.36V25.07C16.74,20.47,20.5,16.7,25.1,16.7L25.1,16.7z M38.33,3.8h16.2C55.34,3.8,56,4.46,56,5.27 v6.38c0,0.81-0.66,1.47-1.47,1.47h-16.2c-0.81,0-1.47-0.66-1.47-1.47V5.27C36.85,4.46,37.51,3.8,38.33,3.8L38.33,3.8z"/></g></svg>
	                </div>

	                <div class="barcode">
	                    <div class="barcode__scan"></div>
	                    <div class="barcode__id">${data.pnr}</div>
	                </div>
	            </div>

	            <div class="ticket__side">
	                <div class="logo">
	                    <p>${selectedTrain.trainName}</p>
	                </div>

	                <div class="info side-arrive">
	                    <div class="info__item">Arrive</div>
	                    <div class="info__detail">Kolkata</div>
	                </div>

	                <div class="info side-depart">
	                    <div class="info__item">Depart</div>
	                    <div class="info__detail">Kashmir</div>
	                </div>

	                <div class="info side-date">
	                    <div class="info__item">Date</div>
	                    <div class="info__detail">${travelDate}</div>
	                </div>

	                <div class="info side-time">
	                    <div class="info__item">Time</div>
	                    <div class="info__detail">11:00AM</div>
	                </div>

	                <div class="barcode">
	                    <div class="barcode__scan"></div>
	                    <div class="barcode__id">${data.pnr}</div>
	                </div>
	            </div>
	        </div>
	    </div>
	`;

	// Replace the left panel with the ticket UI
	let rightPanel = document.querySelector(".right-panel");
	if (rightPanel) {
		rightPanel.outerHTML = ticketHTML; // Completely replace it
	}

	let confirmBookingBtn = document.getElementById("confirmBookingBtn");
	if (confirmBookingBtn) confirmBookingBtn.style.display = "none";

	// Hide the right panel after booking
	let leftPanel = document.querySelector(".left-panel");
	if (leftPanel) {
		leftPanel.style.display = "none";
	}
}

// Function to Attach Search Listener After the Ticket Bookings Page Loads
function attachPassengerSearchListener() {
	let passengerSearch = document.getElementById("passengerSearch");
	let resultsContainer = document.getElementById("passengerResults");

	if (!passengerSearch || !resultsContainer) {
		console.error("❌ Passenger search elements not found. Skipping listener attachment.");
		return;
	}

	passengerSearch.addEventListener("input", function() {
		let searchQuery = this.value.trim();

		if (searchQuery.length < 1) {
			resultsContainer.innerHTML = ""; // Clear results if no input
			return;
		}

		fetch(`searchPassenger?query=${searchQuery}`)
			.then(response => response.json())
			.then(data => {
				resultsContainer.innerHTML = ""; // Clear old suggestions

				if (data.length === 0) {
					resultsContainer.innerHTML = "<p>No matching passengers found.</p>";
					return;
				}

				data.forEach(passenger => {
					let div = document.createElement("div");
					div.classList.add("passenger-item");
					div.textContent = `${passenger.fullName} (${passenger.username})`;
					div.onclick = function() {
						passengerSearch.value = passenger.fullName;
						resultsContainer.innerHTML = ""; // Hide suggestions after selection
					};
					resultsContainer.appendChild(div);
				});
			})
			.catch(error => console.error("Error fetching passengers:", error));
	});
}

function loadAllBookings() {
	fetch("getAllBookings")
		.then(response => response.json())
		.then(data => {
			let bookingTable = document.getElementById("bookingTable");
			bookingTable.innerHTML = "";

			data.forEach(booking => {
				bookingTable.innerHTML += `
                    <tr>
                        <td>${booking.pnr}</td>
                        <td>${booking.passengerName}</td>
                        <td>${booking.trainNo}</td>
                        <td>${booking.travelDate}</td>
                        <td>${booking.trainClass}</td>
                        <td>${booking.seat}</td>
                        <td>${booking.status}</td>
                    </tr>`;
			});
		})
		.catch(error => console.error("Error loading bookings:", error));
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