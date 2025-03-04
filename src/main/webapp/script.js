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




