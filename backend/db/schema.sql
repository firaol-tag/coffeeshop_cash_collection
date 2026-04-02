-- Coffee Shop POS — MySQL schema (run once)

CREATE DATABASE IF NOT EXISTS coffee_shop_pos;
USE coffee_shop_pos;

-- 1. Departments
CREATE TABLE IF NOT EXISTS departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- 2. Users (Staff & Admin)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Staff') DEFAULT 'Staff',
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- 3. Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category ENUM('Food', 'Drink') NOT NULL,
    sub_category ENUM('Breakfast', 'Lunch', 'Snack', 'Hot', 'Cold') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_filename VARCHAR(255) NULL
);

-- 4. Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total_price DECIMAL(10, 2) NOT NULL,
    payment_type ENUM('Cash', 'Credit') NOT NULL,
    payment_status ENUM('Paid', 'Unpaid') DEFAULT 'Paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

-- 5. Booking Items
CREATE TABLE IF NOT EXISTS booking_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
