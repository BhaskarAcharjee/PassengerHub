package com.pms.dao;

import java.sql.*;
import java.util.UUID;
import com.pms.model.Booking;

public class BookingDAO {
	private static final String DB_URL = "jdbc:sqlite:C:/Users/USER/eclipse-workspace/Passenger Managment System/pms.db";

	public static Connection connect() throws SQLException {
		return DriverManager.getConnection(DB_URL);
	}

	public static String generatePNR() {
		return "PNR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
	}

	public static boolean saveBooking(Booking booking) {
		String sql = "INSERT INTO bookings (pnr, passenger_id, train_no, train_name, travel_date, train_class, seat, status, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

		try (Connection conn = connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
			stmt.setString(1, booking.getPnr());
			stmt.setInt(2, booking.getPassengerId());
			stmt.setString(3, booking.getTrainNo());
			stmt.setString(4, booking.getTrainName());
			stmt.setString(5, booking.getTravelDate());
			stmt.setString(6, booking.getTrainClass());
			stmt.setString(7, booking.getSeat());
			stmt.setString(8, booking.getStatus());
			stmt.setDouble(9, booking.getPrice());

			return stmt.executeUpdate() > 0;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}
}
