var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Hello world from single cluster');
})

app.listen(3001);
console.log('single no cluster');
