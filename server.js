
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
var async = require("async");

app.set('port',(process.env.PORT||3000));

http.listen(app.get('port'),function(){
  console.log("Listening to port number "+app.get('port'));
});

require('./seller')(app,connection);
app.get('/', function(req, res)
{
	res.render('index',{name : "anshul"});	
});

app.get('/catalogue', function (req, res)
{
	connection.query('SELECT * FROM Item',function(err1, rows, feild) {
		res.render('catalogue',{items : rows});
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
	console.log(user);
	console.log(item);
	connection.query('SELECT * FROM Cart WHERE `Cart`.`buyer` = '+user,function(err1, rows, feild) {
		if(rows[0] != undefined)
		{
			connection.query('INSERT INTO CartItem (item,cart,seller) values ('+item+','+rows[0].id+','+seller+')');			
		}
		else
		{
			connection.query('INSERT INTO Cart(buyer) values ('+user+')',function(err13, rows3, feild3)
			{
				connection.query('SELECT * FROM Cart WHERE `Cart`.`buyer` = '+user,function(err12, rows2, feild2)
				{
					connection.query('INSERT INTO CartItem (item,cart,seller) values ('+item+','+rows2[0].id+','+seller+')',function(err1, rows, feild)
					{
						console.log("Added new");
					});		
				});	
			});
		}
	});
	//send response
	res.send("Successful");
});

/*app.get('/messages',function (req, res)
{
	connection.query('SELECT * FROM Messages WHERE `Messages`.`id` = '+userId,function(err1, rows, feild) {
		res.render('messages'}{messages : rows});
	});

});*/
