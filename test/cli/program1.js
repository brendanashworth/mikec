'use strict';

const test = require('tape');
const path = require('path');
const fs = require('fs');
const spawn = require('child_process').spawnSync;

const mikec = path.resolve(__dirname, '../../bin/mikec');

test('program1.asm', function(t) {
    t.plan(2);

    var stem = path.resolve(__dirname, './program1');

    var proc = spawn(mikec, ['-i', stem + '.asm', '-o', stem + '.o']);
    t.equal(proc.status, 0);

    var data = fs.readFileSync(stem + '.o');
    var buf = new Buffer([0x20, 0x00, 1, 0x20, 0x04, 2, 0x10, 0x00, 0x10, 0x04, 0x40, 0x11, 0x00, 0x02, 0x12]);

    t.deepEqual(data.toJSON(), buf.toJSON());

    fs.unlinkSync(stem + '.o');
});
