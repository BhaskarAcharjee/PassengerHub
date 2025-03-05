package com.pms.servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/addPassenger")
public class AddPassengerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		request.setCharacterEncoding("UTF-8"); // Ensure form data is properly read

		// Retrieve parameters safely
		String username = request.getParameter("username");
		String fullName = request.getParameter("fullName");
		String ageStr = request.getParameter("age");
		String dob = request.getParameter("dob");
		String gender = request.getParameter("gender");
		String address = request.getParameter("address");
		String contact = request.getParameter("contact");
		String idProof = request.getParameter("idProof");

		if (username == null || fullName == null || ageStr == null || dob == null || gender == null || address == null
				|| contact == null || idProof == null) {
			response.getWriter().write("{\"status\":\"error\", \"message\":\"Missing parameters\"}");
			return;
		}

		try {
			int age = Integer.parseInt(ageStr); // Convert safely

			// Connect to SQLite
			Class.forName("org.sqlite.JDBC");
			String dbPath = "C:/Users/USER/eclipse-workspace/Passenger Managment System/pms.db";
			Connection conn = DriverManager.getConnection("jdbc:sqlite:" + dbPath);

			if (conn == null) {
				response.getWriter().write("{\"status\":\"error\", \"message\":\"Database connection failed\"}");
				return;
			}

			// Insert query
			String sql = "INSERT INTO passengers (username, fullName, age, dob, gender, address, contact, idProof) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
			PreparedStatement stmt = conn.prepareStatement(sql);
			stmt.setString(1, username);
			stmt.setString(2, fullName);
			stmt.setInt(3, age);
			stmt.setString(4, dob);
			stmt.setString(5, gender);
			stmt.setString(6, address);
			stmt.setString(7, contact);
			stmt.setString(8, idProof);

			// Execute update
			int rowsInserted = stmt.executeUpdate();
			stmt.close();
			conn.close();

			// Send response
			if (rowsInserted > 0) {
				response.getWriter().write("{\"status\":\"success\"}");
			} else {
				response.getWriter().write("{\"status\":\"error\", \"message\":\"Insertion failed\"}");
			}

		} catch (Exception e) {
			e.printStackTrace();
			response.getWriter().write("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");
		}
	}

}
