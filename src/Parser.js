'use strict';

const assert = require('assert');
const debug = require('debug')('mikec');
const opcodes = require('./opcodes');

const REGEX_JUMP = /([a-zA-Z]+):/;
const REGEX_INT  = /[x0-9]+/;

// Parser statuses.
const PARSER_WS_BF   = 1 << 0; // whitespace before opcode
const PARSER_OPCODE  = 1 << 1; // inside opcode
const PARSER_WS_AF   = 1 << 2; // whitespace after (anything)
const PARSER_ARG     = 1 << 3; // inside argument
const PARSER_COMMENT = 1 << 4; // inside comment (can terminate)

function Parser(data) {
    this.data = data;
    this.compiled = [];

    // Map for jump codes. Name -> Location.
    this.jumps = { };
}

// Emit a bytecode.
Parser.prototype.emit = function(byte) {
    this.compiled.push(byte);
};

Parser.prototype.peek = function() {
    return this.compiled[this.pos() - 1];
};

// Get position.
Parser.prototype.pos = function() {
    return this.compiled.length;
};


Parser.prototype.start = function() {
    this.parseLines(this.data.split('\n'));
};

Parser.prototype.parseLines = function(lines) {
    for (let i = 0; i < lines.length; i++)
        this.parseLine(lines[i]);
};

Parser.prototype.parseLine = function(line) {
    // Begin with whitespace.
    var status = PARSER_WS_BF;

    // Buffer for any data.
    var buffer = '';

    // Jump codes are handled differently
    if (REGEX_JUMP.test(line)) {
        var name = line.match(REGEX_JUMP)[1];

        debug('declaring jump code', name);

        // No bytes are emitted on jump codes.
        this.jumps[name] = this.pos();
        return;
    }
    
    // Iterate over characters.
    // Note the <=. This will OVERFLOW one character (to undefined), which
    // makes the parser terminate the previous line, as following whitespace
    // is optional.
    for (let i = 0; i <= line.length; i++) {
        // Terminators of the previous line (whitespace, comments, EOF).
        if (line[i] == ' ' || line[i] == '\t' || line[i] == ';' || line[i] === undefined) {
            switch (status) {
                // Just a continuation of whitespace.
                case PARSER_WS_BF:
                case PARSER_WS_AF:
                    break;
                // Terminated opcode.
                case PARSER_OPCODE:
                    if (opcodes[buffer] === undefined)
                        throw new Error('unknown opcode for %s', buffer);

                    this.emit(opcodes[buffer]);
                    status = PARSER_WS_AF;

                    break;
                // Terminated argument.
                case PARSER_ARG:
                    if (REGEX_INT.test(buffer)) {
                        this.emit(parseInt(buffer));
                    } else {
                        debug('emit loc for call/ret', buffer, this.peek(), this.jumps[buffer]);

                        // Must be ret or call
                        var prev = this.peek();
                        if ([opcodes['call'], opcodes['ret'], opcodes['jump']].indexOf(prev) === -1)
                            throw new Error('malformed argument to non-call/ret opcode');

                        if (this.jumps[buffer] === undefined)
                            throw new Error('unknown function name');

                        this.emit(this.jumps[buffer]);
                    }

                    status = PARSER_WS_AF;

                    break;
            }

            // Terminate.
            if (line[i] == ';' || line[i] === undefined) {
                status = PARSER_COMMENT;
                return;
            }
        // Continuation or beginning of argument.
        } else {
            switch (status) {
                // Begin opcode.
                case PARSER_WS_BF:
                    buffer = line[i];
                    status = PARSER_OPCODE;

                    break;
                // Begin argument.
                case PARSER_WS_AF:
                    buffer = line[i];
                    status = PARSER_ARG;

                    break;
                // Otherwise, append to buffer.
                case PARSER_OPCODE:
                case PARSER_ARG:
                    buffer += line[i];

                    break;
                default:
                    throw new Error('unreachable, status(%s)', status);
            }
        }
    }
};

module.exports = Parser;
