# Shop-It

## Create a mysql user

### Run these in mysql shell
* create user 'shopit'@'localhost' identified by 'shopit';
* grant grant all privileges on * . * to 'shopit'@'localhost';
* flush privileges;

## Creating db
* Log in using ``mysql -u shopit -p``
* `` Password is : shopit``
* Add following tables

* #### Table Item
``CREATE TABLE `Item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `seller` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_fk` (`name`,`seller`),
  KEY `seller` (`seller`),
  CONSTRAINT `Item_ibfk_1` FOREIGN KEY (`seller`) REFERENCES `User` (`id`)
)``

* #### Table User
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

* #### Table CartItem
``CREATE TABLE `CartItem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item` int(11) NOT NULL,
  `buyer` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_item` (`item`,`buyer`)
)``

* #### Table Order
``CREATE TABLE `Order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buyer` int(11) NOT NULL,
  `date` date NOT NULL,
  `address` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `buyer` (`buyer`),
  CONSTRAINT `Order_ibfk_1` FOREIGN KEY (`buyer`) REFERENCES `User` (`id`)
)``

* #### Table OrderItem
``CREATE TABLE `OrderItem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `seller` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `item` (`item`),
  KEY `order` (`order`),
  KEY `seller` (`seller`),
  KEY `name` (`name`),
  CONSTRAINT `OrderItem_ibfk_5` FOREIGN KEY (`name`) REFERENCES `Item` (`name`),
  CONSTRAINT `OrderItem_ibfk_2` FOREIGN KEY (`item`) REFERENCES `Item` (`id`),
  CONSTRAINT `OrderItem_ibfk_3` FOREIGN KEY (`order`) REFERENCES `Order` (`id`),
  CONSTRAINT `OrderItem_ibfk_4` FOREIGN KEY (`seller`) REFERENCES `User` (`id`)
)``

### To run the application
* ``npm install`` installes the node_modules
* ``PORT='<Port number>' nodejs server.js``
* Go to url ``localhost:<Port number>/catalogue``

## <a name="question"></a> Got a Question or Problem?

If you have questions about how to use PyMail, please open an issue with the concerned question.

## <a name="issue"></a> Found an Issue?

If you find a bug in the source code or a mistake in the documentation, you can help us by
submitting an issue to our [GitHub Repository][github]. Even better you can submit a Pull Request
with a fix.

## <a name="feature"></a> Want a Feature?

You can request a new feature by submitting an issue to our [GitHub Repository][github].  If you
would like to implement a new feature then Contact us through email.

[github]: https://github.com/TeamSilverWing/Shop-It/

