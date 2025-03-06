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

@WebServlet("/getPassengers")
public class PassengerServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        List<Passenger> passengers = PassengerDAO.getAllPassengers();

        StringBuilder json = new StringBuilder();
        json.append("[");

        for (int i = 0; i < passengers.size(); i++) {
            Passenger passenger = passengers.get(i);

            json.append("{")
                .append("\"id\":").append(passenger.getId()).append(",")
                .append("\"username\":\"").append(passenger.getUsername()).append("\",")
                .append("\"fullName\":\"").append(passenger.getFullName()).append("\",")
                .append("\"age\":").append(passenger.getAge()).append(",")
                .append("\"dob\":\"").append(passenger.getDob()).append("\",")
                .append("\"gender\":\"").append(passenger.getGender()).append("\",")
                .append("\"address\":\"").append(passenger.getAddress()).append("\",")
                .append("\"contact\":\"").append(passenger.getContact()).append("\",")
                .append("\"idProof\":\"").append(passenger.getIdProof()).append("\"")
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
