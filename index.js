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
   multipleStatements: true
})
var pool        = mysql.createPool({
   connectionLimit : 10, // default = 10
   host            : 'localhost',
   user            : 'root',
   password        : '',
   database        : 'hotel-api',
   multipleStatements: true
});

// Data
var dataTeraz = new Date();
var dd = String(dataTeraz.getDate()).padStart(2, '0');
var mm = String(dataTeraz.getMonth() + 1).padStart(2, '0'); // Styczeń = 0
var yyyy = dataTeraz.getFullYear();

dataTeraz = dd + '/' + mm + '/' + yyyy;



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
   if (req.body.od_kiedy < dataTeraz || req.body.do_kiedy < dataTeraz) {
      res.render('error',{
         info: "Podano błędną date!",
         od_kiedy: req.body.od_kiedy,
         do_kiedy: req.body.do_kiedy,
         aktualnadata: dataTeraz,
      })
      return
   }
   pool.getConnection(function (err, connection) {
      if (err) throw err;
      console.log("Otwarto połączenie");
      var zapytanie = `SELECT COUNT(*) AS wolne_wybrane FROM lista_pokoi WHERE zajety=0 and ilu_osobowy=${req.body.iluosobowy};`;
      //var zapytanie2 = `SELECT COUNT(*) AS zajete_wybrane FROM lista_pokoi WHERE zajety=1 and ilu_osobowy=${req.body.iluosobowy};`;
      con.query(zapytanie, function (err, result) {
        if (err) throw err;
        console.log(`Wykonano zapytanie ${zapytanie}`)
        res.render('wynik',{
         ilosc:result[0].wolne_wybrane,
         ilosc_zajetych:result[0].zajete_wybrane,
         ilosc_osob:req.body.iluosobowy,
         od_kiedy:req.body.od_kiedy,
         do_kiedy:req.body.do_kiedy,
        });
        con.escape();
        console.log('Zamknięto połączenie z bazą danych.')
      });
   });
});
app.listen(3000)


