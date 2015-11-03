var test = require('bdsft-sdk-test').model;
describe('debug', function() {

  beforeEach(function() {
    debug = require('../').model.create({id: 'test', name: 'test'});
    console.debug = function(msg){console.log(msg);}
    msgs = [];
    methods = ['debug', 'log', 'info', 'warn', 'error']
    debug.print = function(msg){ msgs.push(msg)}
  });

  it('level = info', function() {
    debug.level = 'info';
    printLogs()
    expect(msgs).toEqual(['info', 'warn', 'error']);
  });

  it('level = error', function() {
    debug.level = 'error';
    printLogs()
    expect(msgs).toEqual(['error']);
  });

  it('level = debug', function() {
    debug.level = 'debug';
    printLogs()
    expect(msgs).toEqual(['debug', 'log', 'info', 'warn', 'error']);
  });

  function printLogs(){
    for (var i = 0; i < methods.length; i++) {
        debug[methods[i]](methods[i]);
    }
  };
});