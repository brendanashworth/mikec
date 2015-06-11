# mikec

> An Intel-flavored assembly compiler for the [mike vm](#).

## Install
```bash
$ npm install mikec -g
```

## Example
Small program that takes two integers, adds them, then exits.

```asm
main:
    load 0x00 1 ; load two constants to memory
    load 0x04 2
    push 0x00   ; push onto stack
    push 0x04
    iadd
    pop  0x00   ; pop back to stack
    sys  0x12   ; syscall to exit
```

``bash
$ mikec -in program.asm -out program
```

Then run it with the mike virtual machine (link pending).
