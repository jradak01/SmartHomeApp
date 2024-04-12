--CREATE DATABASE SmartHome;

/*real estate table*/
CREATE TABLE RealEstate (
	ID_RealEstate INT IDENTITY PRIMARY KEY,
	Address VARCHAR(50) NOT NULL,
	Town VARCHAR(50) NOT NULL,
	Phone VARCHAR(20) NOT NULL
);

/*user table*/
CREATE TABLE House_User (
	ID_User INT IDENTITY PRIMARY KEY,
	Name VARCHAR(50) NOT NULL,
	Surname VARCHAR(50) NOT NULL,
	Sex CHAR(1) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	Password VARCHAR(50) NOT NULL,
	HouseEntry VARCHAR(50) NOT NULL,
	Phone VARCHAR(20) NOT NULL,
	ID_RealEstate INT NOT NULL,
	FOREIGN KEY (ID_RealEstate) REFERENCES RealEstate (ID_RealEstate)
);

/*room table*/
CREATE TABLE Room (
	ID_Room INT IDENTITY PRIMARY KEY,
	Name VARCHAR(20) NOT NULL,
	Surface INT NOT NULL,	
	ID_RealEstate INT NOT NULL,
	FOREIGN KEY (ID_RealEstate) REFERENCES RealEstate (ID_RealEstate)
);

/*category table*/
CREATE TABLE Category (
	ID_Category INT IDENTITY PRIMARY KEY,
	Category_name VARCHAR(50) NOT NULL
);

/*type table*/
CREATE TABLE Device_Type (
	ID_Type INT IDENTITY PRIMARY KEY,
	Name VARCHAR(50) NOT NULL,	
	ID_Category INT NOT NULL,
	FOREIGN KEY (ID_Category) REFERENCES Category (ID_Category)
);

/*device table*/
CREATE TABLE Device (
	ID_Device INT IDENTITY PRIMARY KEY,
	Name VARCHAR(50) NOT NULL,
	ID_Type INT NOT NULL,	
	ID_Room INT NOT NULL,
	FOREIGN KEY (ID_Type) REFERENCES Device_Type (ID_Type),
	FOREIGN KEY (ID_Room) REFERENCES Room (ID_Room),
);

/*settings table*/
CREATE TABLE Settings (
	ID_Settings INT IDENTITY PRIMARY KEY,
	Name VARCHAR(50) NOT NULL,
	Settings_value VARCHAR(50) NOT NULL,
	ID_Device INT NOT NULL,
	FOREIGN KEY (ID_Device) REFERENCES Device (ID_Device)
);

/*log table*/

CREATE TABLE RealEstate_LOG (
    ID_Change INT IDENTITY PRIMARY KEY,
    ID_RealEstate INT NOT NULL,
    ID_Device INT,
    Content VARCHAR(50) NOT NULL,
    Updated_at DATETIME NOT NULL,
    Content_type char(5)
);