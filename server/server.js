const express = require('express');
const app = express();
const cors = require('cors');
const db = require("./dbconnection.js");

app.use(express.urlencoded({extended: false}))
app.use(cors());
app.use(express.json())


app.get('/', function(req,res){
    res.send("Server");
})

app.post('/register', function(req,res){
   res.status(200).send('Success');
   const data = req.body;
   console.log(data);
   const username = data.username;
   const password = data.password;
   const name = data.name;
   const surname = data.surname;
   const email = data.email;

   db.getConnection(function(err, connection) {
    if (err) {
        connection.release();
          console.log(' Error getting mysql_pool connection: ' + err);
          throw err;
      }
   db.query(
       "INSERT INTO users VALUES(?, ?, ?, ?, ?)",
       [username, password, name, surname, email],
       (err, result) => {
           if(err){
           console.log(err);
           }
       }
   );
   connection.release();
    });
})


app.post('/makeOrder', function(req,res){
    res.status(200).send('Success');
    const data = req.body;
    const {id, client, date, short_name, description, type, company, model, phone} = data;
 
    db.getConnection(function(err, connection) {
     if (err) {
         connection.release();
           console.log(' Error getting mysql_pool connection: ' + err);
           throw err;
       }
    db.query(
        "INSERT INTO orders VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [id, client, short_name, date, description,type,model,company, phone, false],
        (err, result) => {
            if(err){
            console.log(err);
            }
        }
    );
    connection.release();
     });
 })


app.get('/orderList/:username', function(req,res){
    res.setHeader("Content-Type", "application/json");

    const query = req.params.username == 'admin' ?  `SELECT * FROM orders;` : `SELECT * FROM orders where name = "${req.params.username}";`;

    db.getConnection(function(err, connection) {
        if (err) {
            connection.release();
              console.log(' Error getting mysql_pool connection: ' + err);
              throw err;
          }
       db.query(
           query,
           (err, result) => {
               if(err){
               throw err;
               }else{
               res.status(200).send(result);
               }
           }
       );
       connection.release();
        });
})


app.get('/register', function(req,res){
    res.setHeader("Content-Type", "application/json");

    const query = "SELECT * FROM users;";

    db.getConnection(function(err, connection) {
        if (err) {
            connection.release();
              console.log(' Error getting mysql_pool connection: ' + err);
              throw err;
          }
       db.query(
           query,
           (err, result) => {
               if(err){
               throw err;
               }else{
               res.status(200).send(result);
               }
           }
       );
       connection.release();
        });
})


app.put('/orderList/:username', function(req,res){
    res.setHeader("Content-Type", "application/json");
    const data = req.body;
    const {isReady, username} = data;

    db.getConnection(function(err, connection) {
        if (err) {
            connection.release();
              console.log(' Error getting mysql_pool connection: ' + err);
              throw err;
          }
       db.query(
           `UPDATE orders SET isReady = ${isReady} WHERE name = "${username}";`,
           (err, result) => {
               if(err){
               throw err;
               }else{
               res.status(200).send(result);
               }
           }
       );
       connection.release();
        });
})


/*Send single start-up data*/
// app.get('/startUpItem/:id', function(req,res){
//     res.setHeader("Content-Type", "application/json");

//     db.getConnection(function(err, connection) {
//         if (err) {
//             connection.release();
//               console.log('Error getting mysql_pool connection: ' + err);
//               throw err;
//           }
//        db.query(
//            `SELECT * FROM startups WHERE startups.id = '${req.params.id}';`,
//            (err, result) => {
//                if(err){
//                throw err;
//                }else{
//                res.status(200).send(result);
//                }
//            }
//        );
//        connection.release();
//         });
// })
/*Send single start-up data*/


app.listen(process.env.PORT || 5000, function(){
    console.log('Server is listening...');
})


