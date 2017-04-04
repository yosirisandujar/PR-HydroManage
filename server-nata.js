var express = require("express");
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var path = require('path');
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(express.static(path.join(__dirname, '../')));
app.use(express.static(path.join(__dirname, '../node_modules/')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    } else {
        return next();
    }
});
//initiate connection with mysql db----------------------------------------------------------------------------------------------
var connString = {
    host: '127.0.0.1', //local server
    user: 'root',
    password: '',
    database: 'PRHydroManage'
};
//------------------------------------------------------------------------------------------------------------------
//API GET'S (persona escribe) 
//API
//Insert specials
app.get('/login/:username/:password', function (req, res) {

    console.log("Login: " + req.params.username); //alli va lo q quiero guardar en la DB
    var sql = "select * from login where username = ? and password = ?";
    var connection = mysql.createConnection(connString);
    console.log("Query: " + sql);
    connection.query(sql, [req.params.username, req.params.password], function (err, rows, fields) {
        connection.end();
        if (!err) {
            res.json(rows);
            console.log("Login success");
            res.end();
        } else {
            console.log('Login error');
            console.log(err);
        }
    });
});
//API DE ADMIN
app.get('/adminlogin/:username/:password', function (req, res) {
    console.log("Adminlogin: " + req.params.username); //alli va lo q quiero guardar en la DB
    var sql = "select * from administrator where username = ? and password = ?";
    //var sql = "select * from login where username =  'fsd';";
    var connection = mysql.createConnection(connString);
    console.log("Query: " + sql);
    connection.query(sql, [req.params.username, req.params.password], function (err, rows, fields) {
        connection.end();
        if (!err) {
            res.json(rows);
            console.log("Login success");
            res.end();
        } else {
            console.log('Login error');
            console.log(err);
        }
    });
});
//API
//Insert specials
app.post('/registrarse/:username/:password', function (req, res) {
    console.log("Registrarse: " + req.params.username + " " + req.params.password);
    //  var sql = "select * ' from registrarse req.params.username + 'and password ;";
    var sql = "insert into login (username, password) values (?, ?)";
    var connection = mysql.createConnection(connString);
    console.log("Query: " + sql);
    connection.query(sql, [req.params.username, req.params.password], function (err, rows, fields) {
        connection.end();
        if (!err) {
            res.json(rows);
            console.log("Insert INTO login success");
            res.end();
        } else {
            console.log('Error registering: ' + err)
        }
    });
});
//API
//Insert specials
app.post('/user_profile', function (req, res) {
    console.log("User Profile: " + req.body.username);
    //  var sql = "select * ' from registrarse req.params.username + 'and password ;";
    var sql = "insert into owner_profile (username, first_name, last_name, age, sex, phone, ext, cellular, address) values (?,?,?,?,?,?,?,?,?)"; //cambiar info q sea con los nombrres de la base de datos
    var connection = mysql.createConnection(connString);
    console.log("Query: " + sql);
    connection.query(sql, [req.body.username, req.body.name, req.body.lastname, req.body.age, req.body.sex, req.body.phone, req.body.ext, req.body.cel, req.body.postal], function (err, rows, fields) {
        connection.end();
        if (!err) {
            res.json(rows);
            console.log("Insert INTO owner_profile success");
            res.end();
        } else console.log(err);
    });
});

//LE MUESTRA AL ADMIN LOS USUARIOS
app.get('/adminViewUsers/', function (req, res) {

    console.log("ver users el admin: ");
    var sql = "select * from users";
    var connection = mysql.createConnection(connString);
    console.log("Query: " + sql);
    connection.query(sql, function (err, rows, fields) {
        connection.end();
        if (!err) {
            res.json(rows);
            console.log("select from users tables success");
            res.end();
        } else {
            console.log('Login error');
            console.log(err);
        }
    });
});



//LE MUESTRA AL ADMIN un RIVER en especifico
app.get('/adminViewRiver/', function (req, res) {

    console.log("ver river en especifico admin: ");
    //  SELECT * FROM pet WHERE name = 'Bowser';
    var sql = "select * from river where name = ''";
    var connection = mysql.createConnection(connString);
    console.log("Query: " + sql);
    connection.query(sql, function (err, rows, fields) {
        connection.end();
        if (!err) {
            res.json(rows);
            console.log("select from river uno en especifico");
            res.end();
        } else {
            console.log('Login error');
            console.log(err);
        }
    });
});

//API
//Insert specials --------------------------------------------CONTACTANOS
app.post('/contactanos/:name/:lastname/:email/:message', function (req, res) {
    console.log("Contactanos: ");
    //  var sql = "select * ' from registrarse req.params.username + 'and password ;";
    var sql = "insert into contactanos(name, lastname, email, message) values (?,?,?,?)";
    var connection = mysql.createConnection(connString);
    console.log("Query: " + sql);
    connection.query(sql, [req.body.name, req.body.lastname, req.body.email, req.body.message], function (err, rows, fields) {
        connection.end();
        if (!err) {
            res.json(rows);
            console.log("Insert INTO contactanos success");
            res.end();
        } else console.log('');
        console.log(err);
    });
});


// ADMIN BORRAR USER--------------------------------------------------------------------------------------------
app.delete('/borrar', function (req, res) {

       var sql = "DELETE from user where users = ?";
    var connection = mysql.createConnection(connString);
    console.log("Query: " + sql);
    connection.query(sql, function (err, rows, fields) {
        connection.end();
        if (!err) {
            res.json(rows);
            console.log("delete de tabla de users");
            res.end();
        } else {
            console.log('delete de tabla de users: ' + err)

        }
    });
});


app.get('/getAllUsers/:username', function (req, res) {

    console.log("ver empresarios admin: ");
    //cambiar los nombres a los correctos de la DB
    var sql = "SELECT * FROM business_profile left JOIN help ON business_profile.name= help.business WHERE business_profile.username = ?";
    var connection = mysql.createConnection(connString);
    console.log("Query: " + sql);
    connection.query(sql, req.params.username, function (err, rows, fields) {
        connection.end();
        if (!err) {
            res.json(rows);
            console.log("select from business profiles success");
            res.end();
        } else {
            console.log('Login error');
            console.log(err);
        }
    });
});





//USER MODIFICA PERFIL ------------------------------------------------------------------------------------------------------
app.put('/user_editar', function (req, res) {
    console.log("Editar Owner Profile: " + req.body.username);
   //cambiar nombres a los de la base de datos
    var sql = "UPDATE owner_profile set username = ?, first_name =?, last_name=?, age=?, sex=?, phone=?, ext=?, cellular=?, address=? where username = ?, first_name =?, last_name=?, age=?, sex=?, phone=?, ext=?, cellular=?, address=?";
    var connection = mysql.createConnection(connString);
    console.log("Query: " + sql);
    connection.query(sql, [req.body.username, req.body.name, req.body.lastname, req.body.age, req.body.sex, req.body.phone, req.body.ext, req.body.cel, req.body.postal], function (err, rows, fields) {
        connection.end();
        if (!err) {
            res.json(rows);
            console.log("Insert INTO edit_profile success");
            res.end();
        } else console.log(err);
    });
});


//conexion servidor -------------------------------------------------------------------------------------------------------
app.listen(3000, function () {
    console.log('Listening on port 3000!');
});