
var express = require('express')
var bodyParser = require("body-parser");

var app = express();

var expressLayouts = require('express-ejs-layouts');
var http = require('http').Server(app);
var session = require('express-session');

app.use(session({secret: '5H0P17!'}));
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('layout');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

var config = require('./config/config.json');
var mysql = require('mysql');
var connection = mysql.createConnection(config);
connection.connect();
//connection.query('UPDATE games SET active = \'false\',winner = \' ' +'draw'+'\',looser = \' '+'draw'+'\' WHERE `games`.`active` = \''+'active'+'\';');

var TYPE_SELLER = 2;
var TYPE_BUYER = 1;
var TYPE_ADMIN = 0;
app.set('port',(process.env.PORT||3000));

http.listen(app.get('port'),function(){
  console.log("Listening to port number "+app.get('port'));
});

app.get('/', function(req, res)
{
	var ses = req.session;
	if(ses.logged == 1)
	{
		res.redirect('/catalogue/');
	}
	else
	{
		res.render('login');	
	}
});

app.get('/logout',function(req,res)
{
	req.session.destroy();
	res.redirect('/');
});

app.get('/catalogue', function (req, res)
{
	var ses = req.session;
	var user = new Object();
	connection.query('SELECT * FROM `Item` ORDER BY `id` DESC',function(err1, rows, feild)
	{
		if(ses.logged)
		{
			user.valid = 1;
			user.email = ses.email;
			user.first_name = ses.first_name;
			user.last_name = ses.last_name;
			user.username = ses.username;
			user.user_id = ses.user_id;
			//check if added to cart or not
			connection.query('SELECT * FROM `Cart` WHERE `buyer` = '+user.user_id,function(err2,rows2,field)
			{
				if(rows2[0] != undefined)
				{
					connection.query('SELECT `item`,`seller` FROM `CartItem` WHERE `cart` = '+rows2[0].id+' ORDER BY `item` DESC',function(err3,rows3,field)
					{		
						for(i=0,j=0;i<rows.length,j<rows3.length;)
						{
							if(rows[i].id == rows3[j].item)
							{
								rows[i].visibility = 0;
								i++;
								j++;
							}
							else if(rows[i].id>rows3[j].item)
							{
								rows[i].visibility = 1;
								i++;
							}
							else
							{
								j++;
							}
						}

						for(;i<rows.length;i++)
						{
							rows[i].visibility = 1;
						}
						res.render('catalogue',{items : rows,user : user});
					});
				}
				else
				{
					for(i=0;i<rows.length;i++)
						{
							rows[i].visibility = 1;
						}
					res.render('catalogue',{items : rows,user : user});
				}
			});
		}
		else
		{
			user.valid = 0;
			res.render('catalogue',{items : rows,user:user});
		}
	});
});

app.get('/items/:id', function (req, res) 
{
	connection.query('SELECT * FROM Item WHERE `Item`.`id` = '+req.params.id,function(err1, rows, feild) {
		res.render('item',{item : rows});
	});
});

app.post('/cart/',function (req, res)	//add to cart
{
	var user = req.body.userId;
	var item = req.body.itemId;
	var seller = req.body.sellerId;
	
	connection.query('SELECT * FROM Cart WHERE `Cart`.`buyer` = '+user,function(err1, rows, feild)
	{
		if(rows[0] != undefined)
		{
			connection.query('INSERT INTO CartItem (item,cart,seller) values ('+item+','+rows[0].id+','+seller+')',function(err2,rows2,field)
				{
				
				});			
		}
		else
		{
			connection.query('INSERT INTO Cart(buyer) values ('+user+')',function(err13, rows3, feild3)
			{
				connection.query('SELECT * FROM Cart WHERE `Cart`.`buyer` = '+user,function(err12, rows2, feild2)
				{
					connection.query('INSERT INTO CartItem (item,cart,seller) values ('+item+','+rows2[0].id+','+seller+')',function(err1, rows, feild)
					{
					
					});		
				});	
			});
		}
	});
	res.send("Successful");
});

function hash(str)
{
	return str;
}

app.post('/login/',function(req,res)
{
	var ses = req.session;
	console.log(ses);
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
			console.log(rows);
			if( rows != undefined && rows.length==1)
			{
				console.log("Check password");
				if(hash(password) == rows[0].password)
				{
					ses.logged = 1;
					ses.username = username;
					ses.first_name = rows[0].first_name;
					ses.last_name = rows[0].last_name;
					ses.email = rows[0].email;	
					ses.user_id = rows[0].id;
					console.log(ses);
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
});

/*app.get('/messages',function (req, res)
{
	connection.query('SELECT * FROM Messages WHERE `Messages`.`id` = '+userId,function(err1, rows, feild) {
		res.render('messages'}{messages : rows});
	});

});*/

