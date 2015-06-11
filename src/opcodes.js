'use strict';

module.exports = {
    // 0x0. general instructions
    'nop'  : 0x01,
    'sys'  : 0x02,
    'jump' : 0x03,
    // 0x1. stack management
    'push' : 0x10,
    'pop'  : 0x11,
    // 0x2. memory management
    'load' : 0x20,
    // 0x4. integer arithmetic
    'add'  : 0x40,
    'sub'  : 0x41,
    'mul'  : 0x42,
    'div'  : 0x43,
    'rem'  : 0x44,
    // 0x5. & 0x6. comparison
    'jeq'  : 0x50,
    'jneq' : 0x51,
    'jzr'  : 0x52,
    'jnzr' : 0x53,
};
