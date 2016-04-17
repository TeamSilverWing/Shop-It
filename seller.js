module.exports = function(app,connection){
	var async = require("async");

	var seller = 2;		//ID of the Logged in seller

	app.get('/inventory', function (req, res)
	{
		connection.query('SELECT * FROM Item',function(err1, rows, feild) {
			res.render('inventory',{items : rows});
		});
	});

	app.post('/add_item/',function (req, res)	//add to cart
	{
		var name = req.body.name;
		var photo = req.body.photo;
		var description = req.body.description;
		console.log(name);
		console.log(description);
		if(name == "" || photo == "" || description == ""){
			res.send("Enter Valid Entries");
			return;
		}
		connection.query('INSERT INTO Item (description,name,photo,seller) values ("'+description+'","'+name+'","'+photo+'",'+seller+')', 
			function(err, rows, field){
				if(err==null)
				{
					res.send("Item added Successfully");
				}
				else{
					res.send("Error");
				}
		});
	});

	app.get('/orders/', function (req, res)
	{
		response = {};
	    connection.query('SELECT * FROM OrderItem WHERE `seller` = '+seller,function(err1, rows, field) {
			if(rows[0] != undefined){

				// for(i=0;i<rows.length;i=i+1){
				// 	console.log(rows[i].name);
				// }

				response['orders'] = rows;
				res.render('orders',response);
			}
			else{
				console.log(err1);
			}
		});


	});

	app.post('/progress/:id',function (req, res)	//add to cart
	{
		console.log("receive from "+req.body.status);
		connection.query('UPDATE OrderItem SET status='+req.body.status+' WHERE `OrderItem`.`id` = '+req.params.id,
			function(err1, rows, feild) {

			// 	res.render('item',{item : rows});
		});
		res.send("Successful");
	});

}