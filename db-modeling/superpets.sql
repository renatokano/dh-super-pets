CREATE SCHEMA IF NOT EXISTS `superpets` DEFAULT CHARACTER SET utf8;
USE `superpets`;

-- -----------------------------------------------------
-- Table `superpets`.`states`
-- -----------------------------------------------------
CREATE TABLE states (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL
);
    
/*
	-------------------
	states
	-------------------
	São Paulo
*/


-- -----------------------------------------------------
-- Table `superpets`.`cities`
-- -----------------------------------------------------
CREATE TABLE cities (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `state_id` INT NOT NULL,
  FOREIGN KEY (state_id) REFERENCES states(id)
);

/*
	-------------------
	cities
	-------------------
	São Paulo
*/


-- -----------------------------------------------------
-- Table `superpets`.`neighborhoods`
-- -----------------------------------------------------
CREATE TABLE neighborhoods (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `city_id` INT NOT NULL,
  FOREIGN KEY (city_id) REFERENCES cities(id)
);
  
/*
	-------------------
	neighborhoods
	-------------------
	Aclimação
    Itaim Bibi
    Moema
    Morumbi
    Pinheiros
    Pompeia
    Vila Madalena
    Vila Mariana
    Vila Olímpia
*/


-- -----------------------------------------------------
-- Table `superpets`.`clients`
-- -----------------------------------------------------
CREATE TABLE clients (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(190)  UNIQUE NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `zipcode` VARCHAR(9) NOT NULL,
  `address` VARCHAR(250) NOT NULL,
  `password` VARCHAR(250) NOT NULL,
  `about_me` VARCHAR(200),
  `photo` VARCHAR(200),
  `created_at` DATETIME,
  `updated_at` DATETIME,
  `neighborhood_id` INT NOT NULL,
  FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id)
  );

  
-- -----------------------------------------------------
-- Table `superpets`.`professionals`
-- -----------------------------------------------------
CREATE TABLE professionals (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(190)  UNIQUE NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `zipcode` VARCHAR(9) NOT NULL,
  `address` VARCHAR(250) NOT NULL,
  `password` VARCHAR(250) NOT NULL,
  `about_me` VARCHAR(200),
  `photo` VARCHAR(250),
  `created_at` DATETIME,
  `updated_at` DATETIME,
  `neighborhood_id` INT NOT NULL,
  FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id)
  );
  
  
-- -----------------------------------------------------
-- Table `superpets`.`services`
-- -----------------------------------------------------
CREATE TABLE services (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL
  );  


-- -----------------------------------------------------
-- Table `superpets`.`professional_services`
-- -----------------------------------------------------
CREATE TABLE professional_services (
  `professional_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `price` DECIMAL(6,2),
  `created_at` DATETIME,
  `updated_at` DATETIME,
  PRIMARY KEY (professional_id, service_id),
  FOREIGN KEY (professional_id) REFERENCES professionals(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
  );


-- -----------------------------------------------------
-- Table `superpets`.`available_slots`
-- -----------------------------------------------------
CREATE TABLE available_slots (
  `professional_id` INT NOT NULL,
  `start_time` DATETIME NOT NULL,
  `status` CHAR(1),
  `created_at` DATETIME,
  `updated_at` DATETIME,
  PRIMARY KEY (professional_id, start_time),
  FOREIGN KEY (professional_id) REFERENCES professionals(id)
  );


-- -----------------------------------------------------
-- Table `superpets`.`appointments`
-- -----------------------------------------------------
CREATE TABLE appointments (
  `client_id` INT NOT NULL,
  `professional_id` INT NOT NULL,
  `start_time` DATETIME NOT NULL,
  `status` CHAR(1),
  `price` DECIMAL(6,2),
  `service_id` INT NOT NULL,
  `created_at` DATETIME,
  `updated_at` DATETIME,
  PRIMARY KEY (client_id, professional_id, start_time),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (professional_id, start_time) REFERENCES available_slots(professional_id, start_time)
  );


-- -----------------------------------------------------
-- Table `superpets`.`client_ratings`
-- -----------------------------------------------------
CREATE TABLE client_ratings (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `rating` INT NOT NULL,  # RATING: [0-5]
  `client_id` INT NOT NULL,
  `professional_id` INT NOT NULL,
  `start_time` DATETIME NOT NULL,
  `created_at` DATETIME,
  `updated_at` DATETIME,
  FOREIGN KEY (client_id, professional_id, start_time) REFERENCES appointments(client_id, professional_id, start_time)
  );  


-- -----------------------------------------------------
-- Table `superpets`.`professional_ratings`
-- -----------------------------------------------------
CREATE TABLE professional_ratings (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `rating` INT NOT NULL,  # RATING: [0-5]
  `comment` TEXT,  # TEXT – 64KB (65,535 characters)
  `client_id` INT NOT NULL,
  `professional_id` INT NOT NULL,
  `start_time` DATETIME NOT NULL,
  `created_at` DATETIME,
  `updated_at` DATETIME,
  FOREIGN KEY (client_id, professional_id, start_time) REFERENCES appointments(client_id, professional_id, start_time)
  );  


-- -----------------------------------------------------
-- Table `superpets`.`pet_types`
-- -----------------------------------------------------
CREATE TABLE pet_types (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL
  );  
  
/*
	-------------------
	pet_types
	-------------------
	Cãozinho (0-10kg)
    Cãozinho (11-20kg)
    Cãozinho (21-40kg)
    Cãozinho (+41kg)
    Gatinho
*/


-- -----------------------------------------------------
-- Table `superpets`.`pets`
-- -----------------------------------------------------
CREATE TABLE pets (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `weight` DECIMAL(6,2),
  `client_id` INT NOT NULL,
  `pet_type_id` INT NOT NULL,
  `created_at` DATETIME,
  `updated_at` DATETIME,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (pet_type_id) REFERENCES pet_types(id)
  );
  

-- -----------------------------------------------------
-- Table `superpets`.`coverage_areas`
-- -----------------------------------------------------
CREATE TABLE coverage_areas (
  `professional_id` INT NOT NULL,
  `neighborhood_id` INT NOT NULL,
  `created_at` DATETIME,
  `updated_at` DATETIME,
  PRIMARY KEY (professional_id, neighborhood_id),
  FOREIGN KEY (professional_id) REFERENCES professionals(id),
  FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id)
  );


-- -----------------------------------------------------
-- Table `superpets`.`newsletter`
-- -----------------------------------------------------
CREATE TABLE newsletter (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(190) NOT NULL,
  `created_at` DATETIME
  );



############################################################### 
# DEFAULT VALUES
############################################################### 

# Populate states table
INSERT INTO states (name)
	VALUES ("São Paulo");

# Populate cities table
INSERT INTO cities (name, state_id) 
	VALUES ("São Paulo",
		(SELECT id FROM states WHERE name = 'São Paulo'));

# Populate neighborhoods table
INSERT INTO neighborhoods (name, city_id)
	VALUES
	("Aclimação", (SELECT id FROM cities WHERE name = 'São Paulo')),
    ("Itaim Bibi", (SELECT id FROM cities WHERE name = 'São Paulo')),
    ("Moema", (SELECT id FROM cities WHERE name = 'São Paulo')), 
    ("Morumbi", (SELECT id FROM cities WHERE name = 'São Paulo')),
    ("Pinheiros", (SELECT id FROM cities WHERE name = 'São Paulo')),
    ("Pompéia", (SELECT id FROM cities WHERE name = 'São Paulo')),
    ("Vila Madalena", (SELECT id FROM cities WHERE name = 'São Paulo')),
    ("Vila Mariana", (SELECT id FROM cities WHERE name = 'São Paulo')),
    ("Vila Olímpia", (SELECT id FROM cities WHERE name = 'São Paulo'));

# Populate pet_types table
INSERT INTO pet_types (name) 
	VALUES 
	("Cãozinho (0-10kg)"),
	("Cãozinho (11-20kg)"),
    ("Cãozinho (21-40kg)"),
    ("Cãozinho (+41kg)"),
    ("Gatinho");
        

# Populate services table
INSERT INTO services (name)
	VALUES
	("Adestramento"),
    ("Banho"),
    ("Pet Sitting"),
    ("Dog Walking"),
    ("Tosa");
        
-- ############################################################### 
-- #  DAY-TO-DAY BUSINESS OPERATIONS
-- ############################################################### 
-- ##### PROFESSIONALS VIEW #####
-- ###############################################################

-- # When a PROFESSIONAL want to create a new account
-- INSERT INTO professionals (name, email, mobile, zipcode, address, neighborhood_id, password, created_at, updated_at)
-- 	VALUES (
-- 		"Flavio Barbosa",
--         "flavio@digitalhouse.com",
--         "(11) 99999-1111",
--         "04548-000",
--         "Av. Dr. Cardoso de Melo, 100",
--         (SELECT id FROM neighborhoods WHERE name = "Vila Olímpia"),
--         "123456",
--         NOW(),
--         NOW()
--     ),(
-- 		"Alexandre Moura",
--         "alexandre@digitalhouse.com",
--         "(11) 99999-2222",
--         "04119-061",
--         "R. Afonso Celso, 1221 - Sala 62",
--         (SELECT id FROM neighborhoods WHERE name = "Vila Mariana"),
--         "123456",
--         NOW(),
--         NOW()
--     ),
--     (
-- 		"Reinaldo Azevedo",
--         "reinaldo@digitalhouse.com",
--         "(11) 99999-3333",
--         "05653-070",
--         "Praça Roberto Gomes Pedrosa, 1",
--         (SELECT id FROM neighborhoods WHERE name = "Morumbi"),
--         "123456",
--         NOW(),
--         NOW()
--     );

-- # When a PROFESSIONAL wants to select the services (s)he wants to offer
-- INSERT INTO professional_services (professional_id, service_id, price)
-- 	VALUES (
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),  # origin: professional account
--         (SELECT id FROM services WHERE name="Adestramento"),  # origin: form input
--         100
--     ),(
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         (SELECT id FROM services WHERE name="Banho"),
--         200
--     ),(
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         (SELECT id FROM services WHERE name="Dog Walking"),
--         300
--     ),(
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         (SELECT id FROM services WHERE name="Tosa"),
--         400
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         (SELECT id FROM services WHERE name="Adestramento"),
--         150
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         (SELECT id FROM services WHERE name="Pet Sitting"),
--         250
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         (SELECT id FROM services WHERE name="Banho"),
--         350
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         (SELECT id FROM services WHERE name="Dog Walking"),
--         450
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         (SELECT id FROM services WHERE name="Tosa"),
--         500
--     );

-- # When a PROFESSIONAL wants to select the coverage area
-- INSERT INTO coverage_areas (professional_id, neighborhood_id, created_at, updated_at)
-- 	VALUES (
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         (SELECT id FROM neighborhoods WHERE name="Vila Olímpia"),
--         NOW(),
--         NOW()
--     ),(
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         (SELECT id FROM neighborhoods WHERE name="Morumbi"),
--         NOW(),
--         NOW()
--     ),(
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         (SELECT id FROM neighborhoods WHERE name="Pinheiros"),
--         NOW(),
--         NOW()
--     ),(
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         (SELECT id FROM neighborhoods WHERE name="Vila Mariana"),
--         NOW(),
--         NOW()
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         (SELECT id FROM neighborhoods WHERE name="Morumbi"),
--         NOW(),
--         NOW()
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         (SELECT id FROM neighborhoods WHERE name="Aclimação"),
--         NOW(),
--         NOW()
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         (SELECT id FROM neighborhoods WHERE name="Vila Olímpia"),
--         NOW(),
--         NOW()
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         (SELECT id FROM neighborhoods WHERE name="Itaim Bibi"),
--         NOW(),
--         NOW()
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         (SELECT id FROM neighborhoods WHERE name="Moema"),
--         NOW(),
--         NOW()
--     );

-- # When a PROFESSIONAL wants to create a new slot to offer his/her service
-- INSERT INTO available_slots (professional_id, start_time)
-- 	VALUES (
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         '2020-05-08 08:00:00'
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         '2020-05-08 10:00:00'
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         '2020-05-08 12:00:00'
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         '2020-05-08 14:00:00'
--     ),(
-- 		(SELECT id FROM professionals WHERE email="reinaldo@digitalhouse.com"),
--         '2020-05-08 16:00:00'
-- 	),(
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         '2020-05-08 08:00:00'
--     ),(
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         '2020-05-08 10:00:00'
--     ),(
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         '2020-05-08 12:00:00'
--     ),(
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         '2020-05-08 14:00:00'
--     ),(
-- 		(SELECT id FROM professionals WHERE email="flavio@digitalhouse.com"),
--         '2020-05-08 16:00:00'
-- 	);


-- ############################################################### 
-- #  DAY-TO-DAY BUSINESS OPERATIONS
-- ############################################################### 
-- ##### CLIENTS VIEW #####
-- ###############################################################

-- # When a CLIENT want to create a new account
-- INSERT INTO clients (name, email, mobile, zipcode, address, neighborhood_id, password, created_at, updated_at)
-- 	VALUES (
-- 		"Mariana Ferreira",
--         "mariana@digitalhouse.com",
--         "(11) 99999-9999",
--         "04548-000",
--         "Av. Dr. Cardoso de Melo, 90",
--         (SELECT id FROM neighborhoods WHERE name = "Vila Olímpia"),
--         "123456",
--         NOW(),
--         NOW()
--     ),
--     (
-- 		"Melissa Hue",
--         "melissa@digitalhouse.com",
--         "(11) 99999-0000",
--         "04514-031",
--         "Av. Rouxinol, 214",
--         (SELECT id FROM neighborhoods WHERE name = "Moema"),
--         "123456",
--         NOW(),
--         NOW()
--     );    

-- # When a CLIENT want to register a new PET
-- INSERT INTO pets (client_id, pet_type_id, name, weight, created_at, updated_at) 
-- 	VALUES 
-- 		((SELECT id FROM clients WHERE email = "mariana@digitalhouse.com"), # origin: user account
--         (SELECT id FROM pet_types WHERE name = "Cãozinho (11-20kg)"), # origin: form input
--         "Mike",	# origin: form input
--         15.3,	# origin: form input
--         NOW(),
--         NOW()),
--         ((SELECT id FROM clients WHERE email = "melissa@digitalhouse.com"), 
--         (SELECT id FROM pet_types WHERE name = "Gatinho"), 
--         "Marrie",
--         5,
--         NOW(),
--         NOW());

-- # When a CLIENT wants to find all the professionals in São Paulo (city)
-- SELECT professionals.name, 
-- 	professionals.email, 
--     professionals.mobile, 
-- 	GROUP_CONCAT(neighborhoods.name) AS neighborhood, 
--     cities.name AS city
--     FROM professionals
-- 	INNER JOIN coverage_areas
--     ON professionals.id = coverage_areas.professional_id
--     INNER JOIN neighborhoods
--     ON coverage_areas.neighborhood_id = neighborhoods.id
--     INNER JOIN cities
--     ON cities.id = neighborhoods.city_id
--     WHERE cities.name = "São Paulo"
--     GROUP BY professionals.email;

-- # When a CLIENT wants to find all the professionals who offer a specific service
-- SELECT professionals.name, professionals.email, professionals.mobile, services.name, professional_services.price FROM professionals
-- 	INNER JOIN professional_services
-- 	ON professionals.id = professional_services.professional_id
-- 	INNER JOIN services
-- 	ON professional_services.service_id = services.id
--     WHERE services.name = 'Dog Walking';

-- # When a CLIENT wants to find only the professionals in a specific neighborhood 
-- # and that offers an specific service
-- SELECT professionals.name, 
-- 	professionals.email, 
--     professionals.mobile, 
-- 	neighborhoods.name AS neighborhood,
--     services.name
--     FROM professionals
-- 	INNER JOIN coverage_areas
--     ON professionals.id = coverage_areas.professional_id
--     INNER JOIN neighborhoods
--     ON coverage_areas.neighborhood_id = neighborhoods.id
--     INNER JOIN professional_services
--     ON professionals.id = professional_services.professional_id
--     INNER JOIN services
--     ON professional_services.service_id = services.id
--     WHERE neighborhoods.name = "Vila Olímpia" AND services.name = "Adestramento";


-- # When a CLIENT wants to view the available slots (times) of a specific professional
-- SELECT DATE(start_time) AS Date, TIME(start_time) AS StartTime, ADDTIME(TIME(start_time),'02:00:00') AS EndTime
-- 	FROM available_slots
--     WHERE professional_id = (SELECT id FROM professionals WHERE email = "flavio@digitalhouse.com");


-- # When a CLIENT wants to create a new appointment
-- INSERT INTO appointments (client_id, professional_id, start_time)
-- 	VALUES
-- 		(
-- 			(SELECT id FROM clients WHERE email = "mariana@digitalhouse.com"),
-- 			(SELECT professional_id FROM available_slots WHERE professional_id = 1 AND start_time = '2020-05-08 12:00:00'),
--             (SELECT start_time FROM available_slots WHERE professional_id = 1 AND start_time = '2020-05-08 12:00:00')
-- 		);
        
        
-- # When a CLIENT wants to view all his/her appointments
-- SELECT professionals.name, DATE(start_time) AS Date, TIME(start_time) AS StartTime, ADDTIME(TIME(start_time),'02:00:00') AS EndTime 
-- 	FROM appointments
--     INNER JOIN professionals
--     ON appointments.professional_id = professionals.id
--     WHERE client_id = (SELECT id FROM clients WHERE email = "mariana@digitalhouse.com");


-- # After a service, when a CLIENT wants to add a new comment and/or rating based on service offered
-- INSERT INTO professional_ratings (professional_id, client_id, comments, rating, created_at, updated_at) 
-- 	VALUES (
-- 		(SELECT professional_id FROM available_slots WHERE professional_id = 1 AND start_time = '2020-05-08 12:00:00'),
--         (SELECT id FROM clients WHERE email = "mariana@digitalhouse.com"),
-- 		"Gostei muito do serviço. Profissional muito atencioso. Recomendo o serviço do profissional.",
--         5,
--         NOW(),
--         NOW()
--     );
    
-- # When a other CLIENT want to view all professional comments
-- SELECT professionals.name, professional_ratings.comments FROM professional_ratings
-- 	INNER JOIN professionals
--     ON professional_ratings.professional_id = professionals.id
--     WHERE professionals.email = "flavio@digitalhouse.com";
    
-- # When a other CLIENT want to view the professional ratings
-- SELECT professionals.email, professionals.name, AVG(professional_ratings.rating) AS rating FROM professional_ratings
-- 	INNER JOIN professionals
--     ON professional_ratings.professional_id = professionals.id
--     WHERE professionals.email = "flavio@digitalhouse.com"
--     GROUP BY professionals.email;
    
    
    
    