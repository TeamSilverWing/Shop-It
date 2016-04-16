function hash(str)
{
	return str;
}

var authenticate = function()
{
	var self = this;

	self.signup = function(req,res)
	{
		var username = req.body.username;
		var password = hash(req.body.password);
		var first_name = req.body.first_name;
		var last_name = req.body.last_name;
		var email = req.body.email;
		var contact_no = req.body.contact_no;
		var address = req.body.address;

		var string = 'INSERT INTO `User`(username,password,first_name,last_name,email,contact_no,address) VALUES ('
			+'"'+username+'"'
			+',"'+password+'"'
			+',"'+first_name+'"'
			+',"'+last_name+'"'
			+',"'+email+'"'
			+','+contact_no
			+',"'+address+'")';

		connection.query(string,function(err,row,field)
			{
				console.log(err);
				if(err==null)
				{
					return res.redirect('/');
				}
				else
					return res.send(err);
			});
	};

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