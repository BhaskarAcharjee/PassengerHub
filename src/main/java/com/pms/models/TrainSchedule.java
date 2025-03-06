package com.pms.models;

public class TrainSchedule {
	private int trainNo;
	private String trainName;
	private String departureTime;
	private String arrivalTime;
	private String route;

	public TrainSchedule(int trainNo, String trainName, String departureTime, String arrivalTime, String route) {
		this.trainNo = trainNo;
		this.trainName = trainName;
		this.departureTime = departureTime;
		this.arrivalTime = arrivalTime;
		this.route = route;
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
}
