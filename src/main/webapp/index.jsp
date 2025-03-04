<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Boxicons -->
<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'
	rel='stylesheet'>

<!-- My CSS -->
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="style1.css">

<title>Passenger Management</title>
</head>
<body>
	<!-- 	SIDEBAR -->
	<section id="sidebar">
		<a href="#" class="brand"> <i class='bx bxs-bus bx-lg'></i> <span
			class="text">PassengerHub</span>
		</a>
		<ul class="side-menu top">
			<li class="active"><a href="#" data-page="dashboard.html"> <i
					class='bx bxs-dashboard bx-sm'></i> <span class="text">Dashboard</span>
			</a></li>
			<li><a href="#" data-page="passenger-list.html"> <i
					class='bx bxs-user-check bx-sm'></i> <span class="text">Passenger
						List</span>
			</a></li>
			<li><a href="#" data-page="train-schedule.html"> <i
					class='bx bxs-bus bx-sm'></i> <span class="text">Train
						Schedule</span>
			</a></li>
			<li><a href="#" data-page="ticket-bookings.html"> <i
					class='bx bxs-coupon bx-sm'></i> <span class="text">Ticket
						Bookings</span>
			</a></li>
			<li><a href="#" data-page="profile.html"> <i
					class='bx bxs-user-detail bx-sm'></i> <span class="text">My
						Profile</span>
			</a></li>
		</ul>

		<ul class="side-menu bottom">
			<!-- <li><a href="#"> <i class='bx bxs-cog bx-sm bx-spin-hover'></i>
					<span class="text">Settings</span>
			</a></li> -->
			<li><a href="#" class="logout"> <i
					class='bx bx-power-off bx-sm bx-burst-hover'></i> <span
					class="text">Logout</span>
			</a></li>
		</ul>
	</section>

	<!-- SIDEBAR CONTENT -->
	<section id="content">
		<!-- NAVBAR -->
		<nav>
			<!-- 	<i class='bx bx-menu bx-sm'></i> <a href="#" class="nav-link">Categories</a> -->
			<form action="#">
				<!-- <div class="form-input">
					<input type="search" placeholder="Search...">
					<button type="submit" class="search-btn">
						<i class='bx bx-search'></i>
					</button>
				</div> -->
			</form>

			<input type="checkbox" class="checkbox" id="switch-mode" hidden /> <label
				class="swith-lm" for="switch-mode"> <i class="bx bxs-moon"></i>
				<i class="bx bx-sun"></i>
				<div class="ball"></div>
			</label>
			<!-- 		Notification Bell  -->
			<!-- <a href="#" class="notification" id="notificationIcon"> <i
				class='bx bxs-bell bx-tada-hover'></i> <span class="num">5</span>
			</a>
			<div class="notification-menu" id="notificationMenu">
				<ul>
					<li>New ticket booked</li>
					<li>Train schedule updated</li>
					<li>Driver assigned to Route 12</li>
					<li>New passenger registration</li>
					<li>Pending payment confirmations</li>
				</ul>
			</div> -->

			<!-- 	Profile Menu  -->
			<div class="profile" id="profileIcon"> <img
				src="https://placehold.co/600x400/png" alt="Profile">
			</div>
		</nav>
		<!-- 		NAVBAR MAIN -->
		<main id="main-content">
			<!-- Dynamic Content -->
		</main>
		<!-- MAIN -->
	</section>
	<!-- CONTENT -->

	<script src="script.js"></script>
</body>
</html>