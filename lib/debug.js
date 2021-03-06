module.exports = require('bdsft-sdk-model')(Debug, {
	config: require('../js/config')
})

var utils = require('bdsft-sdk-utils');
var debug = require('debug');
var enabled = {};
var levels = {
	debug: 0,
	log: 1,
	info: 2,
	warn: 3,
	error: 4
};
function Debug(options) {
	var self = {};
	options = options || {};
	var id = options && options.id || 'bdsft';

	if(!options.name) {
		throw Error('no name : '+id);
	}
	var prefix = options.name + ':' + id;
	var debugObj;

	self.init = function(){
		var logPrefix = self.names;
		if(logPrefix+'' === 'true') {
			logPrefix = '*'
		}

		if (logPrefix) {
			enabled[id] = utils.withArray(logPrefix).map(function(a){
				return a + ':' + id;
			});
		} else {
			delete enabled[id];
		}
		updateEnabled();

		debugObj = debug(prefix);
	};

	var printMsg = function(level, msg) {
		if(self.level && levels[level] >= levels[self.level]) {
			if(level === 'error'){
				debugObj.color = 1;
			}
			else if(level === 'warn'){
				debugObj.color = 3;
			}
			else if(level === 'debug'){
				debugObj.color = 4;
			}
			else if(level === 'log'){
				debugObj.color = 2;
			}
			else if(level === 'info'){
				debugObj.color = 5;
			}
			
			if(!console[level]) {
				debugObj.log = console['info'].bind(console);
			} else {
				debugObj.log = console[level].bind(console);
			}
			self.print(msg);
		}
	}
	self.print = function(msg) {
		if(self.usedate) {
			var now = new Date();
			var month = now.getMonth()+1;
			var day = now.getDate();
			var hours = now.getHours();
			var minutes = now.getMinutes();
			var seconds = now.getSeconds();
			var dateStr = (month < 10 ? '0'+month : month ) + '/' + (day < 10 ? '0'+day : day) + ' ' + 
			(hours < 10 ? '0'+hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0'+seconds : seconds);
			msg = dateStr + ' ' + msg; 
		}
		debugObj(msg);
	};
	self.log = function(msg){
		printMsg('log', msg);
	};
	self.warn = function(msg){
		printMsg('warn', msg);
	};
	self.error = function(msg){
		printMsg('error', msg);
	};
	self.debug = function(msg){
		printMsg('debug', msg);
	};
	self.info = function(msg){
		printMsg('info', msg);
	};

	return self;
}

var updateEnabled = function() {
	var values = [];
	Object.keys(enabled).forEach(function(key) {
		if(Array.isArray(enabled[key])) {
			values = values.concat(enabled[key]);
		} else {
			values.push(enabled[key]);
		}
	});
	debug.enable(values.join(','));
};
// exports.enable = function(id){
// 	enabledList.push('*'+id);
// 	var enabledStr = enabledList.join(',');
// 	debug.enable(enabledStr);
// };
// exports.disable = function(){
// 	enabledList = [];
// 	debug.disable();
// };
// exports.log = debug.log;