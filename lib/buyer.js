//This is the buyer library and includes viewCart,addToCart and deleteFromCart
var buyer = function()
{
	var self = this;

	self.viewCart = function(req,res)
	{
		var ses = req.session;
		var user = new Object();
		if(ses.logged == 1 && ses.user_type == 1)
		{
			user.valid = 1;
			user.user_id = ses.user_id;
			connection.query('SELECT * FROM CartItem WHERE `CartItem`.`buyer` = '+user.user_id,function(err,rows,field)
				{
					if(err==null)
						{
							var detail = [];
							var counter = 0;
							if(rows.length == 0)
							{
								return res.render('cart',{items : detail,user : user});
							}
							else
							{
								for(i = 0;i<rows.length;i = i+1)
								{
									connection.query('SELECT * FROM Item WHERE `Item`.id = '+rows[i].item,function(err2,rows2,field2)
									{
										var item = new Object();
										if(err2 == null && rows2.length == 1)
										{
											item.id = rows2[0].id;
											item.name = rows2[0].name;
											item.price = rows2[0].price;
											detail.push(item);
										}
										counter++;

										if(counter == rows.length)
										{
											console.log(detail);
											return res.render('cart',{items : detail,user : user});
										}
									});
								}
							}
						}
					else
						return res.send("Some error occured. Please try again later.");
				});
		}
		else
		{
			res.redirect('/');
		}
	};

	self.addToCart = function(req,res)
	{
		var ses = req.session;
		if(ses.logged == 1 && ses.user_type == 1)
		{
			var user = ses.user_id;
			var item = req.body.itemId;

			connection.query('INSERT INTO CartItem (item,buyer) values ('+
				htmlspecialchars(item)+','+
				user+')',function(err,rows,field)
				{
					if(err==null)
						return res.send("Successfully Added Item to Cart");
					else
						return res.send(err);
				});
		}
		else
		{
			return res.send("Please Log In");
		}
	};

	self.deleteFromCart = function(req,res)
	{
		var ses = req.session;
		if(ses.logged == 1 && ses.user_type == 1)
		{
			var user = ses.user_id;
			var item = req.body.itemId;

			connection.query('DELETE FROM `CartItem` WHERE `CartItem`.`item` = '+
				htmlspecialchars(item) +' AND `CartItem`.`buyer` = '+
				user,function(err,rows,field)
			{
				if(err==null)
					res.send("Successfully Deleted Item from Cart");
				else
					res.send(err);
			});
		}
		else
		{
			return res.send("Please Log In");
		}
	};
};

module.exports = buyer;
