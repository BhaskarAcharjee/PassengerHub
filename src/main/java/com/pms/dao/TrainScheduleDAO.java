package com.pms.dao;

import java.sql.*;
import java.util.*;
import com.pms.model.TrainSchedule;

public class TrainScheduleDAO {
	private static final String DB_URL = "jdbc:sqlite:C:/Users/USER/eclipse-workspace/Passenger Managment System/pms.db";

	public static List<TrainSchedule> getAllTrainSchedules() {
		List<TrainSchedule> trainList = new ArrayList<>();

		try {
			Class.forName("org.sqlite.JDBC");
			Connection conn = DriverManager.getConnection(DB_URL);
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery("SELECT * FROM train_schedule");

			while (rs.next()) {
				int trainNo = rs.getInt("train_no");
				String trainName = rs.getString("train_name");
				String departureTime = rs.getString("departure_time");
				String arrivalTime = rs.getString("arrival_time");
				String route = rs.getString("origin") + " → " + rs.getString("destination");

				Map<String, Double> ticketPrices = getTicketPricesForTrain(trainNo, conn);

				TrainSchedule train = new TrainSchedule(trainNo, trainName, departureTime, arrivalTime, route,
						ticketPrices);
				trainList.add(train);
			}

			rs.close();
			stmt.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return trainList;
	}

	// Train Count
	public static int getTrainCount() {
		int count = 0;
		try {
			Class.forName("org.sqlite.JDBC");
			Connection conn = DriverManager.getConnection(DB_URL);
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery("SELECT COUNT(*) AS total FROM train_schedule");

			if (rs.next()) {
				count = rs.getInt("total");
			}

			rs.close();
			stmt.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return count;
	}

	private static Map<String, Double> getTicketPricesForTrain(int trainNo, Connection conn) {
		Map<String, Double> prices = new HashMap<>();

		try {
			PreparedStatement stmt = conn
					.prepareStatement("SELECT class_type, price FROM train_ticket_prices WHERE train_no = ?");
			stmt.setInt(1, trainNo);
			ResultSet rs = stmt.executeQuery();

			while (rs.next()) {
				prices.put(rs.getString("class_type"), rs.getDouble("price"));
			}

			rs.close();
			stmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return prices;
	}

	// Get all unique origins
	public static List<String> getAllOrigins() {
		List<String> origins = new ArrayList<>();
		try {
			Connection conn = DriverManager.getConnection(DB_URL);
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery("SELECT DISTINCT origin FROM train_schedule");

			while (rs.next()) {
				origins.add(rs.getString("origin"));
			}

			rs.close();
			stmt.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return origins;
	}

	// Get all unique destinations
	public static List<String> getAllDestinations() {
		List<String> destinations = new ArrayList<>();
		try {
			Connection conn = DriverManager.getConnection(DB_URL);
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery("SELECT DISTINCT destination FROM train_schedule");

			while (rs.next()) {
				destinations.add(rs.getString("destination"));
			}

			rs.close();
			stmt.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return destinations;
	}

	// Get trains based on origin and destination
	public static List<TrainSchedule> searchTrains(String origin, String destination) {
		List<TrainSchedule> trainList = new ArrayList<>();
		try {
			Connection conn = DriverManager.getConnection(DB_URL);
			PreparedStatement stmt = conn
					.prepareStatement("SELECT * FROM train_schedule WHERE origin = ? AND destination = ?");
			stmt.setString(1, origin);
			stmt.setString(2, destination);
			ResultSet rs = stmt.executeQuery();

			while (rs.next()) {
				int trainNo = rs.getInt("train_no");
				String trainName = rs.getString("train_name");
				String departureTime = rs.getString("departure_time");
				String arrivalTime = rs.getString("arrival_time");

				// ✅ Fetch ticket prices for the train
				Map<String, Double> ticketPrices = getTicketPricesForTrain(trainNo, conn);

				TrainSchedule train = new TrainSchedule(trainNo, trainName, departureTime, arrivalTime,
						origin + " → " + destination, ticketPrices);
				trainList.add(train);
			}

			rs.close();
			stmt.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return trainList;
	}

}
