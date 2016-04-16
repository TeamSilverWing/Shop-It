var buyer = function()
{
	var self = this;

	self.viewCart = function(req,res)
	{
		var ses = req.session;
		if(ses.logged == 1)
		{
			var user = ses.user_id;

			connection.query('SELECT * FROM CartItem WHERE `CartItem`.`buyer` = '+user,function(err,rows,field)
				{
					if(err==null)
						{
							return res.render('cart',{items : rows});
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
		if(ses.logged == 1)
		{
			var user = ses.user_id;
			var item = req.body.itemId;
			
			connection.query('INSERT INTO CartItem (item,buyer) values ('+item+','+user+')',function(err,rows,field)
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
		if(ses.logged == 1)
		{
			var user = ses.user_id;
			var item = req.body.itemId;

			connection.query('DELETE FROM `CartItem` WHERE `CartItem`.`item` = '+item +' AND `CartItem`.`buyer` = '+user,function(err,rows,field)
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