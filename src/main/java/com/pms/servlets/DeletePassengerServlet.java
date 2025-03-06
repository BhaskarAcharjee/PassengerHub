package com.pms.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import com.pms.dao.PassengerDAO;

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

		// Get the passenger ID from request
		int id = Integer.parseInt(request.getParameter("id"));

		// Delete passenger from the database
		boolean success = PassengerDAO.deletePassenger(id);

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
