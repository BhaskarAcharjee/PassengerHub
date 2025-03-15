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
    private String seatPreference;
    private String foodPreference;
    private String seatNumber;
	
	public Booking() {
	}

	public Booking(String pnr, int passengerId, String passengerName, String trainNo, String trainName, String travelDate, String trainClass,
			String seat, String status, double price, String seatPreference, String foodPreference, String seatNumber) {
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
		this.seatPreference = seatPreference;
		this.foodPreference = foodPreference;
		this.seatNumber = seatNumber;
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
	
	public String getSeatPreference() {
		return seatPreference;
	}

	public void setSeatPreference(String seatPreference) {
		this.seatPreference = seatPreference;
	}

	public String getFoodPreference() {
		return foodPreference;
	}

	public void setFoodPreference(String foodPreference) {
		this.foodPreference = foodPreference;
	}

	public String getSeatNumber() {
		return seatNumber;
	}

	public void setSeatNumber(String seatNumber) {
		this.seatNumber = seatNumber;
	}

}
