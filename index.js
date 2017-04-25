var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
//var numCPUs = 3;

if (cluster.isMaster) {
  console.log('this is master');
  for (var i = 0; i < numCPUs; i++) {
    console.log('forking number: ' + i);
    cluster.fork();
  }

} else {

  var express = require('express');
  var app = express();

  app.get('/', function(req, res) {
    res.send('Hello from ' + cluster.worker.id);
  })

  app.listen(3000);
  console.log('worker %d running', cluster.worker.id);
}
