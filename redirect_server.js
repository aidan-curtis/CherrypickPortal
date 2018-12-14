var express = require('express')
var app = express()
var config = require('./dev-config')
var server = require('http').createServer(app)
var path = require('path')
app.get("/", function(req, res){
	res.redirect('https://iconnect2colleges.com');
})
server.listen(config.redirect_port);
