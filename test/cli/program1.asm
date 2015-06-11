; Load 1 and 2 onto the stack, add them together, pop them off the stack into
; memory, then shutdown.

main:
    load 0x00 1 ; load two constants to memory
    load 0x04 2
    push 0x00   ; push onto stack
    push 0x04
    iadd
    pop  0x00   ; pop back to stack
    sys  0x12   ; syscall to exit

