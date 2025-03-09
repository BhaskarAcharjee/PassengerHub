package com.pms.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import com.pms.dao.TrainScheduleDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/getTrainData")
public class TrainDataServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        List<String> origins = TrainScheduleDAO.getAllOrigins();
        List<String> destinations = TrainScheduleDAO.getAllDestinations();

        StringBuilder json = new StringBuilder();
        json.append("{");

        // Append origins
        json.append("\"origins\":[");
        for (int i = 0; i < origins.size(); i++) {
            json.append("\"").append(origins.get(i)).append("\"");
            if (i < origins.size() - 1) json.append(",");
        }
        json.append("],");

        // Append destinations
        json.append("\"destinations\":[");
        for (int i = 0; i < destinations.size(); i++) {
            json.append("\"").append(destinations.get(i)).append("\"");
            if (i < destinations.size() - 1) json.append(",");
        }
        json.append("]");

        json.append("}");

        PrintWriter out = response.getWriter();
        out.print(json.toString());
        out.flush();
    }
}
