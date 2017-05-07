var http = require('http');

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

var tb1 = new hashTable();
var tb2 = new hashTable();


// server request responded
http.Server((req, res) => {
  res.writeHead(200);
  res.end('table1 size = ' + tb1.length + ' table2 size = ' + + tb2.length);

  console.log('table1 size = ' + tb1.length + ' table2 size = ' + + tb2.length);

  var valGen = generateRandomValue();
  parallelCuckoo(tb1, tb2, valGen);

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

  }
  // notify master about the request
}).listen(3000);
