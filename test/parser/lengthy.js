'use strict';

const test = require('tape');
const Parser = require('../../src/Parser');

test('add two integers', function(t) {
    t.plan(1);

    var code = '    load 0x00 1 ; load two constants to memory\n'
             + '    load 0x04 2\n'
             + '    push 0x00 ; push onto stack\n'
             + '    push 0x04\n'
             + '    iadd\n'
             + '    pop 0x00 ; pop back to stack\n'
             + '    sys 0x12 ; syscall to exit\n';

    var parser = new Parser(code);
    parser.start();

    t.deepEqual(parser.compiled,
        [0x20, 0x00, 1, 0x20, 0x04, 2, 0x10, 0x00, 0x10, 0x04, 0x40, 0x11, 0x00, 0x02, 0x12]);
});
