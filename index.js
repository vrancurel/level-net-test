'use strict'; // eslint-disable-line

var Bucket = 'bar';

const arsenal = require('arsenal');
const werelogs = require('werelogs');
const async = require('async');

const logger = new werelogs.Logger('LevelClientTest');

const dbClient = new arsenal.network.level.LevelDbClient({
    url: "http://10.100.1.19:9990/MDFile/metadata",
    logger: logger,
    //callTimeoutMs: 
});

var start = process.hrtime();

var elapsed_time = function(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}

dbClient.connect(() => {
    console.log('done');
    const db = dbClient.openSub('bar2');
    elapsed_time('starting');
    async.timesLimit(100000, 50, function(n, next) {
	var keyName = n
	var key = `${keyName}`;
	var metadata = {};
	metadata.color = 'blue';
	metadata.someOtherKey = `someOtherMetadata${keyName}`;
	db.put(key, JSON.stringify(metadata), null, (err, data) => {
            console.log('createdKey# ', key);
            next(err);
	});
    }, function(err) {
	if(err) {
	    return console.log("err!", err)
	}
	elapsed_time('done putting objects')
    });
});
