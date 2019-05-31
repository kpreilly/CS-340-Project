var mysql = require('./dbcon.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

//var session = require('express-session');
var path = require('path');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'views')));

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
    mysql.pool.query("SELECT Players.id, Gamertag, Kill_Count, Death_Count, Wins, Losses, Weapons.name as weapon, Specialists.name as specialist, Maps.name as map FROM Players INNER JOIN Weapons ON Players.weapon = Weapons.id INNER JOIN Specialists ON Players.specialist = Specialists.id INNER JOIN Maps ON Players.map = Maps.id", function(err, rows, fields){
        if(err) {
            next(err);
            return;
        }
        var data = [];
        for(var x in rows) {
            var add = {
                'id': rows[x].id,
                'gamertag':rows[x].Gamertag,
                'weapon':rows[x].weapon,
                'specialist':rows[x].specialist,
                'killCount':rows[x].Kill_Count,
                'deathCount':rows[x].Death_Count,
                'wins':rows[x].Wins,
                'losses':rows[x].Losses,
                'map':rows[x].map
            };
            data.push(add);
        }
        context.results = data;
        res.render('index',context);
    });

    
});

//Insert New Player
// Test query
// INSERT INTO Players(Gamertag, Weapon, Specialist, Map) 
//VALUES('Frankie709',(SELECT id FROM Weapons WHERE Name = 'ICR-7'), (SELECT id FROM Specialists WHERE Name = 'Battery'), (SELECT id FROM Maps WHERE Name = 'Arsenal'));
app.get('/insert', function(req, res, next){
    var context = {};
    mysql.pool.query("INSERT INTO Players (Gamertag, Weapon, Specialist, Map) VALUES(?,(SELECT id FROM Weapons WHERE Name = ?), (SELECT id FROM Specialists WHERE Name = ?), (SELECT id FROM Maps WHERE Name = ?))",
    [req.query.gamertag,
    req.query.weapon,
    req.query.specialist,
    req.query.map],
    function(err, result){
        if(err){
            next(err);
            return;
        }
        context.insert=result.insertId;
        res.send(JSON.stringify(context));
    });
});

//Delete Player
app.get('/delete', function (req, res, next) {
    mysql.pool.query("DELETE FROM Players WHERE id=?", [req.query.id], function (err, result) {
        if (err) {
            next(err);
            return;
        }
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

/*
app.get('/updatePlayer',function(req,res) {
    res.render('updatePlayer',{title:'CS 340 Project Database - Update Player'});
});
*/

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

/*Testting out Update Data */
function getPlayer(res, mysql, context, id, complete){
    var sql = "SELECT id, Gamertag, Specialist, Kill_Count, Death_Count, Wins, Losses, Map FROM Players WHERE id = ?";
    var inserts = [id];
    mysql.pool.query(sql,inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.player = results[0];
        complete();
    });
}

function getWeapons(res, mysql, context, complete){
    mysql.pool.query("SELECT id, name FROM Weapons", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.weapons  = results;
        complete();
    });
}

function getSpecialists(res, mysql, context, complete){
    mysql.pool.query("SELECT id, name FROM Specialists", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.specialists  = results;
        complete();
    });
}

function getMaps(res, mysql, context, complete){
    mysql.pool.query("SELECT id, name FROM Maps", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.maps  = results;
        complete();
    });
}

app.get('/:id', function(req,res){
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["selectMap.js", "selectWeapon.js", "selectSpecialist.js", "updatePlayer.js"];
    getPlayer(res, mysql, context, req.params.id, complete);
    getMaps(res, mysql, context, req.params.id, complete);
    getSpecialists(res, mysql, context, req.params.id, complete);
    getWeapons(res, mysql, context, req.params.id, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >=4){
            res.render('updatePlayer', context);
        }
    };
    res.render('updatePlayer', context);
});

/* The URI that update data is sent to in order to update a person */

app.put('/:id', function(req, res){
    var mysql = req.app.get('mysql');
    console.log(req.body)
    console.log(req.params.id)
    var sql = "UPDATE Players SET Gamertag=?, Weapon=?, Specialist=?, Map=?, Kill_Count=?, Death_Count=?, Wins=?, Losses=? WHERE id=?";
    var inserts = [req.body.Gamertag, req.body.Weapon, req.body.Specialist, req.body.Map, req.body.Kill_Count, req.body.Death_Count, req.body.Wins, req.body.Losses, req.params.id];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(error)
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.status(200);
            res.end();
        }
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