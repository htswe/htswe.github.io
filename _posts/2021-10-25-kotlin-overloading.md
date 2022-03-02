---
title: "Kotlin overloading"
header:
  image: https://1.bp.blogspot.com/-EoKnrcpZ_wY/YXa_aw1LFRI/AAAAAAAADfA/bsD4B1whWEMg7j-76wNZ0JyoxSd_kqDMwCLcBGAsYHQ/s600/redundancy-redundancy-everywhere.jpg
categories:
  - Tech
tags:
  - Kotlin
---

### Overload

If you are coming from C++, this may be familiar to you. The term _Overload_ refers to the name of a function with the **same** name, but **different** numbers of parameters.

```kotlin
fun f() = 0
fun f(n: Int) = n
fun f(n: Int, m: Int) = n * m
```

### Why is overloading useful?

Why is overloading useful? It allows you to express “variations on a theme” more clearly than if you were forced to use different function names. Compare these two options:

#### Option 1

```kotlin
fun addInt(a: Int, b: Int) = a + b
fun addDouble(a: Double, b: Double) = a + b
```

#### Option 2

```kotlin
fun add(a: Int, b: Int) = a + b
fun add(a: Double, b: Double) = a + b
```

Without overloading, you can’t just name the operation `add()`. With these two options, the overloaded `add()` is much cleaner.

### Conclusion

The lack of overloading in a programming language is not a terrible hardship, but this feature provides valuable simplification, producing more readable code.
