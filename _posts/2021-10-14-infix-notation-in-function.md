---
title: "Infix notation in function"
header:
  image: https://1.bp.blogspot.com/-Si_Zbms_0fI/YWhFsKDk--I/AAAAAAAADdw/k8fqEJNK08A6nvCmSDPB52MG9ovgAGy7gCLcBGAsYHQ/w640-h428/roman-kraft-kRsd59yRNQ4-unsplash.jpg
categories:
  - Tech
tags:
  - Kotlin
---

Another Kotlin treasure that I have not known is the ability to write infix notation in function. We use infix notation in most arithmetic operation such as `a + b`. The infix notation is where the operator (`+`) is used between the operands (`a`) and (`b`). In infix notation, only functions defined using the `infix` keyword can be called this way.

There are 3 things to make this `infix` notation.

1. They must be member functions or extension functions.
2. They must have a single parameter.
3. The parameter must not accept variable number of arguments and must have no default value.

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }

    fun build() {
        this add "abc"   // Correct
        add("abc")       // Correct
        //add "abc"        // Incorrect: the receiver must be specified
    }
}
```
