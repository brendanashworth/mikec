'use strict';

const test = require('tape');
const Parser = require('../../src/Parser');

function go(t, code, eq) {
    t.plan(1);

    var parser = new Parser(code);
    parser.start();

    t.deepEqual(parser.compiled, eq);
}

test('empty line', function(t) {
    go(t, '', []);
});

test('line without opcode', function(t) {
    go(t, '; comment starts at column 0', []);
});

test('single opcode', function(t) {
    go(t, 'iadd', [0x40]);
});

test('single opcode with whitespace', function(t) {
    go(t, '  pop ', [0x11]);
});

test('single opcode with whitespace and comment', function(t) {
    go(t, '  nop   ; comment', [0x01]);
});

test('single opcode with arguments', function(t) {
    go(t, 'load 0x04 12', [0x20, 0x04, 0x0c]);
});

test('single opcode with arguments and whitespace and comment', function(t) {
    go(t, '   push    0x00    ; push something to stack', [0x10, 0x00]);
});

test('simple loop', function(t) {
    go(t, 'func: \n nop \n jump func', [0x01, 0x03, 0]);
});

test('simple call', function(t) {
    go(t, 'name: \n iadd \n ret \n \n main: \n call name \n imul \n', [0x40, 0x05, 0x04, 0, 0x42]);
})
