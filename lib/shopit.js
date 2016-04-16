var shopit = function()
{
	var self = this;

	self.viewCatalogue = function(req,res)
	{
		var ses = req.session;
		var user = new Object();
		connection.query('SELECT * FROM `Item` ORDER BY `id` DESC',function(err, rows, field)
		{
			if(err == null)
			{
				if(ses.logged)
				{
					user.valid = 1;
					user.email = ses.email;
					user.first_name = ses.first_name;
					user.last_name = ses.last_name;
					user.username = ses.username;
					user.user_id = ses.user_id;
					
					for(i=0;i<rows.length;i++)
						rows[i].visibility = 1;
					
					connection.query('SELECT `item` FROM `CartItem` WHERE `CartItem`.`buyer` = '+user.user_id+' ORDER BY `item` DESC',function(err1,rows1,field1)
					{
						if(err1==null)		
						{
							for(i=0,j=0;i<rows.length,j<rows1.length;)
							{
								if(rows[i].id == rows1[j].item)
								{
									rows[i].visibility = 0;
									i++;
									j++;
								}
								else if(rows[i].id>rows1[j].item)
									i++;
								else
									j++;
							}
							return res.render('catalogue',{items : rows,user : user});
						}
						else
						{
							return res.send("Some Error occurred. Please try again later.");
						}
					});
				}
				else
				{
					user.valid = 0;
					return res.render('catalogue',{items : rows,user : user});
				}
			}
			else
			{
				return res.send("Some Error occurred. Please try again later.");
			}
		});
	};

	self.viewItem = function(req,res)
	{
		connection.query('SELECT * FROM Item WHERE `Item`.`id` = '+req.params.id,function(err, rows, field)
		{
			if(err==null)
				return res.render('item',{item : rows});
			else
				return res.send("Some Error occurred. Please try again later.");
		});
	};
};

module.exports = shopit;