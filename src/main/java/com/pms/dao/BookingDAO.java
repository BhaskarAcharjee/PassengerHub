package com.pms.dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import com.pms.model.Booking;

public class BookingDAO {
	private static final String DB_URL = "jdbc:sqlite:C:/Users/USER/eclipse-workspace/Passenger Managment System/pms.db";

	public static Connection connect() throws SQLException {
		return DriverManager.getConnection(DB_URL);
	}

	public static String generatePNR() {
		return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
	}

	public static boolean saveBooking(Booking booking) {
		String sql = "INSERT INTO bookings (pnr, passenger_id, passenger_name, train_no, train_name, travel_date, train_class, seat, status, price, seat_preference, food_preference, seat_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

		try (Connection conn = connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
			stmt.setString(1, booking.getPnr());
			stmt.setInt(2, booking.getPassengerId());
			stmt.setString(3, booking.getPassengerName());
			stmt.setString(4, booking.getTrainNo());
			stmt.setString(5, booking.getTrainName());
			stmt.setString(6, booking.getTravelDate());
			stmt.setString(7, booking.getTrainClass());
			stmt.setString(8, booking.getSeat());
			stmt.setString(9, booking.getStatus());
			stmt.setDouble(10, booking.getPrice());
			stmt.setString(11, booking.getSeatPreference());
			stmt.setString(12, booking.getFoodPreference());
			stmt.setString(13, booking.getSeatNumber());

			int rowsInserted = stmt.executeUpdate();
			System.out.println("Booking Inserted: " + (rowsInserted > 0));
			return rowsInserted > 0;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}

	public static List<Booking> getAllBookings() {
		List<Booking> bookings = new ArrayList<>();
		String sql = "SELECT * FROM bookings";

		try (Connection conn = connect();
				PreparedStatement stmt = conn.prepareStatement(sql);
				ResultSet rs = stmt.executeQuery()) {

			while (rs.next()) {
				Booking booking = new Booking();
				booking.setPnr(rs.getString("pnr"));
				booking.setPassengerId(rs.getInt("passenger_id"));
				booking.setPassengerName(rs.getString("passenger_name"));
				booking.setTrainNo(rs.getString("train_no"));
				booking.setTrainName(rs.getString("train_name"));
				booking.setTravelDate(rs.getString("travel_date"));
				booking.setTrainClass(rs.getString("train_class"));
				booking.setSeat(rs.getString("seat"));
				booking.setSeat(rs.getString("seat_number"));
				booking.setStatus(rs.getString("status"));
				booking.setPrice(rs.getDouble("price"));

				bookings.add(booking);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return bookings;
	}

	// Manually parse JSON string into a List<Booking> without using JSON libraries
	public static List<Booking> parseBookings(String jsonData) {
		List<Booking> bookings = new ArrayList<>();
		if (jsonData == null || jsonData.isEmpty()) {
			return bookings;
		}

		jsonData = jsonData.replace("[", "").replace("]", "").trim(); // Remove square brackets
		String[] bookingEntries = jsonData.split("\\},\\{"); // Split individual booking objects
		Random random = new Random();

		for (String entry : bookingEntries) {
			entry = entry.replace("{", "").replace("}", "").trim(); // Remove curly braces
			String[] keyValuePairs = entry.split(",");

			Booking booking = new Booking();
			for (String pair : keyValuePairs) {
				String[] keyValue = pair.split(":", 2);
				if (keyValue.length != 2)
					continue;

				String key = keyValue[0].trim().replace("\"", "");
				String value = keyValue[1].trim().replace("\"", "");

				switch (key) {
				case "passengerId":
					int passengerId = PassengerDAO.getPassengerId(value);
					booking.setPassengerId(passengerId);
					break;
				case "passengerName":
					booking.setPassengerName(value);
					break;
				case "trainNo":
					booking.setTrainNo(value);
					break;
				case "trainName":
					booking.setTrainName(value);
					break;
				case "travelDate":
					booking.setTravelDate(value);
					break;
				case "trainClass":
					booking.setTrainClass(value);
					break;
				case "seat":
					booking.setSeat(value);
					break;
				case "status":
					booking.setStatus(value);
					break;
				case "price":
					booking.setPrice(Double.parseDouble(value));
					break;
				case "seatPreference":
					booking.setSeatPreference(value);
					break;
				case "foodPreference":
					booking.setFoodPreference(value);
					break;
				}
			}

			// Generate a random seat number (1 to 100)
			booking.setSeatNumber("S-" + (random.nextInt(100) + 1));

			bookings.add(booking);
		}
		return bookings;
	}

	public static int getTotalBookingsCount() {
		String sql = "SELECT COUNT(DISTINCT pnr) AS totalBookings FROM bookings";
		int totalBookings = 0;

		try (Connection conn = connect();
				PreparedStatement stmt = conn.prepareStatement(sql);
				ResultSet rs = stmt.executeQuery()) {

			if (rs.next()) {
				totalBookings = rs.getInt("totalBookings");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return totalBookings;
	}

	public static List<Booking> getLatestBookings(int limit) {
		List<Booking> bookings = new ArrayList<>();
		String sql = "SELECT passenger_name, travel_date, status FROM bookings ORDER BY travel_date DESC LIMIT ?";

		try (Connection conn = connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {

			stmt.setInt(1, limit);
			ResultSet rs = stmt.executeQuery();

			while (rs.next()) {
				Booking booking = new Booking();
				booking.setPassengerName(rs.getString("passenger_name"));
				booking.setTravelDate(rs.getString("travel_date"));
				booking.setStatus(rs.getString("status"));
				bookings.add(booking);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return bookings;
	}

	public static Booking getBookingByPNR(String pnr) {
		String sql = "SELECT * FROM bookings WHERE pnr = ?";
		try (Connection conn = connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {

			stmt.setString(1, pnr);
			ResultSet rs = stmt.executeQuery();

			if (rs.next()) {
				System.out.println("Booking found for PNR: " + pnr);
				Booking booking = new Booking();
				booking.setPnr(rs.getString("pnr"));
				booking.setPassengerName(rs.getString("passenger_name"));
				booking.setTrainNo(rs.getString("train_no"));
				booking.setTrainName(rs.getString("train_name"));
				booking.setTravelDate(rs.getString("travel_date"));
				booking.setTrainClass(rs.getString("train_class"));
				booking.setSeatNumber(rs.getString("seat_number"));
				booking.setSeatPreference(rs.getString("seat_preference"));
				booking.setFoodPreference(rs.getString("food_preference"));
				booking.setStatus(rs.getString("status"));
				booking.setPrice(rs.getDouble("price"));

				return booking;
			} else {
				System.out.println("No booking found for PNR: " + pnr);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

//Delete Bookings
	public static boolean deleteBooking(String pnr) {
		String sql = "DELETE FROM bookings WHERE pnr = ?";

		try (Connection conn = connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {

			stmt.setString(1, pnr);
			return stmt.executeUpdate() > 0;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}

}
