package com.pms.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import com.pms.dao.BookingDAO;
import com.pms.model.Booking;

/**
 * Servlet implementation class GetLatestBookingsServlet
 */
@WebServlet("/getLatestBookings")
public class GetLatestBookingsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();

		List<Booking> bookings = BookingDAO.getLatestBookings(3); // Fetch latest 3 bookings

		StringBuilder json = new StringBuilder();
		json.append("[");
		for (int i = 0; i < bookings.size(); i++) {
			Booking b = bookings.get(i);
			json.append("{")
				.append("\"passengerName\":\"").append(b.getPassengerName()).append("\",")
				.append("\"travelDate\":\"").append(b.getTravelDate()).append("\",")
				.append("\"status\":\"").append(b.getStatus()).append("\"")
				.append("}");
			if (i < bookings.size() - 1) {
				json.append(",");
			}
		}
		json.append("]");

		out.write(json.toString());
	}
}

