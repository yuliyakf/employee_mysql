CREATE DATABASE employeedb;
USE employeedb;

CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL
);

CREATE TABLE positions (
    position_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    salary VARCHAR(50) NOT NULL,
    FOREIGN KEY (departments_id) REFERENCES departments(department_id)
);

CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (positions_id) REFERENCES positions(position_id),
    employees_id INT
);

