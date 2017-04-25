var cluster = require('cluster');
var http = require('http');
//var numCPUs = require('os').cpus().length;
var numCPUs = 2;


// generate hash table
function hashTable(obj) {
  this.length = 0;
  this.items = {};

  //parse bulk object
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      this.items[p] = obj[p];
      this.length++;
    }
  }

  // return result from the key
  this.hasItem = function(key) {
    return this.items.hasOwnProperty(key);
  }

  this.setItem = function(key, value) {
    if (this.hasItem(key)) {

    } else {
        this.length++;
    }

    this.items[key] = value;
  }

  this.getItem = function(key) {
    if (this.hasItem(key)) {
      return this.items[key];
    } else {
      return false;
    }
  }

  this.removeItem = function(key) {
    if (this.hasItem(key)) {
      this.length--;
      delete this.items[key];
      return true;
    } else {
      return false;
    }
  }

  this.keys = function() {
    var keys = [];
    for (var k in this.items) {
      if (this.hasItem(k)) {
        keys.push(k);
      }
    }
    return keys;
  }

  this.values = function() {
    var values = [];
    for (var v in this.items) {
      if (this.hasItem(v)) {
        values.push(this.items[k]);
      }
    }
    return values;
  }
}

function generateRandomValue() {
  var limit = 10000000;
  return Math.floor(Math.random() * limit);
}

//start cluster
if (cluster.isMaster) {
  var numReqs = 0;

  var hashTable1 = new hashTable();
  var hashTable2 = new hashTable();

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  setInterval(() => {
    console.log('table1 size = ' + hashTable1.length + ' table2 size = ' + + hashTable2.length);
  }, 3000);

  for (const id in cluster.workers) {

    cluster.workers[id].on('message', function(msg) {

      if (msg.topic && msg.topic == 'request') {
        // distribute latest table
        cluster.workers[id].send({
          topic : 'table',
          from : 'master',
          table1 : hashTable1,
          table2 : hashTable2
        });
      }

      if (msg.topic && msg.topic === 'numgenerated') {
        //numReqs += 1;

        hashTable1 = new hashTable(msg.table1.items);
        hashTable2 = new hashTable(msg.table2.items);
        //console.log('table1 size = ' + hashTable1.length);
      }
    });
  }

  // revive dead worker
  cluster.on('exit', function(worker) {
    console.log('worker %d dead', worker.id);
    cluster.fork();
  });

} else {

  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    var valGen = generateRandomValue();

    process.send({
      from : 'worker',
      workerId : cluster.worker.id,
      topic : 'request',
    });

    process.on('message', function(msg) {

      if (msg.topic && msg.topic === 'table') {
        //numReqs += 1;
        var tb1 = new hashTable(msg.table1.items);
        var tb2 = new hashTable(msg.table2.items);

        //res.end('<pre>' + tb1.items + '</pre>');

        parallelCuckoo(tb1, tb2, valGen);
      }

    });

    function parallelCuckoo(tb1, tb2, valGen) {

      //1. sha1
      //2. sha256
      //3. sha224
      //4. sha512
      //5. sha384

      var valEn1 = require("crypto").createHash('sha1').update(valGen.toString()).digest('hex');
      var valEn2 = require("crypto").createHash('sha256').update(valGen.toString()).digest('hex');

      //check if empty

      if (tb1.hasItem(valEn1)) {
        if (tb1.getItem(valEn1) == valGen) {
          //console.log('duplicate value');
        } else {
          if (tb2.hasItem (valEn2)) {
            if (tb2.getItem(valEn2) == valGen) {
              //console.log('duplicate value');
            } else {
              var valEn3 = require("crypto").createHash('sha224').update(valGen.toString()).digest('hex');
              var temp = tb1.getItem(valEn1);
              tb1.setItem(valEn1, valGen);
              var temp2 = tb2.getItem(valEn2);
              tb2.setItem(valEn2, temp);

              if (tb1.hasItem(valEn3)) {
                console.log('collision');
              } else {
                tb1.setItem(valEn3, temp2);
              }
            }

          } else {
            var temp = tb1.getItem(valEn1);
            tb1.setItem(valEn1, valGen);
            tb2.setItem(valEn2, temp);
          }
        }
      } else {
        tb1.setItem(valEn1, valGen);
      }

      process.send({
        from : 'worker',
        workerId : cluster.worker.id,
        topic : 'numgenerated',
        table1 : tb1,
        table2 : tb2
      });

    }
    // notify master about the request
  }).listen(3000);
}
