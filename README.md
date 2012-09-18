## USAGE

	var Piper = require('./piper.js');

	var test = new Piper({
		source: 'http://cachefly.cachefly.net/100mb.test', // SOURCE FILE
		target: 'http://localhost:8080/debug', // TARGET ENDPOINT
		name: 'upload', // NAME OF THE UPLOAD FIELD (defaults to file)
		debug: function(msg) {} // debug log caller (optional)
	});


	test.on('error', function(err) {
		console.log('error', errr);
	});


	test.on('progress', function(percentage) {
		console.log('progress (%) ', percentage);
	});

	test.on('complete', function(err, response, body) {
		if(!err) {
			console.log('response', body);
		} else {
			console.log('error', err);
		}
	});