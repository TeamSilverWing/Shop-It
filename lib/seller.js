module.exports = function(app,connection){
	var async = require("async");
	var htmlspecialchars = require('htmlspecialchars');

	app.get('/inventory/', function (req, res)
	{
		var ses = req.session;
		if(ses.logged == 1 && ses.user_type == 2)
		{
			connection.query('SELECT * FROM Item WHERE `Item`.seller = '+ses.user_id,function(err1, rows, feild)
			{
				res.render('inventory',{items : rows});
			});
		}
		else
		{
			if(ses.logged != 2)
				res.redirect('/catalogue/');
			else
				res.redirect('/');
		}
	});

	app.post('/add_item/',function (req, res)	//add to cart
	{
		var ses = req.session;
		if(ses.logged != 1 || ses.user_type != 2)
		{
			return res.send("Sorry Couldn't add. Please try again later.");
		}
		else
		{
			var name = req.body.name;
			var photo = req.body.photo;
			var description = req.body.description;
			var price = req.body.price;
			var seller = ses.user_id;
			console.log(name);
			console.log(description);
			if(name == "" || photo == "" || description == "" || price==""){
				res.send("Enter Valid Entries");
				return;
			}
			connection.query('INSERT INTO Item (description,name,photo,seller,price) values ("'+
				htmlspecialchars(description)+'","'+
				htmlspecialchars(name)+'","'+
				htmlspecialchars(photo)+'",'+
				htmlspecialchars(seller)+','+
				htmlspecialchars(price)+')', 
				function(err, rows, field){
					if(err==null)
					{
						res.send("Item added Successfully");
					}
					else{
						res.send("Error");
					}
			});
		}
	});

	app.get('/orders/', function (req, res)
	{
		var ses = req.session;
		if(ses.logged == 1 && ses.user_type == 2)
		{
			var seller = ses.user_id;
			response = {};
		    connection.query('SELECT * FROM OrderItem WHERE `seller` = '+seller,function(err1, rows, field) {
				if(err1 == null)
				{
					response['orders'] = rows;
					res.render('orders',response);
				}
				else
				{
					console.log(err1);
					response['error'] = err1;
					res.render('orders',response);
				}
			});
		}
		else{
			res.redirect('/');
		}

	});

	app.post('/progress/:id',function (req, res)	//add to cart
	{
		if(req.body.status>4){
			res.send("Unsuccessful");
			return;
		}
		else{
			console.log("receive from "+req.body.status);
			connection.query('UPDATE OrderItem SET status='+
				htmlspecialchars(req.body.status)+' WHERE `OrderItem`.`id` = '+
				htmlspecialchars(req.params.id),
				function(err1, rows, feild) {

				// 	res.render('item',{item : rows});
			});
			res.send("Successful");
		}
	});

}