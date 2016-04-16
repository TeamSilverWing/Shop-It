function hash(str)
{
	return str;
}

var authenticate = function()
{
	var self = this;
	self.login = function(req,res)
	{
		var ses = req.session;
		if(ses.logged)
		{
			res.redirect('/catalogue/');
		}
		else
		{
			var username = req.body.username;
			var password = req.body.password;
			connection.query('SELECT * FROM `User` WHERE `username` = "'+username+'"',function(err,rows,field)
			{
				if( rows != undefined && rows.length==1)
				{
					if(hash(password) == rows[0].password)
					{
						ses.logged = 1;
						ses.username = username;
						ses.first_name = rows[0].first_name;
						ses.last_name = rows[0].last_name;
						ses.email = rows[0].email;	
						ses.user_id = rows[0].id;
						res.session = ses;
						res.redirect('/catalogue/');
					}
					else
					{
						res.redirect('/');
					}
				}
				else
				{
					res.redirect('/');
				}
			});
		}
	};

	self.logout = function(req,res)
	{
		req.session.destroy();
		res.redirect('/');
	};

};

module.exports = authenticate