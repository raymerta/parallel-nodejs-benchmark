var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

// generate hash table
function hashTable(obj) {
  this.length = 0;
  this.items = {};
  this.keys = [];
  this.values = [];

  //parse bulk object
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      this.items[p] = obj[p];
      this.length++;
      this.keys.push(p);
      this.values.push(obj[p]);
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

    if (this.keys.indexOf(key) < 0) {
      this.keys.push(key);
    }

    if (this.values.indexOf(value) < 0) {
      this.values.push(value);
    }
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
}

function generateInputValue(size, isRandom, start, stop) {
  var arr = new Array();

  if (isRandom) {
    for (var i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * (stop - start)) + start);
    }
  } else {
    for (var i = start; i < (size + start); i++) {
      arr.push(i + 1);
    }
  }

  return arr;
}

// hash function table 1
function hash1(val) {
  var con = 104729;
  return parseInt(val % con);
}

// hash function table 2
function hash2(val) {
  var con = 104729;
  return parseInt((val / con) % con);
}

function serialCuckoo(table1, table2, val) {
  var currVal = val;

  var inserted = false;
  var currTb = 1;
  var attempt = 0;
  var cyclic = false;

  while (inserted == false && cyclic == false && attempt < 50) {
    var h1 = hash1(currVal);
    var h2 = hash2(currVal);

    if (currTb == 1) {
      if (table1.hasItem(h1)) {
        var temp = table1.getItem(h1);
        table1.setItem(h1, currVal);
        currVal = temp;
        currTb = 2;
      } else {
        table1.setItem(h1, currVal);
        inserted = true;
      }

    } else {
      if (table2.hasItem(h2)) {
        var temp = table2.getItem(h2);
        table2.setItem(h2, currVal);
        currVal = temp;
        currTb = 1;
        if (currVal == val) {
          cyclic = true;
          //console.log('cyclic');
        }
      } else {
        table2.setItem(h2, currVal);
        inserted = true;
      }
    }

    attempt++;
  }

}

function combineResolveHash(res) {
  var tb1 = new hashTable(res[0].table1.items);
  var tb2 = new hashTable(res[0].table2.items);

  var col = new Array();

  for (var i = 1; i < res.length; i++) {
    var t1 = new hashTable(res[i].table1.items);
    for (var j = 0; j < t1.keys.length; j++) {
      if (tb1.keys.indexOf(t1.keys[j]) > -1) {
        col.push(t1.getItem(t1.keys[j]));
      } else {
        tb1.setItem(t1.keys[j], t1.getItem(t1.keys[j]));
      }
    }

    var t2 = new hashTable(res[i].table2.items);
    for (var j = 0; j < t2.keys.length; j++) {
      if (tb2.keys.indexOf(t2.keys[j]) > -1) {
        col.push(t2.getItem(t2.keys[j]));
      } else {
        tb2.setItem(t2.keys[j], t2.getItem(t2.keys[j]));
      }
    }
  }

  // resolve collision if any
  for (var i = 0; i < col.length; i++) {
    serialCuckoo(tb1, tb2, col[i]);
  }

  console.log('table1 size: ' + tb1.keys.length);
  console.log('table2 size: ' + tb2.keys.length);
  //console.log('cyclic value: ' + (tbsize - tb2.keys.length - tb1.keys.length));

}

//start cluster
if (cluster.isMaster) {
   var inputVal = generateInputValue(1000000, false, 50000, 20000000);
   var generatedValue = 0;
   var collectedResult = new Array();

   var startDate = new Date();
   for (var i = 0; i < numCPUs; i++) {
     var worker = cluster.fork();
     worker.send({'input' : inputVal, 'position' : i, 'total' : numCPUs});
     worker.on('message', function(msg) {
       collectedResult.push(msg);

       if (collectedResult.length == numCPUs) {
         combineResolveHash(collectedResult);
         var endDate   = new Date();
         var ms = (endDate.getTime() - startDate.getTime());
         console.log(ms)
       }
     });
   }

   // resolver
}

if (cluster.isWorker) {
  process.on('message', function(msg) {

    var size = Math.ceil(msg.input.length / msg.total);
    var start = msg.position * size;
    var stop = start + size;

    if (stop > msg.input.length) {
      stop = msg.input.length;
    }

    var tb1 = new hashTable();
    var tb2 = new hashTable();

    for (var i = start; i < stop; i++) {
      serialCuckoo(tb1, tb2, msg.input[i]);
    }

    process.send({'table1' : tb1, 'table2' : tb2});

  });
}
