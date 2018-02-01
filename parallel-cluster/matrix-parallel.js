var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

// var matrixA = [
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// ];
// var matrixB = [
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

function matrixGenerator(size, val) {
  var arr = new Array()
  var arrv = new Array();

  for (var j = 0; j < size; j++) {
    arrv.push(val);
  }

  for (var i = 0; i < size; i++) {
    arr.push(arrv);
  }

  return arr;
}

function matrixMultiplication(a, b) {
  var c = new Array();

  for (var i = 0; i < a.length; i++) {
    c.push(new Array());
  }

  for (var i = 0; i < c.length; i++) {
    for (var j = 0; j < a.length; j++) {
      for (var k = 0; k < b.length; k++) {
        //console.log('a' + ' row : ' + j + ' column : ' + k + ' value : ' + a[j][k]);
        //console.log('b' + ' row : ' + k + ' column : ' + i + ' value : ' + b[k][i]);

        if (typeof c[j][i] == 'undefined') {
            c[j][i] = 0;
        }

        c[j][i] = c[j][i] + ( a[j][k] * b[k][i] );

        //console.log('c' + ' row : ' + i + ' column : ' + j + ' value : ' + c[j][i]);
      }
    }
  }

  return c;
}

function matrixAddition(a, b) {

  var arr = new Array;
  var len = a.length;

  for (var i = 0; i < len; i++) {
    arr.push(new Array());
    for (var j = 0; j < len; j++) {
      arr[i][j] = a[i][j] + b[i][j];
    }
  }

  return arr;
}

function divideMatrix(num, matrix) {

  var arr = new Array();
  var matSize = matrix.length / 2

  for (var i = 0; i < matSize; i++) {
    arr.push(new Array());
  }

  for (var i = 0; i < matSize; i++) {
    for (var j = 0; j < matSize; j++) {

      if (num == 1) {
          arr[i][j] = matrix[i][j];
      }

      if (num == 2) {
          arr[i][j] = matrix[i][j + matSize];
      }

      if (num == 3) {
          arr[i][j] = matrix[i + matSize][j];
      }

      if (num == 4) {
          arr[i][j] = matrix[i + matSize][j + matSize];
      }
    }
  }

  return arr;
}

function assemblyMatrix(res) {

  var arr = new Array();
  var blockSize = res[0].matrix.length;

  for (var i = 0; i < blockSize * 2; i++) {
    arr.push(new Array());
  }

  var temp = new Array();

  //change format
  for (var i = 0; i < res.length; i++) {
    temp[res[i].position] = res[i].matrix;
  }

  for (var i = 0; i < blockSize; i++) {
    arr[i] = temp[1][i].concat(temp[2][i]);
    arr[i + blockSize] = temp[3][i].concat(temp[4][i]);
  }

  return arr;
}

if (cluster.isMaster) {

  var matrixA = matrixGenerator(5000,1);
  var matrixB = matrixGenerator(5000,1);

  console.log('matrix generated');

  var startDate = new Date();
  var collectedResult = new Array();

  // distribute the component into 4
  for (var i = 0; i < numCPUs; i++) {
    var worker = cluster.fork();

    worker.send({'matrixA' : matrixA, 'matrixB' : matrixB, 'position' : i + 1});
    worker.on('message', function(msg) {
      collectedResult.push(msg);

      if (collectedResult.length == numCPUs) {
        console.log(assemblyMatrix(collectedResult));
        var endDate   = new Date();
        var ms = (endDate.getTime() - startDate.getTime());
        console.log(ms);
      }

    });
  }
}

if (cluster.isWorker) {
  process.on('message', function(msg) {

    // multiply accordingly
    // position hardcoded

    var pos1A = divideMatrix(1, msg.matrixA);

    var pos2A = divideMatrix(2, msg.matrixA);
    var pos3A = divideMatrix(3, msg.matrixA);
    var pos4A = divideMatrix(4, msg.matrixA);

    var pos1B = divideMatrix(1, msg.matrixB);
    var pos2B = divideMatrix(2, msg.matrixB);
    var pos3B = divideMatrix(3, msg.matrixB);
    var pos4B = divideMatrix(4, msg.matrixB);

    var result = 0;

    if (msg.position == 1) {
      result = matrixAddition(matrixMultiplication(pos1A, pos1B), matrixMultiplication(pos2A, pos3B));
    }

    if (msg.position == 2) {
      result = matrixAddition(matrixMultiplication(pos1A, pos2B), matrixMultiplication(pos2A, pos4B));
    }

    if (msg.position == 3) {
      result = matrixAddition(matrixMultiplication(pos3A, pos1B), matrixMultiplication(pos4A, pos3B));
    }

    if (msg.position == 4) {
      result = matrixAddition(matrixMultiplication(pos3A, pos2B), matrixMultiplication(pos4A, pos4B));
    }

    process.send({'matrix' : result , 'position' : msg.position});
  });
}
