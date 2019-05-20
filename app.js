var mysql = require('./dbcon.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
//var session = require('express-session');
//var path = require('path');
//app.use(express.static(path.join(__dirname,'public')));

var port = 60001;

// mysql stuff
//var mysql = require('mysql');
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
//app.use(session({secret:'randpassString'}));
app.set('port',port);

// TODO: Update with appropriate MySQL info

app.get('/',function(req,res) {
    res.render('index',{title:'CS 340 Database Project - COD Database'});
});

app.get('/index',function(req,res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM Players', function(err, rows, fields){
        if(err) {
            next(err);
            return;
        }
        var data = [];
        for(var x in rows) {
            var add = {
                'id': rows[x].id,
                'gamertag':rows[x].Gamertag,
                'weapon':rows[x].Weapon,
                'specialist':rows[x].Specialist,
                'killCount':rows[x].Kill_Count,
                'deathCount':rows[x].Death_Count,
                'wins':rows[x].Wins,
                'losses':rows[x].Losses,
                'map':rows[x].Map
            };
            data.push(add);
        }
        context.results = data;
        res.render('index',context);
    });

    
});

app.get('/map',function(req,res) {
    var context = {};
    mysql.pool.query('SELECT * FROM Maps', function(err, rows, fields){
        if(err) {
            next(err);
            return;
        }
        var data = [];
        for(var x in rows) {
            var add = {
                'id': rows[x].id,
                'name':rows[x].Name,
                'gameMode':rows[x].Game_Mode,
                'dlc':rows[x].DLC,
                'maxPlayers':rows[x].Max_Players,
                'environment':rows[x].Environment,
                'combatType':rows[x].Combat_Type
            };
            data.push(add);
        }
        context.results = data;
        res.render('map',context);
    }); 
});

app.get('/perk',function(req,res) {
    var context = {};
    mysql.pool.query('SELECT * FROM Perks', function(err, rows, fields){
        if(err) {
            next(err);
            return;
        }
        var data = [];
        for(var x in rows) {
            var add = {
                'id': rows[x].id,
                'name':rows[x].Name,
                'duration':rows[x].Duration,
                'effect':rows[x].Effect
            };
            data.push(add);
        }
        context.results = data;
        res.render('perk',context);
    });  
});

app.get('/updatePlayer',function(req,res) {
    res.render('updatePlayer',{title:'CS 340 Project Database - Update Player'});
});

app.get('/weapon',function(req,res) {
    var context = {};
    mysql.pool.query('SELECT * FROM Weapons', function(err, rows, fields){
        if(err) {
            next(err);
            return;
        }
        var data = [];
        for(var x in rows) {
            var add = {
                'id': rows[x].id,
                'name':rows[x].Name,
                'type':rows[x].Type,
                'damage':rows[x].Damage,
                'range':rows[x].Range_,
                'rateOfFire':rows[x].Rate_of_Fire,
                'ammo':rows[x].Ammo_Capacity
            };
            data.push(add);
        }
        context.results = data;
        res.render('weapon',context);
    }); 
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