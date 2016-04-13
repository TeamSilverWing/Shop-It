
var express = require('express')

var app = express();


var expressLayouts = require('express-ejs-layouts');

var http = require('http').Server(app);
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);
app.set('layout');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


<<<<<<< HEAD
var config = require('./config/config.json');

var mysql = require('mysql');
var connection = mysql.createConnection(config	);
connection.connect();
//connection.query('UPDATE games SET active = \'false\',winner = \' ' +'draw'+'\',looser = \' '+'draw'+'\' WHERE `games`.`active` = \''+'active'+'\';');


app.set('port',(process.env.PORT||3000));
=======
app.set('port',(process.env.PORT||3001));
>>>>>>> 79fb1765c89728d9ece6f5b90953d4de1ed85619

http.listen (app.get('port'),function(){
  console.log("listening to port number "+app.get('port'));
});


app.get( '/', function(req, res)
{
	res.render('index',{name : "anshul"});	
});

app.get('/catalogue', function (req, res)
{
	console.log("dasdasads");
	connection.query('SELECT * FROM items',function(err1, rows, feild) {
		console.log(rows);
		res.render('catalogue',{items : rows});
	});
});


app.get('/items/:id', function (req, res) 
{
	console.log(req.params.id);
	connection.query('SELECT * FROM items WHERE `items`.`id` = '+req.params.id,function(err1, rows, feild) {
		res.render('item',{item : rows});
	});
});
