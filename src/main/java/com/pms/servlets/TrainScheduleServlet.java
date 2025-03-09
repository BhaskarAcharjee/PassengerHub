package com.pms.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import com.pms.dao.TrainScheduleDAO;
import com.pms.model.TrainSchedule;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/getTrainSchedule")
public class TrainScheduleServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		List<TrainSchedule> trainList = TrainScheduleDAO.getAllTrainSchedules();

		StringBuilder json = new StringBuilder();
		json.append("[");

		for (int i = 0; i < trainList.size(); i++) {
			TrainSchedule train = trainList.get(i);

			json.append("{").append("\"trainNo\":").append(train.getTrainNo()).append(",").append("\"trainName\":\"")
					.append(train.getTrainName()).append("\",").append("\"departureTime\":\"")
					.append(train.getDepartureTime()).append("\",").append("\"arrivalTime\":\"")
					.append(train.getArrivalTime()).append("\",").append("\"route\":\"").append(train.getRoute())
					.append("\",");

			// Ticket prices
			json.append("\"ticketPrices\":{");
			Map<String, Double> prices = train.getTicketPrices();
			int j = 0;
			for (Map.Entry<String, Double> entry : prices.entrySet()) {
				json.append("\"").append(entry.getKey()).append("\":").append(entry.getValue());
				if (j < prices.size() - 1)
					json.append(",");
				j++;
			}
			json.append("}");

			json.append("}");

			if (i < trainList.size() - 1) {
				json.append(",");
			}
		}

		json.append("]");

		PrintWriter out = response.getWriter();
		out.print(json.toString());
		out.flush();
	}
}
