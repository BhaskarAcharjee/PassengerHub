package com.pms.model;

public class Passenger {
	private int id;
	private String username;
	private String fullName;
	private int age;
	private String dob;
	private String gender;
	private String address;
	private String contact;
	private String idProof;

	// Constructors
	public Passenger() {
	} // Default Constructor

	public Passenger(int id, String username, String fullName, int age, String dob, String gender, String address,
			String contact, String idProof) {
		this.id = id;
		this.username = username;
		this.fullName = fullName;
		this.age = age;
		this.dob = dob;
		this.gender = gender;
		this.address = address;
		this.contact = contact;
		this.idProof = idProof;
	}

	// Getters and Setters
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getDob() {
		return dob;
	}

	public void setDob(String dob) {
		this.dob = dob;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getIdProof() {
		return idProof;
	}

	public void setIdProof(String idProof) {
		this.idProof = idProof;
	}
}
