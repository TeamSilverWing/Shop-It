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
			res.render('checkout',{user : user,error : ""});
		}
		else
			return res.redirect('/');
	}

	self.checkoutOrder = function(req,res)
	{
		var ses = req.session;		
		if(ses.logged == 1)
		{
			var user = new Object();
			user.address = ses.address;
			user.contact_no = ses.contact_no;

			var address = req.body.address;
			var contact_no = req.body.contact_no;
			//modified address
			connection.query('UPDATE `User` SET `address` = "'+address+'" WHERE `id` = '+ses.user_id,function(err,rows,field)
			{
				if(err == null)
				{
					ses.address = req.body.address;
					user.address = ses.address;
					req.session = ses;
					
					//modified contact_no
					connection.query('UPDATE `User` SET `contact_no` = "'+contact_no+'" WHERE `id` = '+ses.user_id,function(err2,rows2,field2)
					{
						if(err2 == null)
						{
						ses.contact_no = req.body.contact_no;
						user.contact_no = ses.contact_no;
						req.session = ses;

						//got all items
						connection.query('SELECT * FROM `CartItem` WHERE `buyer` = '+ses.user_id,function(err3,rows3,field3)
						{
							if(err3 == null)
							{
								connection.query('DELETE FROM `CartItem` WHERE `buyer` = ' + ses.user_id);
								//added order
								connection.query('INSERT INTO `Order`(buyer,address,contact_no) VALUES ('+ses.user_id+',"'+ses.address+'","'+ses.contact_no+'")',function(err4,rows4,field4)
									{
										console.log(err4);
										if(err4 == null)
										{
											//get order id
											connection.query('SELECT * FROM `Order` WHERE `buyer` = ' + ses.user_id + ' ORDER BY `date` DESC',function(err5,row5,field5)
											{
												if(err5 == null)
												{
													var order = row5[0].id;
													var counter = 0;
													for(i=0;i<rows3.length;i=i+1)
													{
														connection.query('SELECT * FROM `Item` WHERE `id` = '+rows3[i].item,function(err6,row6,field6)
														{
															if(row6[0] != undefined)
															{
																var item = row6[0].id;
																var name = row6[0].name;
																var seller = row6[0].seller;
																var string = 'INSERT INTO `OrderItem`(item,name,seller,`order`) VALUES ('+item+',"'+name+'",'+seller+','+order+')';
																connection.query('INSERT INTO `OrderItem`(item,name,seller,`order`) VALUES ('+item+',"'+name+'",'+seller+','+order+')',function(err7,row7,field7)
																{
																	if(err7 == null)
																	{
																		counter++;
																		if(counter == rows3.length)
																		{
																			res.redirect('/catalogue/');
																		}
																	}
																	else
																	{
																		res.render('checkout',{user:user,error : "Couldn't complete order. Please try Again Later"});
																	}
																});
																
															}
															else
															{
																counter++;
																if(counter == rows3.length)
																{
																	//delete items from CartItem
																	res.redirect('/catalogue/');
																}
															}
														});	
													}
												}
												else
												{
													res.render('checkout',{user:user,error : "eeCouldn't complete order. Please try Again Later"});
												}

											});

										}
										else
										{
											res.render('checkout',{user:user,error : "jjCouldn't complete order. Please try Again Later"});
										}
									});
							}
							else
							{
								res.render('checkout',{user:user,error : "kkCouldn't retrieve items. Please Try again later."});
							}	
						});
						//get all items
						//delete all items
						//send to orderitem
						}
						else
						{
							res.render('checkout',{user:user,error : "Invalid Contact No."});
						}
					//updated address
					});
				}
				else
				{
					res.render('checkout',{user : user,error : "Invalid Address"});
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