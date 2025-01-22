-- Create the database
CREATE DATABASE repairing_centre;
USE repairing_centre;
-- Create the STORE table
CREATE TABLE STORE (
    Sid INT PRIMARY KEY NOT NULL,
    Total_Appliances INT
);
-- Create the CENTRE table
CREATE TABLE CENTRE (
    Cid INT PRIMARY KEY
);
-- Create the CLIENT table
CREATE TABLE CLIENT (
    Cid int,
    Name VARCHAR(100),
    Address VARCHAR(255),
    Contact_No VARCHAR(11) primary key,
constraint FKc_Cid foreign key (Cid) references Centre (Cid)
);
-- Create the APPLIANCE table
CREATE TABLE APPLIANCE (
    serial_No INT PRIMARY KEY,
    Type VARCHAR(50),
    CompanyName varchar(100),
    DateOfArrival DATE,
    Sid INT,
    Cid INT,
    Contact_No VARCHAR(11),
    CONSTRAINT FK_Sid FOREIGN KEY (Sid) REFERENCES STORE(Sid),
    CONSTRAINT FK_Cid FOREIGN KEY (Cid) REFERENCES centre(Cid),
    CONSTRAINT FK_Contact_No FOREIGN KEY (Contact_No) REFERENCES CLIENT(Contact_No)
);
-- Create the FEEDBACK table
CREATE TABLE FEEDBACK (
    Fid INT PRIMARY KEY,
    clientName VARCHAR(100),
    Cid INT,
    CONSTRAINT FK_Feedback_Cid FOREIGN KEY (Cid) REFERENCES CENTRE(Cid)
);
create table fed_cen(
Fid int,
Cid int,
constraint FK_fed_cen_Cid foreign key (Cid) references Centre (Cid),
constraint FK_fed_cen_Fid foreign key (Fid) references Feedback (Fid)
);
-- Create the RECEIPT table
CREATE TABLE RECEIPT (
    Contact_No VARCHAR(11),
    ClientName VARCHAR(100),
    R_No int primary key,
    Cid INT,
    CONSTRAINT FK_Receipt_Cid FOREIGN KEY (Cid) REFERENCES CLIENT(Cid),
	CONSTRAINT FK_Receipt_Contact_No FOREIGN KEY (Contact_No) REFERENCES CLIENT(Contact_No)
);

-- Create the DELIVERY table
CREATE TABLE DELIVERY (
    Did INT PRIMARY KEY,
    Contact_No VARCHAR(11),
    CONSTRAINT FK_Delivery_Contact_No FOREIGN KEY (Contact_No) REFERENCES CLIENT(Contact_No)
);

-- Create the DEL_CEN table
CREATE TABLE DEL_CEN (
    Cid INT,
    Did INT,
    CONSTRAINT FK_DEL_CEN_Cid FOREIGN KEY (Cid) REFERENCES CENTRE(Cid),
    CONSTRAINT FK_DEL_CEN_Did FOREIGN KEY (Did) REFERENCES DELIVERY(Did)
);

CALL AddApplianceAndClient(
    000420, "samsung", "washing machne",'2025-01-18',1, 1,"Test007",032114455, "canal"
);
select * from client;
select * from store;
select * from appliance;
describe appliance;
	Select s.Sid as Store_Number,a.serial_No,a.Type,a.companyName,a.dateOfArrival,c.contact_No,c.Name,c.address
	from store as s
	join appliance as a on s.Sid=a.Sid
	join client as c on c.contact_No=a.contact_No
	having Sid=1;

