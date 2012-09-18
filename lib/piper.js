var events   = require('events'),
		util     = require('util'),
		parseUrl = require('url').parse,
		request  = require('request');

function Piper(options) {
	events.EventEmitter.call(this);

	this._target = (options && options.target)? options.target : 'http://localhost';
	this._source = (options && options.source)? options.source : 'http://example.com';
	this._name = (options && options.name)? options.name : 'file';

	this._start();
}

util.inherits(Piper, events.EventEmitter);

Piper.prototype._start = function() {
	this.bytesSubmitted = 0;
	this.totalBytes     = 0;

	this._createPipe();
};

Piper.prototype._createPipe = function() {
	var self = this;
	this.pipe = request(this._source);
	this.pipe.on('error', this._errorHandler());
	this.pipe.on('response', function(response) {
		if(response && response.headers && response.headers['content-length']) {
			self.totalBytes = response.headers['content-length'];
		}
		self._startRequest();
	});

	this.request = request.post(this._target, function(err, res, body) {
		self.emit('complete', err, res, body);
	});

	this.request.on('error', this._errorHandler());

	this.form = this.request.form();
	this.form.append(this._name, this.pipe);
};

Piper.prototype._startRequest = function() {
	var self = this;

	this.form.on('data', function(chunk) {
		self.bytesSubmitted += chunk.length;
		if(self.totalBytes) {
			self.emit('progress', ((self.bytesSubmitted-self.form.dataSize)/self.totalBytes)*100);
		}
	});
};

Piper.prototype._errorHandler = function() {
	var self = this;
	return function(err) {
		self.emit('error', err);
	};
};

module.exports = Piper;