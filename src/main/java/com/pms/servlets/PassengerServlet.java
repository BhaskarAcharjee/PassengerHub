package com.pms.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

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
        
        PrintWriter out = response.getWriter();
        String jsonData = "[";

        try {
            // Load SQLite JDBC Driver
            Class.forName("org.sqlite.JDBC");
			/* Connection conn = DriverManager.getConnection("jdbc:sqlite:pms.db"); */
            String dbPath = "C:/Users/USER/eclipse-workspace/Passenger Managment System/pms.db";  // Update this path
            Connection conn = DriverManager.getConnection("jdbc:sqlite:" + dbPath);

            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM passengers");

            while (rs.next()) {
                jsonData += "{";
                jsonData += "\"id\":" + rs.getInt("id") + ",";
                jsonData += "\"username\":\"" + rs.getString("username") + "\",";
                jsonData += "\"fullName\":\"" + rs.getString("fullName") + "\",";
                jsonData += "\"age\":" + rs.getInt("age") + ",";
                jsonData += "\"dob\":\"" + rs.getString("dob") + "\",";
                jsonData += "\"gender\":\"" + rs.getString("gender") + "\",";
                jsonData += "\"address\":\"" + rs.getString("address") + "\",";
                jsonData += "\"contact\":\"" + rs.getString("contact") + "\",";
                jsonData += "\"idProof\":\"" + rs.getString("idProof") + "\"";
                jsonData += "},";
            }

            if (jsonData.endsWith(",")) {
                jsonData = jsonData.substring(0, jsonData.length() - 1);
            }
            jsonData += "]";

            rs.close();
            stmt.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
            jsonData = "[]"; // Return empty JSON if error
        }

        out.print(jsonData);
        out.flush();
    }
}
