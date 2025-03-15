package com.pms.model;

public class Booking {
	private String pnr;
	private int passengerId;
	private String passengerName;
	private String trainNo;
	private String trainName;
	private String travelDate;
	private String trainClass;
	private String seat;
	private String status;
	private double price;
	
	public Booking() {
	}

	public Booking(String pnr, int passengerId, String passengerName, String trainNo, String trainName, String travelDate, String trainClass,
			String seat, String status, double price) {
		this.pnr = pnr;
		this.passengerId = passengerId;
		this.passengerName = passengerName;
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

	public void setPnr(String pnr) {
		this.pnr = pnr;
	}

	public int getPassengerId() {
		return passengerId;
	}

	public void setPassengerId(int passengerId) {
		this.passengerId = passengerId;
	}
	
	public String getPassengerName() {
		return passengerName;
	}

	public void setPassengerName(String passengerName) {
		this.passengerName = passengerName;
	}

	public String getTrainNo() {
		return trainNo;
	}

	public void setTrainNo(String trainNo) {
		this.trainNo = trainNo;
	}

	public String getTrainName() {
		return trainName;
	}

	public void setTrainName(String trainName) {
		this.trainName = trainName;
	}

	public String getTravelDate() {
		return travelDate;
	}

	public void setTravelDate(String travelDate) {
		this.travelDate = travelDate;
	}

	public String getTrainClass() {
		return trainClass;
	}

	public void setTrainClass(String trainClass) {
		this.trainClass = trainClass;
	}

	public String getSeat() {
		return seat;
	}

	public void setSeat(String seat) {
		this.seat = seat;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

}
