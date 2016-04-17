express = require('express')
bodyParser = require("body-parser");
app = express();

expressLayouts = require('express-ejs-layouts');
http = require('http').Server(app);
session = require('express-session');

//Different Modules
authenticate = require('./lib/authenticate.js');
buyer = require('./lib/buyer.js');
shopit = require('./lib/shopit.js');
checkout = require('./lib/checkout.js');
app.use(session({secret: '5H0P17!'}));
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('layout');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('port',(process.env.PORT||3000));

config = require('./config/config.json');
mysql = require('mysql');
connection = mysql.createConnection(config);
connection.connect();

http.listen(app.get('port'),function()
{
	console.log("Listening to port number "+app.get('port'));
});

app.get('/', function(req, res)
{
	var shopit_instance = new shopit();
	var ses = req.session;
	if(ses.logged == 1)
	{
		if(ses.user_type == 1)
			return res.redirect('/catalogue/');
		else
			return res.redirect('/inventory/');
	}
	else
		return shopit_instance.viewMain(req,res);		
});

//Using Authenticate Module
app.get('/login/',function(req,res)
{
	var authenticate_instance = new authenticate();
	return authenticate_instance.login(req,res);
});

app.post('/login_auth/',function(req,res)
{
	var authenticate_instance = new authenticate();
	return authenticate_instance.loginAuth(req,res);
});

app.get('/logout/',function(req,res)
{
	var authenticate_instance = new authenticate();
	return authenticate_instance.logout(req,res);
});

app.post('/signup/',function(req,res)
{
	var authenticate_instance = new authenticate();
	return authenticate_instance.signup(req,res);
});


//Using Buyer Module
app.get('/cart/',function(req,res)	//View items in the Cart
{
	var buyer_instance = new buyer();
	return buyer_instance.viewCart(req,res);
});

app.post('/cart/add/',function (req, res)	//Add to Cart
{
	var buyer_instance = new buyer();
	return buyer_instance.addToCart(req,res);
});

app.post('/cart/delete/',function (req, res)	//Delete from Cart
{
	var buyer_instance = new buyer();
	return buyer_instance.deleteFromCart(req,res);
});
//Using ShopIt Module
app.get('/catalogue/', function (req, res)
{
	var shopit_instance = new shopit();
	return shopit_instance.viewCatalogue(req,res);
});

app.get('/items/:id', function (req, res) 
{
	var shopit_instance = new shopit();
	return shopit_instance.viewItem(req,res);
});


//Using CheckOut Module
app.get('/checkout/',function(req,res)
{
	var checkout_instance = new checkout();
	return checkout_instance.checkOut(req,res);
});

app.post('/checkout/address/',function(req,res)
{
	var checkout_instance = new checkout();
	return checkout_instance.checkOutAddress(req,res);
});

app.post('/checkout/confirm/',function(req,res)
{
	var checkout_instance = new checkout();
	return checkout_instance.checkOutConfirm(req,res);
});

//Seller Functoins handled addToCart
require('./lib/seller')(app,connection);
