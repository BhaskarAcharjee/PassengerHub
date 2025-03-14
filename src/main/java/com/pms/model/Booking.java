package com.pms.model;

public class Booking {
	private String pnr;
	private int passengerId;
	private String trainNo;
	private String trainName;
	private String travelDate;
	private String trainClass;
	private String seat;
	private String status;
	private double price;

	public Booking(String pnr, int passengerId, String trainNo, String trainName, String travelDate, String trainClass,
			String seat, String status, double price) {
		this.pnr = pnr;
		this.passengerId = passengerId;
		this.trainNo = trainNo;
		this.trainName = trainName;
		this.travelDate = travelDate;
		this.trainClass = trainClass;
		this.seat = seat;
		this.status = status;
		this.price = price;
	}

	public String getPnr() {
		return pnr;
	}

	public int getPassengerId() {
		return passengerId;
	}

	public String getTrainNo() {
		return trainNo;
	}

	public String getTrainName() {
		return trainName;
	}

	public String getTravelDate() {
		return travelDate;
	}

	public String getTrainClass() {
		return trainClass;
	}

	public String getSeat() {
		return seat;
	}

	public String getStatus() {
		return status;
	}

	public double getPrice() {
		return price;
	}
}
