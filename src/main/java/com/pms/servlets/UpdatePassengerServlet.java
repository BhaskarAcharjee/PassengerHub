package com.pms.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import com.pms.dao.PassengerDAO;
import com.pms.model.Passenger;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/updatePassenger")
public class UpdatePassengerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		try {
			// Retrieve parameters from request
			int id = Integer.parseInt(request.getParameter("id"));
			String username = request.getParameter("username");
			String fullName = request.getParameter("fullName");
			int age = Integer.parseInt(request.getParameter("age"));
			String dob = request.getParameter("dob");
			String gender = request.getParameter("gender");
			String address = request.getParameter("address");
			String contact = request.getParameter("contact");
			String idProof = request.getParameter("idProof");

			// Create Passenger object
			Passenger updatedPassenger = new Passenger(id, username, fullName, age, dob, gender, address, contact, idProof);

			// Update passenger in database
			boolean success = PassengerDAO.updatePassenger(updatedPassenger);

			// Construct JSON response
			StringBuilder json = new StringBuilder();
			json.append("{");
			json.append("\"status\":\"").append(success ? "success" : "failure").append("\"");
			json.append("}");

			PrintWriter out = response.getWriter();
			out.print(json.toString());
			out.flush();

		} catch (Exception e) {
			e.printStackTrace();
			response.getWriter().write("{\"status\":\"error\", \"message\":\"Invalid input data.\"}");
		}
	}
}
