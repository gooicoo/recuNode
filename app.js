// framework express
var express = require('express');
// bodyparser ens permet processar variables GET i POST
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// per renderitzar les plantilles (render)
app.set('view engine','ejs');

var mongo = require('mongodb').MongoClient;
var mongoClient;



// connexió a mongo i start app
var mongo = require('mongodb').MongoClient;
require('dotenv').config();
var mongoClient;
// consts
const PORT = process.env.PORT || 5000
const user = encodeURIComponent( process.env.DBUSER );
const pass = encodeURIComponent( process.env.DBPASS );
var dbConStr = "mongodb+srv://"+user+":"+pass+"@cluster0-bmodt.mongodb.net";
mongo.connect( dbConStr, function( err, _client ) {
    // si no ens podem connectar, sortim
    if( err ) throw err;
    mongoClient = _client;
    // si no hi ha cap error de connexió, engeguem el servidor
    app.listen(PORT, function () {
        console.log('Example app listening on http://localhost:'+PORT+' !');
    });
});


app.get('', function (req, res) {
    res.render('selecOpcion')
});

app.get('/restaurantes', function (req, res) {
  res.render('restaurantes');
});

app.post('/restaurantes', function (req, res) {
  var db = mongoClient.db("RestaurantDB");
  var nom = req.body.name;
  var direccio = req.body.location;
  var telefon = req.body.phone;
  var cp= req.body.cp;

  var restaurantObj = { name: nom, location: direccio, pnumber: telefon, cp: cp };
  db.collection("Restaurant").insertOne(restaurantObj, function(err, result) {
    if (err) {
        res.render("result",{msg:"restNoAdd"});
        return;
    }else{
        res.render("result",{msg:"restSiAdd"});
    }
  });
});

app.get('/listadoRestaurantes', function (req, res) {
  // var db = mongoClient.db("RestaurantDB");
  // results = db.collection("Restaurant").find().toArray();
  // res.render('listadoRestaurantes', results )

      var dbo = mongoClient.db("RestaurantDB");
      dbo.collection("Restaurant").find().toArray(function(err, results){
        res.render("listadoRestaurantes", { result: results });
      });


});
