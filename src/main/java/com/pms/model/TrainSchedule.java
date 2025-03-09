package com.pms.model;

import java.util.Map;

public class TrainSchedule {
	private int trainNo;
	private String trainName;
	private String departureTime;
	private String arrivalTime;
	private String route;
	private Map<String, Double> ticketPrices; // Ticket prices for different classes

	public TrainSchedule(int trainNo, String trainName, String departureTime, String arrivalTime, String route,
			Map<String, Double> ticketPrices) {
		this.trainNo = trainNo;
		this.trainName = trainName;
		this.departureTime = departureTime;
		this.arrivalTime = arrivalTime;
		this.route = route;
		this.ticketPrices = ticketPrices;
	}

	public int getTrainNo() {
		return trainNo;
	}

	public String getTrainName() {
		return trainName;
	}

	public String getDepartureTime() {
		return departureTime;
	}

	public String getArrivalTime() {
		return arrivalTime;
	}

	public String getRoute() {
		return route;
	}

	public Map<String, Double> getTicketPrices() {
		return ticketPrices;
	}
}
