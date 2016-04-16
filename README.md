# Shop-It

##Create a mysql user

###Run these in mysql shell
* create user 'shopit'@'localhost' identified by 'shopit';
* grant grant all privileges on * . * to 'shopit'@'localhost';
* flush privileges;

##Creating db
* Log in using ``mysql -u shopit -p``
* `` Password is : shopit``
* Add following tables

* ####Table Item
``CREATE TABLE `Item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `seller` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `seller` (`seller`),
  CONSTRAINT `Item_ibfk_1` FOREIGN KEY (`seller`) REFERENCES `User` (`id`)
)``

* ####Table User
``CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `contact_no` varchar(255) NOT NULL,
  `user_type` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
)``

* ####Table Cart
``CREATE TABLE `Cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buyer` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `buyer` (`buyer`),
  CONSTRAINT `Cart_ibfk_1` FOREIGN KEY (`buyer`) REFERENCES `User` (`id`)
)``

* ####Table CartItem
``CREATE TABLE `CartItem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item` int(11) NOT NULL,
  `cart` int(11) NOT NULL,
  `seller` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_item` (`item`,`cart`)
)``

* ####Table Order
``CREATE TABLE `Order` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`buyer` INT NOT NULL,
	`date` DATE NOT NULL,
	`address` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);``

* ####Table OrderItem
``CREATE TABLE `OrderItem` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`item` INT NOT NULL,
	`seller` INT NOT NULL,
	`order` INT NOT NULL,
	`status` INT NOT NULL,
	PRIMARY KEY (`id`)
);``

###To run the application
* ``npm install`` installes the node_modules
* ``PORT='<Port number>' nodejs server.js``
* Go to url ``localhost:<Port number>/catalogue``
