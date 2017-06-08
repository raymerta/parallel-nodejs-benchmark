# parallel-nodejs-benchmark

## Abstract

In recent years, Node.js server has gained increasing popularity as a web server due to its configuration simplicity and capability to handle high traffic web applications. A single instance of Node.js runs in a single thread but it is also capable of taking advantage of multi-core systems by creating child processes using Node JS Cluster module.

In this work we demonstrate this parallel capability of the Node JS Cluster module by building hash tables using Parallel Cuckoo Hashing algorithm. Hash table creation in web applications, so far, has been a common way to store data from the database query or from other sources.Hash table data structure enables easier and faster data access by the web application. Usually, Cuckoo hashing is used to resolve collision from hash table insertion by evicting conflicting values and moving them to other hash tables. It’s very easy to implement and quite efficient in practice.

Produced results from this implementation shows that a hash table that is built using Parallel Cuckoo Hashing can be built at a rate of around 0.28 - 1,64 times faster than its serial implementation. It depends on the size of data inserted. The bigger the data size, the more
effective it gets. Its performance is also affected by number of cores on the system. The effective number of child processes that can be created follows the number of cores on the system.

## Background

-- nodejs increasing usage popularity in high traffic website
-- have simple configuration compared to nginx for high traffic website

## Cluster module


## Cuckoo hashing

Cuckoo hashing is a simple collision resolution in hash table.
Method tbd

## Testing method

### number of requests handled - tbd

-- install siege

### memory consumed - tbd

-- install PM2

### time needed to produce n size hash table

-- TODO : compare n hash table size with time needed

### sample result

```
PARALLEL HASHING
=================================================
Platform: linux
Number of CPUs : 4
	Model: Intel(R) Core(TM) i5-6200U CPU @ 2.30GHz
	Speed: 1861MHz
	Times:
		user: 7019.6 secs
		nice: 45.2 secs
		sys: 1188.8 secs
		idle: 63997.8 secs
		irq: 0 secs
	Model: Intel(R) Core(TM) i5-6200U CPU @ 2.30GHz
	Speed: 2392MHz
	Times:
		user: 6838.7 secs
		nice: 8.4 secs
		sys: 1196.4 secs
		idle: 64345 secs
		irq: 0 secs
	Model: Intel(R) Core(TM) i5-6200U CPU @ 2.30GHz
	Speed: 2417MHz
	Times:
		user: 6931.3 secs
		nice: 4.8 secs
		sys: 1319.8 secs
		idle: 63663.4 secs
		irq: 0 secs
	Model: Intel(R) Core(TM) i5-6200U CPU @ 2.30GHz
	Speed: 2698MHz
	Times:
		user: 5826 secs
		nice: 82.8 secs
		sys: 1247.7 secs
		idle: 65084.3 secs
		irq: 0 secs
=================================================
Cluster is Master. start to create child process
Number of insertion : 100000
=================================================
Waiting for hash to be completed...
Hashing done
=================================================
Filled table 1: 100000
Filled table 2: 0
Time used: 62.545 secs
```

## Conclusion

-- tbd


## How to run
-- install node js https://nodejs.org/en/download/ if you don't have any
-- if you have node on your computer, 'npm install create-node-module'
-- run parallel code : node hashing-parallel.js
-- run serial code : node hashing-serial.js


# Matrix Multiplication

## How to run :
-- 'node matrix-parallel.js' to run parallel matrix multiplication
-- 'node matrix-serial.js' to run serial matrix multiplication
-- to specify matrix size, find variable matrixA and matrixB, change size and value in matrixGenerator method
-- number of times needed written in the terminal

# TO DO LIST
-- print out hash table result
-- try web IO measurement
-- set input for node js console for easier testing https://nodejs.org/api/readline.html
