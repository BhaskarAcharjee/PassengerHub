package com.pms.servlets;

import java.io.*;
import java.util.List;
import com.pms.dao.BookingDAO;
import com.pms.model.Booking;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/confirmBooking")
public class ConfirmBookingServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		PrintWriter out = response.getWriter();
		String jsonResponse;

		try {
			StringBuilder requestData = new StringBuilder();
			String line;
			while ((line = request.getReader().readLine()) != null) {
				requestData.append(line);
			}

			List<Booking> bookings = BookingDAO.parseBookings(requestData.toString());
			if (bookings == null || bookings.isEmpty()) {
				jsonResponse = "{\"success\": false, \"message\": \"No passengers selected.\"}";
				out.write(jsonResponse);
				return;
			}

			String pnr = BookingDAO.generatePNR();
			boolean allSaved = true;
			for (Booking booking : bookings) {
				booking.setPnr(pnr);
				if (!BookingDAO.saveBooking(booking)) {
					allSaved = false;
					break;
				}
			}

			jsonResponse = allSaved ? "{\"success\": true, \"pnr\": \"" + pnr + "\"}"
					: "{\"success\": false, \"message\": \"Failed to save booking.\"}";
		} catch (Exception e) {
			e.printStackTrace();
			jsonResponse = "{\"success\": false, \"message\": \"Server error.\"}";
		}

		out.write(jsonResponse);
	}
}
