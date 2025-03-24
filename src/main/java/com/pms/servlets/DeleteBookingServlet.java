package com.pms.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

import com.pms.dao.BookingDAO;
import com.pms.dao.PassengerDAO;

/**
 * Servlet implementation class DeleteBookingServlet
 */
@WebServlet("/deleteBooking")
public class DeleteBookingServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		// Get the passenger ID from request
		String pnr = request.getParameter("pnr");

		// Delete passenger from the database
		boolean success = BookingDAO.deleteBooking(pnr);

		// Construct JSON response
		StringBuilder json = new StringBuilder();
		json.append("{");
		json.append("\"status\":\"").append(success ? "success" : "failure").append("\"");
		json.append("}");

		PrintWriter out = response.getWriter();
		out.print(json.toString());
		out.flush();
	}
}
