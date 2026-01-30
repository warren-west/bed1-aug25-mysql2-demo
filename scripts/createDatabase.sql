DROP DATABASE IF EXISTS universitydb;
CREATE DATABASE universitydb;
USE universitydb;
CREATE TABLE students (
    studentId INTEGER PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL
);
INSERT INTO students (firstname, lastname) VALUES
('James', 'Smith'),('Mary', 'Johnson'),('Robert', 'Williams'),('Patricia', 'Brown'),
('John', 'Jones'),('Jennifer', 'Garcia'),('Michael', 'Miller'),('Linda', 'Davis'),
('William', 'Rodriguez'), ('Elizabeth', 'Martinez'), ('David', 'Hernandez'), ('Barbara', 'Lopez'),
('Richard', 'Gonzalez'), ('Susan', 'Wilson'), ('Joseph', 'Anderson'), ('Jessica', 'Thomas'),
('Thomas', 'Taylor'), ('Sarah', 'Moore'), ('Charles', 'Jackson'), ('Karen', 'Martin'),
('Christopher', 'Lee'), ('Nancy', 'Perez'), ('Daniel', 'Thompson'), ('Lisa', 'White'),
('Matthew', 'Harris'), ('Betty', 'Sanchez'), ('Anthony', 'Clark'), ('Margaret', 'Ramirez'),
('Mark', 'Lewis'), ('Sandra', 'Robinson'), ('Donald', 'Walker'), ('Ashley', 'Young'),
('Steven', 'Allen'), ('Kimberly', 'King'), ('Paul', 'Wright'), ('Donna', 'Scott'),
('Andrew', 'Torres'), ('Emily', 'Nguyen'), ('Joshua', 'Hill'), ('Michelle', 'Flores'),
('Kenneth', 'Green'), ('Dorothy', 'Adams'), ('Kevin', 'Nelson'), ('Carol', 'Baker'),
('Brian', 'Hall'), ('Amanda', 'Rivera'), ('George', 'Campbell'), ('Melissa', 'Mitchell'),
('Edward', 'Carter'), ('Deborah', 'Roberts');