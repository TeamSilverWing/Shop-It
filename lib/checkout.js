var checkout = function()
{
	var self = this;

	self.checkout = function(req,res)
	{
		var ses = req.session;
		if(ses.logged == 1)
		{
			var user = new Object();
			user.address = ses.address;
			user.contact_no = ses.contact_no;
			console.log(user);
			res.render('checkout',{user : user});
		}
		else
			return res.redirect('/');
	}

	self.checkoutOrder = function(req,res)
	{
		var ses = req.session;
		
		if(ses.logged == 1)
		{
			var address = req.body.address;
			var contact_no = req.body.contact_no;

			connection.query('UPDATE `User` SET `address` = '+address+' WHERE `id` = '+ses.user_id,function(err,rows,field)
			{
				if(err == null)
				{
					ses.address = req.body.address;
					connection.query('UPDATE `User` SET `contact_no` = '+contact_no+' WHERE `id` = '+ses.user_id,function(err2,rows2,field2)
					{
						if(err2 == null)
						{				
						ses.contact_no = req.body.contact_no;
						req.session = ses;
						//run sending to seller query
						res.redirect('/');
						}
						else
						{
							res.render('catalogue',{error : "Invalid Contact No."});
						}
					//updated address
					});
				}
				else
				{
					res.render('catalogue',{error : "Invalid Address"});
				}
			});
		}
		else
		{
			res.redirect('/');
		}

	};
};

module.exports = checkout