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
	`id` INT NOT NULL AUTO_INCREMENT,
	`description` VARCHAR(255) NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`photo` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);``

* ####Table User
``CREATE TABLE `User` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255) NOT NULL UNIQUE,
	`password` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`first_name` VARCHAR(255) NOT NULL,
	`last_name` VARCHAR(255) NOT NULL,
	`address` VARCHAR(255) NOT NULL,
	`contact_no` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);``

* ####Table CartItem
``CREATE TABLE `CartItem` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`item` INT NOT NULL,
	`cart` INT NOT NULL,
	`seller` INT NOT NULL,
	PRIMARY KEY (`id`)
);``

* ####Table Cart
``CREATE TABLE `Cart` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`buyer` INT NOT NULL,
	PRIMARY KEY (`id`)
);``

* ####Table SellerItem
``
CREATE TABLE `SellerItem` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`item` INT NOT NULL,
	`price` INT NOT NULL,
	`seller` INT NOT NULL,
	`quantity` INT NOT NULL,
	PRIMARY KEY (`id`)
);``

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

* ####Foreign Key Constraints
* In table Cart, buyer refers User.id
* In table CartItem, item refers Item.id, seller refers User.id, cart refers Cart.id
* In table SellerItem, item refers Item.id, seller refers User.id
* In table Order, buyer refers User.id
* In table OrderItem, item refers Item.id, seller refers User.id, order refers Order.id

###To run the application
* ``npm install`` installes the node_modules
* ``PORT='<Port number>' nodejs server.js``
* Go to url ``localhost:<Port number>/catalogue``
