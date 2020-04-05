// mysql://bb0380b28b7a16:01e2429c@us-cdbr-iron-east-01.cleardb.net/heroku_f74e2220185cbc5?reconnect=true
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const port = process.env.PORT || 5000;

const app = express();

console.log("server started");

const db_config = {
  host: "us-iron-auto-dca-01-b-bh.cleardb.net",
  user: "b274c165001cb4",
  password: "ad1f9f41",
  database: "heroku_66d409414a572d7"
}

var con

app.use(cors());

app.get('/', (req, res) => {
  res.send('true - server is up and running call to in order to gather data')
})

function handleDisconnect() {
  con = mysql.createConnection(db_config);


con.connect(function(err){
  if(err){
    console.log('Error connecting to DB', err);
    setTimeout(handleDisconnect, 2000);
  }
  console.log('Connection established');
});

// grab user data
app.get('/user', (req, res) => {
  con.query('SELECT * FROM user;', (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : result
      })
    }
  });
});

con.on('error', function(err) {
  console.log('db error', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
    handleDisconnect();                         // lost due to either server restart, or a
  } else {                                      // connnection idle timeout (the wait_timeout
    throw err;                                  // server variable configures this)
  }
});
}

app.listen(port, () => {
  console.log(port);
});

handleDisconnect();