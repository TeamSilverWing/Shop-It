
var express = require('express')
var bodyParser = require("body-parser");

var app = express();

var expressLayouts = require('express-ejs-layouts');
var http = require('http').Server(app);
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
var seller = 2;
var user = 1;
var TYPE_SELLER = 2;
var TYPE_BUYER = 1;
var TYPE_ADMIN = 0;
app.set('port',(process.env.PORT||3000));

http.listen(app.get('port'),function(){
  console.log("Listening to port number "+app.get('port'));
});

app.get('/', function(req, res)
{
	res.render('index',{name : "anshul"});	
});

app.get('/catalogue', function (req, res)
{
	connection.query('SELECT * FROM `Item` ORDER BY `id` DESC',function(err1, rows, feild)
	{
		//check if added to cart or not
		connection.query('SELECT * FROM `Cart` WHERE `buyer` = '+user,function(err2,rows2,field)
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
					res.render('catalogue',{items : rows});
				});
			}
			else
			{
				for(i=0;i<rows.length;i++)
					{
						rows[i].visibility = 1;
					}
				res.render('catalogue',{items : rows});
			}
		});
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

/*app.get('/messages',function (req, res)
{
	connection.query('SELECT * FROM Messages WHERE `Messages`.`id` = '+userId,function(err1, rows, feild) {
		res.render('messages'}{messages : rows});
	});

});*/

