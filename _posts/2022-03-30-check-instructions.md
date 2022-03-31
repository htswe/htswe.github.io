---
title: "Check Instructions"
header:
  image: https://images.pexels.com/photos/4582548/pexels-photo-4582548.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

_Check Instructions_ are like **assert** - they act like a constraints that must be met before it could proceed. Usually, they are used to validate function arguments and results. Check instructions typically throw exceptions when they fail. They are easier to write and produce more comprehensible code.

### `require()`

This `require()` acts like preconditions and normally used to validate function arguments, so it typically appears at the beginning of function bodies. These tests cannot be checked at _compile_ time. Preconditions are relatively easy to include in our code, but sometimes they can be turned into **_unit tests_**.

```kotlin
data class DayOfMonth(val dayNo: Int) {
  init {
    require(dayNo in 1..31) {
      "Day of month is out of range. Input: $dayNo"
    }
  }
}

DayOfMonth(10) //DayOfMonth(dayNo=15)
DayOfMonth(35) //IllegalArgumentException: Day of month is out of range. Input: 35
```

### `requireNotNull()`

The `requireNotNull()` tests its first argument and returns that argument if it is not `null`. Otherwise, it produces an `IllegalArgumentException`.

```kotlin
fun doubleIt(n: Int?): Int {
  requireNotNull(n) {
    "the input cannot be null"
  }
  return n * n
}

doubleIt(null) // IllegalArgumentException the input cannot be null"
```

### `check()`

The `check()` is identical to `require()` except that it throws `IllegalStateException`. It is typically used at the end of a function, to verify that the results are valid.

```kotlin
val myFile = DataFile("test.txt")

fun modifyContent(canModify: Boolean) {
  if (canModify)
    myFile.writeText("OK")

  check(myFile.exists()) {
    "${myFile.name} does not exist!"
  }
}

modifyContent(false) //IllegalStateException: test.txt does not exist!
```

### `assert()`

To avoid commenting and uncommenting `check()` statements, `assert()` allows us to enable and disable `assert()` checks. `assert()` comes from Java. Assertions are disabled by default, and are only engaged if we explicitly turn them on using a command line flag. In Kotlin, this flag is `-ea`.

Usually, the recommendation is to use `require()` and `check()` which are always available without special configuration.
