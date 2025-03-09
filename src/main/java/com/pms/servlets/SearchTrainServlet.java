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

@WebServlet("/searchTrain")
public class SearchTrainServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		String origin = request.getParameter("origin");
		String destination = request.getParameter("destination");
		String trainClass = request.getParameter("trainClass");

		if (origin == null || destination == null) {
			response.getWriter().write("{\"error\": \"Invalid request parameters\"}");
			return;
		}

		List<TrainSchedule> trains = TrainScheduleDAO.searchTrains(origin, destination);
		StringBuilder json = new StringBuilder();
		json.append("{\"trains\":[");

		for (int i = 0; i < trains.size(); i++) {
			TrainSchedule train = trains.get(i);
			json.append("{");
			json.append("\"trainNo\":").append(train.getTrainNo()).append(",");
			json.append("\"trainName\":\"").append(train.getTrainName()).append("\",");
			json.append("\"departureTime\":\"").append(train.getDepartureTime()).append("\",");
			json.append("\"arrivalTime\":\"").append(train.getArrivalTime()).append("\",");
			json.append("\"route\":\"").append(train.getRoute()).append("\",");

			Map<String, Double> prices = train.getTicketPrices();
			if (prices != null && !prices.isEmpty()) {
				json.append("\"ticketPrices\":{");

				// ✅ Corrected ticketPrices JSON formatting
				int count = 0;
				for (Map.Entry<String, Double> entry : prices.entrySet()) {
					if (trainClass.isEmpty() || trainClass.equals(entry.getKey())) {
						if (count > 0)
							json.append(","); // ✅ Add comma only after first entry
						json.append("\"").append(entry.getKey()).append("\":").append(entry.getValue());
						count++;
					}
				}
				json.append("}");
			} else {
				json.append("\"ticketPrices\":\"No pricing available\"");
			}

			json.append("}");
			if (i < trains.size() - 1)
				json.append(","); // ✅ Avoid trailing comma in train list
		}

		json.append("]}");

		PrintWriter out = response.getWriter();
		out.print(json.toString());
		out.flush();
	}
}
