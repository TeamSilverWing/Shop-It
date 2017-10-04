//Returns MD5 hash of given string input
function hash(str)
{
	var hash = crypto.createHash("md5").update(str).digest('hex');
	return hash;
}

//The authentication function
var authenticate = function()
{
	var self = this;

	self.login = function(req,res)
	{
		var ses = req.session;
		if(ses.logged == 1)	//In case session variable set, redirect to homepage
		{
			if(ses.user_type == 1)	//If a buyer
				res.redirect('/catalogue/');
			else 	//If a seller
				res.redirect('/inventory/')
		}
		else //Otherwise render login page
		{
			return res.render('login',{error : ""});
		}
	};

	self.signup = function(req,res)	//Signup Action
	{
		var username = req.body.username;
		var password = hash(req.body.password);
		var first_name = req.body.first_name;
		var last_name = req.body.last_name;
		var email = req.body.email;
		var user_type = req.body.user_type;

		//Build Insert Query
		var string = 'INSERT INTO `User`(username,password,first_name,last_name,email,user_type) VALUES ('
			+'"'+htmlspecialchars(username)+'"'
			+',"'+htmlspecialchars(password)+'"'
			+',"'+htmlspecialchars(first_name)+'"'
			+',"'+htmlspecialchars(last_name)+'"'
			+',"'+htmlspecialchars(email)+'"'
			+','+user_type+')';

		connection.query(string,function(err,row,field)
			{
				if(err==null)
					return res.render('login',{error : "Sign Up Successfull"});
				else
					return res.render('login',{error : "Email or Username already exists"});
			});
	};

	self.loginAuth = function(req,res)
	{
		var ses = req.session;
		if(ses.logged)
		{
			if(ses.user_type == 1)
				res.redirect('/catalogue/');
			else
				res.redirect('/inventory/');
		}
		else
		{
			var username = req.body.username;
			var password = req.body.password;
			connection.query('SELECT * FROM `User` WHERE `username` = "'+
				htmlspecialchars(username)+'"',function(err,rows,field)
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
						ses.address = rows[0].address;
						ses.contact_no = rows[0].contact_no;
						ses.user_type = rows[0].user_type;
						res.session = ses;
						if(ses.user_type == 1)
							res.redirect('/catalogue/');
						else
							res.redirect('/inventory/');
					}
					else
					{
						res.render('login',{error : "Incorrect Password"});
					}
				}
				else
				{
					res.render('login',{error : "Invalid Username"});
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
