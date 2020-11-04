const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();
const path = require('path');
const mysql = require('mysql');
var con = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'hotel-api',
})
var pool        = mysql.createPool({
   connectionLimit : 10, // default = 10
   host            : 'localhost',
   user            : 'root',
   password        : '',
   database        : 'hotel-api'
});

// Silnik
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname,'frontend'));
app.set('view engine','ejs');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('public'));

app.get('/', function(req, res){    
   res.render('index');
});


app.post('/', function(req, res){
   pool.getConnection(function (err, connection) {
      if (err) throw err;
      console.log("Połączono z bazą!");
      var zapytanie = `SELECT COUNT(*) AS wolne_wybrane FROM lista_pokoi WHERE zajety=0 and ilu_osobowy=${req.body.iluosobowy}`;
      con.query(zapytanie, function (err, result) {
        con.escape();
        if (err) throw err;
        res.render('wynik',{
        ilosc:result[0].wolne_wybrane
        });
      });
   });
});
app.listen(3000)


