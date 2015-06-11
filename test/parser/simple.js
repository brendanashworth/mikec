'use strict';

const test = require('tape');
const Parser = require('../../src/Parser');

test('empty line', function(t) {
    t.plan(1);

    var parser = new Parser('');
    parser.start();

    t.deepEqual(parser.compiled, []);
});

test('line without opcode', function(t) {
    t.plan(1);

    var parser = new Parser('; comment starts at column 0');
    parser.start();

    t.deepEqual(parser.compiled, []);
});

test('single opcode', function(t) {
    t.plan(1);

    var parser = new Parser('iadd');
    parser.start();

    t.deepEqual(parser.compiled, [0x40]);
});

test('single opcode with whitespace', function(t) {
    t.plan(1);

    var parser = new Parser('  pop ');
    parser.start();

    t.deepEqual(parser.compiled, [0x11]);
});

test('single opcode with whitespace and comment', function(t) {
    t.plan(1);

    var parser = new Parser('  nop   ; comment');
    parser.start();

    t.deepEqual(parser.compiled, [0x01]);
});

test('single opcode with arguments', function(t) {
    t.plan(1);

    var parser = new Parser('load 0x04 12');
    parser.start();

    t.deepEqual(parser.compiled, [0x20, 0x04, 0x0c]);
});

test('single opcode with arguments and whitespace and comment', function(t) {
    t.plan(1);

    var parser = new Parser('   push    0x00    ; push something to stack');
    parser.start();

    t.deepEqual(parser.compiled, [0x10, 0x00]);
});
