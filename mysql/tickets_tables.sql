CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    phone_number VARCHAR(15),
    type_of_user ENUM('regular', 'show_admin', 'admin') NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 500.0,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    address VARCHAR(100),
    parking_lot BOOLEAN,
    type_of_place ENUM('open', 'closed') NOT NULL,
    areas TEXT,
    bus_lines TEXT
);

CREATE TABLE Shows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    hours_start TIME NOT NULL,
    hours_finish TIME NOT NULL,
    place_id INT NOT NULL,
    manager_id INT NOT NULL,  
    prices TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    seats_count INT NOT NULL,
    poster_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES Places(id),
    FOREIGN KEY (manager_id) REFERENCES Users(id) 
);

CREATE TABLE Tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    show_id INT NOT NULL,
    user_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    status ENUM('sold', 'canceled', 'reserved') DEFAULT 'sold',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (show_id) REFERENCES Shows(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Password_Tokens (
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiration DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

