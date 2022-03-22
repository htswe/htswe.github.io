---
title: "Sealed class in Kotlin"
header:
  image: https://images.pexels.com/photos/211290/pexels-photo-211290.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

To constrain a class hierarchy, we have to declare the superclass `sealed`. Without the constraint, our code will look like this:

```kotlin
open class Transport

data class Train(
  val line: String
): Transport()

data class Bus(
  val number: String
): Transport()

fun travel(transport: Transport) =
  when (transport) {
    is Train -> "Train ${transport.line}"
    is Bus -> "Bus ${transport.number}"
    else -> "Unknown transport"
  }
```

If you are looking at `travel()` method, you will notice there is a potential trouble. Imagine if we have another `Transport` type, the `travel()` method will not tell you that you need to modify it to detect for new `Transport` type. If you have a lot of `Transport` types, then it could become a maintenance nightmare. This whole situation can be improved using `sealed` keyword. When defining `Transport`, replace `open class` with `sealed class`.

```kotlin
sealed class Transport

data class Train(
  val line: String
): Transport()

data class Bus(
  val number: String
): Transport()

fun travel(transport: Transport) =
  when (transport) {
    is Train -> "Train ${transport.line}"
    is Bus -> "Bus ${transport.number}"
  }
```

> all direct subclasses of a `sealed` class must be located in the same file as the base class. Although Kotlin forces you to exhaustively check all possible types in a `when` expression, the `when` in `travel()` no longer requires an `else` branch.

### Subclasses

When a class is `sealed`, you can easily iterate through its subclasses:

```kotlin
sealed class Android
class Samsung : Android()
class Huawei : Android()
open class LG : Android()
class LG_One : LG()


fun main() {
  Android::class.sealedSubclasses.map { it.simpleName }
  // Samsung, Huawei, LG
}
```

`Android::class` will produce a class object and you can access properties and member functions of that class object to discover information. One of the properties of class objects is `sealedSubclasses`, which expects that `Android` is a `sealed` class (otherwise it produces an empty list).

`sealedSubclasses` uses _reflection_, which requires that the dependency `kotlin-reflection.jar` be in the classpath. Reflection is a way to dynamically discover and use characteristics of a class. `sealedSubclasses` can be an important tool when building polymorphic systems. It can ensure that new classes will automatically be included in all appropriate operations. Because it discovers the subclasses at runtime, however, it may have a performance impact on your system.
