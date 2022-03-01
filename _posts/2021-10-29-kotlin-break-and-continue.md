---
title: "Kotlin break & continue"
header:
  image: https://1.bp.blogspot.com/-8Ufp_evk5L8/YXwOlKmDy8I/AAAAAAAADgY/BSWJxLVtd40G45qY_OiYBBmOI2NA91RGACLcBGAsYHQ/s640/jump.jpg
categories:
  - Tech
tags:
  - Kotlin
---

### Jump history

The earliest programming language that I was familiar with is [Assembly][assembly-wiki]. I use it to program for low level code like how i programmed for lift (elevator). I used `CMP` and `JMP` a lot. `CMP` is like if expression and `JMP` allows you to jump around.

```
MOV AX, 00 ;Initializing AX to 0
L20:
ADD AX, 01 ;Increment AX
JMP L20 ;repeats the statements
```

Then it comes to higher-level language like C. `goto` made the transition more comfortable. But as we accumulate more experience, however, the programming community discovered that unconditional jumps produce complicated and unmaintainable code. This created a lot of criticism against the usage of `goto` and most subsequent languages have avoided any kind of unconditional jump.

Here is a snippet of how `goto` is used in C program.

```c
main() {
  int i = 1;
  printf("hello");
  here:
  printf("%d", i);
  i++;
  if (i <= 10) goto here;
  printf("bye");
}
```

### Kotlin break & continue

Kotlin allows us to jump, but wait. You can only jump within a looping constructs - `for`, `while` and `do-while`. It provides a _constrained jump_ in the form of `break` and `continue`.

> `break` and `continue` allow us to jump within a loop.

In the loop, `continue` allows us to jump to the **beginning** of a loop, while `break` jumps to the **end** of a loop. Here is an example.

```kotlin
fun main() {
  val result = mutableListOf<Int>()
  for (i in 1 until 10) {
    if (i == 5) continue
    if (i == 8) break
    result.add(i)
  }
  print(result) // 1 2 3 4 6 7
}
```

As you can see when `i == 5`, the complier jumps to the beginning of the loop again hence `5` is not added to `result` list. Likewise, when `i==8`, the complier jumps to the end of the loop.

## Label

Plain `break` or `continue` can jump no further than the boundaries of their local loop. _Label_ allows the `break` and `continue` jump to the boundaries of _enclosing_ loop, so you are not limited to the scope of current loop.

You can create a label by using `label@` where `label` can be any name. Here, i will call the label `outer`.

```kotlin
fun main() {
  val result = mutableListOf<String>()
  outer@ for (c in 'a'..'c') {
    for (i in 1..5) {
      if (i == 3) continue@outer
      if ("$c$i" == "c2") break@outer
      result.add("$c$i")
    }
  }
  print(result) // a1 a2 b1 b2 c1
}
```

The labeled `continue` expression `continue@outer` continues back to the label `outer@`. The labeled `break` expression `break@outer` finds the end of the block named `outer@` and proceeds from there.

### Summary

<div style="width:100%;height:0;padding-bottom:90%;position:relative;"><iframe src="https://giphy.com/embed/uTCAwWNtz7U2c" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>

`break` and `continue` tend to create complicated and unmaintainable code. Although these jumps are somewhat more civilized than `goto`, it might still interrupt program flow. Code without jumps is always easier to understand. Always think about other simpler and more readable solution. Both `break` and `continue` can be replaced with return if you extract the whole loop or the loop body into new function. In functional programming, you can also write code without using `break` and `continue`.

[assembly-wiki]: https://en.wikipedia.org/wiki/Assembly_language
