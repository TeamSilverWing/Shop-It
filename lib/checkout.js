var checkout = function()
{
	var self = this;

	self.checkOutAddress = function(req,res)
	{
		var ses = req.session;
		return res.send('in address conf');
	}

	self.checkOut = function(req,res)
	{
		var ses = req.session;
		var user = req.session.user_id;
		connection.query('SELECT * FROM CartItem WHERE `CartItem`.`buyer` = '+user,function(err,rows,field)
		{
			if(err == null)
			{
				if(ses.logged==1)
					return res.render("cart",{items:rows,instance: "checkout"});
				else
					return res.send("Please Log In");
			}
			else
			{
				return res.send(err);
			}
		});
	};
};

module.exports = checkout