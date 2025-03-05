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

@WebServlet("/deletePassenger")
public class DeletePassengerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		String idParam = request.getParameter("id");
		if (idParam == null || idParam.isEmpty()) {
			response.getWriter().write("{\"status\":\"error\", \"message\":\"Missing or invalid ID\"}");
			return;
		}

		int passengerId = Integer.parseInt(idParam);

		try {
			// Load SQLite JDBC Driver
			Class.forName("org.sqlite.JDBC");
			String dbPath = "C:/Users/USER/eclipse-workspace/Passenger Managment System/pms.db"; // Use relative path
			Connection conn = DriverManager.getConnection("jdbc:sqlite:" + dbPath);

			if (conn == null) {
				response.getWriter().write("{\"status\":\"error\", \"message\":\"Database connection failed\"}");
				return;
			}

			// SQL Query to delete passenger
			String sql = "DELETE FROM passengers WHERE id=?";
			PreparedStatement stmt = conn.prepareStatement(sql);
			stmt.setInt(1, passengerId);

			// Execute delete
			int rowsDeleted = stmt.executeUpdate();
			stmt.close();
			conn.close();

			if (rowsDeleted > 0) {
				response.getWriter().write("{\"status\":\"success\"}");
			} else {
				response.getWriter().write("{\"status\":\"error\", \"message\":\"No matching record found\"}");
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.getWriter().write("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");
		}
	}
}
