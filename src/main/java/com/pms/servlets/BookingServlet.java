package com.pms.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import com.pms.dao.BookingDAO;
import com.pms.model.Booking;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/bookTicket")
public class BookingServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        int passengerId = Integer.parseInt(request.getParameter("passengerId"));
        String passengerName = request.getParameter("passengerName");
        String trainNo = request.getParameter("trainNo");
        String trainName = request.getParameter("trainName");
        String travelDate = request.getParameter("travelDate");
        String trainClass = request.getParameter("trainClass");
        String seat = request.getParameter("seat");
        String status = request.getParameter("status");
        double price = Double.parseDouble(request.getParameter("price"));

        String pnr = BookingDAO.generatePNR();
        Booking booking = new Booking(pnr, passengerId, passengerName, trainNo, trainName, travelDate, trainClass, seat, status, price);

        boolean success = BookingDAO.saveBooking(booking);

        PrintWriter out = response.getWriter();
        if (success) {
            out.print("{ \"pnr\": \"" + pnr + "\", \"status\": \"success\" }");
        } else {
            out.print("{ \"status\": \"error\" }");
        }
        out.flush();
    }
}
