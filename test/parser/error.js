'use strict';

const test = require('tape');
const Parser = require('../../src/Parser');

test('unknown opcode', function(t) {
    t.plan(1);

    t.throws(function() {
        var parser = new Parser('wat');
        parser.start();
    }, /unknown opcode/);
});

test('unknown opcode with chaff', function(t) {
    t.plan(1);

    t.throws(function() {
        var parser = new Parser('  lol 0x04 ; what?');
        parser.start();
    }, /unknown opcode/);
});
