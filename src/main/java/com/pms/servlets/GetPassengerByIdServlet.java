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

@WebServlet("/getPassengerById")
public class GetPassengerByIdServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            int id = Integer.parseInt(request.getParameter("id"));
            Passenger passenger = PassengerDAO.getPassengerById(id);

            PrintWriter out = response.getWriter();
            if (passenger != null) {
                // JSON response for passenger
                out.print("{"
                        + "\"id\":" + passenger.getId() + ","
                        + "\"username\":\"" + passenger.getUsername() + "\","
                        + "\"fullName\":\"" + passenger.getFullName() + "\","
                        + "\"age\":" + passenger.getAge() + ","
                        + "\"dob\":\"" + passenger.getDob() + "\","
                        + "\"gender\":\"" + passenger.getGender() + "\","
                        + "\"address\":\"" + passenger.getAddress() + "\","
                        + "\"contact\":\"" + passenger.getContact() + "\","
                        + "\"idProof\":\"" + passenger.getIdProof() + "\""
                        + "}");
            } else {
                out.print("{\"status\":\"error\", \"message\":\"Passenger not found.\"}");
            }
            out.flush();

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("{\"status\":\"error\", \"message\":\"Invalid request.\"}");
        }
    }
}
