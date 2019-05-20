var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
app.use(express.static(path.join(__dirname,'public')));

var port = 60001;

// mysql stuff
var mysql = require('mysql');
// var connectionLimit = require('./dbcon').connectionLimit,
//     host = require('./dbcon').host,
//     password = require('./dbcon').password,
//     user = require('./dbcon').user,
//     db = require('./dbcon').db;

// var pool = mysql.createPool({
//     connectionLimit: connectionLimit,
//     host: host,
//     user: user,
//     password: password,
//     database: db,
//     port: '8889'
// });

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret:'randpassString'}));
app.set('port',port);

// TODO: Update with appropriate MySQL info

app.get('/',function(req,res) {
    res.render('index',{title:'CS 340 Database Project - COD Database'});
});

app.get('/index',function(req,res) {
    res.render('index',{title:'CS 340 Database Project - COD Database'});
});

app.get('/map',function(req,res) {
    res.render('map',{title:'CS 340 Database Project - Map Table'});
});

app.get('/perk',function(req,res) {
    res.render('perk',{title:'CS 340 Database Project - Perk Table'});
});

app.get('/updatePlayer',function(req,res) {
    res.render('updatePlayer',{title:'CS 340 Project Database - Update Player'});
});

app.get('/weapon',function(req,res) {
    res.render('weapon',{title:'CS 340 Database Project - Weapon Table'});
});

/* Error Processing */

app.use(function(req,res){
    res.status(404);
    res.render('404',{title:'404 - Page Not Found'});
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500',{title:'500 Error'});
});

app.listen(app.get('port'), function(){
    console.log('Express started on localhost:' + 
    app.get('port') + '; press Ctrl-C to abort.');
});