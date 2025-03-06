package com.pms.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import com.pms.models.TrainSchedule;

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
				TrainSchedule train = new TrainSchedule(rs.getInt("train_no"), rs.getString("train_name"),
						rs.getString("departure_time"), rs.getString("arrival_time"),
						rs.getString("origin") + " → " + rs.getString("destination"));
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
