# 🛤️ PassengerHub – Passenger Management System

**PassengerHub** is a web-based Passenger Management System developed using **Java (JSP/Servlets)** and **SQLite**. It provides a comprehensive interface for managing passengers, train schedules, and ticket bookings — complete with admin dashboard, booking workflows, and passenger search/filter features.

---

## 🚀 Features

### 🖥️ Admin Dashboard
- Displays key stats: 
  - Total Registered Passengers
  - Active Trains
  - Total Bookings
- Shows **recent bookings** in a table
- Includes a **PNR Checker** to quickly view booking details by PNR

### 👥 Passenger Management
- View, Add, Edit, Delete Passengers
- Search and filter passengers by username or full name
- Sort and manage data in a user-friendly table

### 🚆 Train Schedule Management
- Displays all available trains
- Shows origin, destination, arrival, and departure times

### 🎫 Ticket Booking System
- Step 1: Enter **origin**, **destination**, **travel class**, and **date**
- Step 2: View matching trains and class-wise prices
- Step 3: Click **Book** to select a train and fill booking details:
  - Search and select existing passenger
  - Choose **Seat Preference** and **Food Preference**
  - Confirm booking to:
    - Generate a unique **PNR**
    - Assign a **Seat Number**
    - Save all booking details in the database

---

## 📷 Screenshots

![Screenshot (756)](https://github.com/user-attachments/assets/ba9e2692-af27-441c-888a-c453719d7d7e)
Dashboard Page

![Screenshot (748)](https://github.com/user-attachments/assets/1d4bc859-8fa0-4a66-8acb-9cf4573fe2d7)
Passenger List Page

![Screenshot (751)](https://github.com/user-attachments/assets/7c14ebf5-bae2-4912-879e-e598704f2a26)
Add Passenger Modal

![Screenshot (752)](https://github.com/user-attachments/assets/d72b1455-8379-4003-8b83-48840aaddcc3)
Train Schedule Page

![Screenshot (753)](https://github.com/user-attachments/assets/52a39bea-1909-472c-a33c-4224ed079deb)
Booking Page

![Screenshot (754)](https://github.com/user-attachments/assets/ab22db50-8f70-49cc-b27f-b6830b2507d4)
Generated Ticket

![Screenshot (755)](https://github.com/user-attachments/assets/311acc2e-c15d-4758-9dd1-103662185164)
User Profile Page

---


## 🧩 Database Schema

PassengerHub uses **SQLite (pms.db)** with the following schema:

### `passengers`
| Column      | Type    | Description            |
|-------------|---------|------------------------|
| id          | INTEGER | Primary Key            |
| username    | TEXT    | Unique username        |
| fullName    | TEXT    | Full name              |
| age         | INTEGER | Age                    |
| dob         | TEXT    | Date of Birth          |
| gender      | TEXT    | Gender                 |
| address     | TEXT    | Address                |
| contact     | TEXT    | Contact Number         |
| idProof     | TEXT    | ID Proof Type/Number   |

### `bookings`
| Column            | Type    | Description                |
|-------------------|---------|----------------------------|
| pnr               | TEXT    | Primary Key (auto-generated) |
| passenger_id      | INTEGER | Foreign Key to `passengers` |
| passenger_name    | TEXT    | Redundant for easier queries |
| train_no          | TEXT    | Train Number                |
| train_name        | TEXT    | Train Name                  |
| travel_date       | TEXT    | Date of Journey             |
| train_class       | TEXT    | Selected Class              |
| seat              | TEXT    | Seat Category               |
| status            | TEXT    | Confirmed / Waiting         |
| price             | REAL    | Fare Amount                 |
| seat_preference   | TEXT    | Default: No Preference      |
| food_preference   | TEXT    | Default: No Preference      |
| seat_number       | TEXT    | Auto-assigned Seat Number   |

### `train_schedule`
| Column         | Type    | Description          |
|----------------|---------|----------------------|
| train_no       | INTEGER | Primary Key          |
| train_name     | TEXT    | Unique               |
| departure_time | TEXT    | Time of Departure    |
| arrival_time   | TEXT    | Time of Arrival      |
| origin         | TEXT    | Source Station       |
| destination    | TEXT    | Destination Station  |

### `train_ticket_prices`
| Column     | Type    | Description                     |
|------------|---------|---------------------------------|
| train_no   | INTEGER | Foreign Key to `train_schedule` |
| class_type | TEXT    | Class (e.g., Sleeper, AC)       |
| price      | REAL    | Price for that class            |

---

## 🛠️ Technologies Used

- Java (JSP & Servlets)
- HTML, CSS, JavaScript (Vanilla)
- SQLite for local database
- JDBC for DB interaction
- Apache Tomcat Server


---

## 📂 How to Run

1. Open the project in **Eclipse IDE** or any Java IDE with **Tomcat support**
2. Make sure SQLite database `pms.db` is placed in the project root
3. Set up Tomcat server and run the project
4. Navigate to `http://localhost:8080/PassengerHub` in your browser

---

## ✍️ Future Improvements

- User-side ticket booking with login
- PDF ticket generation
- Responsive UI with modern design
- Train tracking and delay updates

---

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo, make changes, and open a pull request.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
