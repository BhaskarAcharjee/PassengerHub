package com.pms.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import com.pms.dao.PassengerDAO;
import com.pms.model.Passenger;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/searchPassenger")
public class PassengerSearchServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String searchQuery = request.getParameter("query");
        List<Passenger> passengers = PassengerDAO.searchPassengers(searchQuery);

        StringBuilder json = new StringBuilder();
        json.append("[");

        for (int i = 0; i < passengers.size(); i++) {
            Passenger passenger = passengers.get(i);

            json.append("{")
                .append("\"id\":").append(passenger.getId()).append(",")
                .append("\"username\":\"").append(passenger.getUsername()).append("\",")
                .append("\"fullName\":\"").append(passenger.getFullName()).append("\"")
                .append("}");

            if (i < passengers.size() - 1) {
                json.append(",");
            }
        }

        json.append("]");

        PrintWriter out = response.getWriter();
        out.print(json.toString());
        out.flush();
    }
}
