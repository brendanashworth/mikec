'use strict';

const test = require('tape');
const path = require('path');
const spawn = require('child_process').spawnSync;

const mikec = path.resolve(__dirname, '../../bin/mikec');

test('no arguments', function(t) {
    t.plan(3);

    var proc = spawn(mikec, []);
    t.equal(proc.status, 1);

    var output = proc.stdout.toString('utf8');

    t.ok(/output/i.test(output));
    t.ok(/options/i.test(output));
});
