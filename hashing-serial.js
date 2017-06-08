var http = require('http');

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

var tb1 = new hashTable();
var tb2 = new hashTable();
var tbsize = 600;
var rangeInput = 100000;
var inputVal = generateInputValue(rangeInput, false, 500000, 10000000);
//var inputVal = [20, 50, 53, 75, 100, 67, 105, 3, 36, 39, 6];

console.log('Serial Hashing');
console.log('=================================================');
console.log('Number of insertion : ' + rangeInput);
console.log('=================================================');
console.log('Waiting for hash to be completed...');

var startDate = new Date();
for (var i = 0; i < inputVal.length; i++) {
   serialCuckoo(tb1, tb2, inputVal[i]);
}

console.log('Hashing done');
console.log('=================================================');
console.log('Filled table 1: ' + tb1.keys.length);
console.log('Filled table 2: ' + tb2.keys.length);
var endDate   = new Date();
var ms = (endDate.getTime() - startDate.getTime());

console.log('Time used: ' + (ms/1000) + ' secs');
