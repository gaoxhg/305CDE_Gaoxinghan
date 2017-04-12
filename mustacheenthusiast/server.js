var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var mongodb = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
require("events").EventEmitter.prototype._maxListeners = 100;

var mongodbServer = new mongodb.Server("localhost", 27017, { auto_reconnect: true, poolSize: 10 });
var db = new mongodb.Db("dataB", mongodbServer);
var userstatus =false;
var username="", passW="", far1 = "", far2 ="", far3="";;
var fav1status= false ,fav2status=false, fav3status=false;
var isTriedLogin = false, isLoginSuccessful = false; var canRegis = true;

var server = http.createServer(function(request, response) {	
    if (request.method == "POST") {
		// Switch msg into a JSON object
        var formData = "", msg = "", obj = "";
        return request.on("data", function(data) {
			formData += data;
			return request.on("end", function() {
				var user;
				user = qs.parse(formData);
				msg = JSON.stringify(user);
				console.log(msg);
				response.writeHead(200, {
				  "Content-Type": "application/json",
				  "Content-Length": msg.length
				});
				obj = JSON.parse(msg);
				
				// Prevent signup page runs this part
				if (request.url == "/login.html") {
				var username = obj.username;
				var password = obj.password;
				
					
				if (obj.signup != null) {

					
					// Send obj data to dataB
					db.open(function() {
						
						db.collection("user", function(err, collection) {
							
							collection.insert({

								username: obj.username,
								password: obj.password,
								fav: [fav1,fav2,fav3]
							}, function(err, data) {
								
								if (data) {
									console.log("Successfully Insert");
								} else {
									console.log("Failed to Insert");
								}
							});
						});
					});

				}
				}	
			if(obj.signup == "logout"){
				isLoginSuccessful= false;

			}		
					
			if (obj.signup == null) {	
					
					
					isTriedLogin = true;
					// Handle data received from login page
					var username = obj.username;
					var password = obj.password;
					var fav = obj.fav;
					// Get data from dataB
				
				
				
				
				
				
				
					MongoClient.connect("mongodb://localhost:27017/dataB", function (err, db) {
						db.collection("user", function (err, collection) {
							collection.find().toArray(function(err, items) {
								if(err) throw err;
								// Check whether there is data in the dataB
								if (items != "") {
									// Check whether the user account exists
									for (var i=0; i<items.length; i++) {
										if (username == items[i].username && password == items[i].password) {
											username= items[i].username;
											fav1 = items[i].fav[0];
											fav2 = items[i].fav[1];
											fav3 = items[i].fav[2];
											passW = items[i].password;
											console.log("Login successful");
											isLoginSuccessful = true;
										}
										else{
											console.log("Login fail");
											userstatus=true;
											
										}
										
										
									}
								}
							});
						});	return response.end();
				});
			}
					
	if (request.url == "/gallery.html") {
	var uName = obj.username;
    var favo = obj.fav;
    var action = obj.action;

    if(obj.action == "addFav1" && fav1status == false) {
                    MongoClient.connect("mongodb://localhost:27017/dataB", function (err, db) {
                    db.collection("user", function (err, collection) {

    								collection.update({"username" : uName}, { $set:{"fav.0":favo}}, function(err, result){
    									if(data){
                        fav1status = true;
                        console.log('Document Updated Successfully');
                      }else {
                        console.log('Failed to Updated');
                      }
    								});
    							});
    						});
    					}



		if(obj.action == "addFav2" && fav2status == false) {
                MongoClient.connect("mongodb://localhost:27017/dataB", function (err, db) {
                db.collection("user", function (err, collection) {
              	collection.update({"username" : uName}, { $set:{"fav.1":favo}}, function(err, result){

                  if(data){
                    console.log('Document Updated Successfully');
                    fav2status = true;
                  }else {
                    console.log('Failed to Updated');
                  }
              	});
              	});
              	});
              }


        if(obj.action == "addFav3" && fav3status == false) {
                    MongoClient.connect("mongodb://localhost:27017/dataB", function (err, db) {
                    db.collection("user", function (err, collection) {
                    collection.update({"username" : uName}, { $set:{"fav.2":favo}}, function(err, result){
                        if(data){
                          console.log('Document Updated Successfully');
                          fav3status = true;
                        }else {
                          console.log('Failed to Updated');
                        }
                        	});
                      	});
                      });
                    }


          if(obj.action == "remove1" && fav1status == true) {
                MongoClient.connect("mongodb://localhost:27017/dataB", function (err, db) {
                db.collection("user", function (err, collection) {
                collection.update({"username" : uName}, { $set:{"fav.0":null}}, function(err, result){
                  if(data){
                    console.log('Document remove Successfully');
                    fav1status = false;
                  }else {
                    console.log('Failed to remove');
                  }
                });
                });
                });
                }

                if(obj.action == "remove2" && fav2status == true) {
                    MongoClient.connect("mongodb://localhost:27017/dataB", function (err, db) {
                    db.collection("user", function (err, collection) {
                    collection.update({"username" : uName}, { $set:{"fav.1":null}}, function(err, result){
                      if(data){
                      console.log('Document remove Successfully');
                        fav2status = false;
                      }else {
                      console.log('Failed to remove');
                      }
					});
                  });
                  });
                  }

                  if(obj.action == "remove3" && fav3status == true) {
                      MongoClient.connect("mongodb://localhost:27017/dataB", function (err, db) {
                      db.collection("user", function (err, collection) {
                      collection.update({"username" : uName}, { $set:{"fav.2":null}}, function(err, result){
                        if(data){
                        console.log('Document remove Successfully');
                          fav3status = false;
                        }else {
                        console.log('Failed to remove');
                        }
                    });
                    });
                    });
                    }

  }		
					
			
				
			});
			});
	}else {
		// Get
		fs.readFile("./" + request.url, function (err, data) {
			var dotoffset = request.url.lastIndexOf(".");
			var mimetype = dotoffset == -1
				? "text/plain"
				: {
					".html": "text/html",
					".ico" : "photo/x-icon",
					".jpg" : "photo/jpeg",
					".png" : "photo/png",
					".gif" : "photo/gif",
					".css" : "text/css",
					".js"  : "text/javascript"
				}[request.url.substr(dotoffset)];
			if (!err) {
				response.setHeader("Content-Type", mimetype);
				response.end(data);
				console.log(request.url, mimetype);
			} else {
				response.writeHead(302, {"Location": "http://localhost:5000/index.html"});
				response.end();
			}
		});
    }
});

server.listen(5000);

console.log("Server running at http://127.0.0.1:5000/");

// IO is used to send message between server an client
var io = require("socket.io").listen(server);
var username = username;
var fav1 = fav1;
var fav2 = fav2;
var fav3 = fav3;



	
function update() {
	if (isLoginSuccessful == true) {
		// Send message if login is successful
		console.log("allright");
		
		io.emit("login_successful", { message: "success", username: username, password: passW, fav1: fav1 ,fav2:fav2, fav3:fav3 });
		 MongoClient.connect("mongodb://localhost:27017/dataB", function (err, db) {

      db.collection("user", function (err, collection) {

        collection.find().toArray(function(err, items) {

            for (var i=0; i<items.length; i++) {
              console.log(username);
              if (username == items[i].username ) {
                username = items[i].username;
                fav1 = items[i].fav[0];
                fav2 = items[i].fav[1];
                fav3 = items[i].fav[2];
              }
          }
        });
      });
    });
		
	} else {
		
		if (isTriedLogin == true) {
			io.emit("login_failed", { message: "failllll" });
			isTriedLogin = false;
		}
		else{
			console.log("mad");
		io.emit("logout",{message: "logout"});
		
		}
	}
}
	
setInterval(update, 400);