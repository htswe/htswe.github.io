---
title: "Kotlin Exception Handling"
header:
  image: https://images.pexels.com/photos/110315/pexels-photo-110315.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

### Failure is always a possibility

> If debugging is the process of removing software bugs, then programming must be the process of putting them in.

> <cite><a href="https://en.wikipedia.org/wiki/Edsger_W._Dijkstra">Edsger W. Dijkstra</a></cite>

Kotlin finds basic errors when it analyzes the program. Errors that could not be detected at **compile** time must be dealt with at **runtime**. We can throw `exception` and here we will look at `catch` exceptions. Improved error handling is a better way to increase code reliability.

### Beware of Exception Subtypes

The `testMyCode()` function throws `IllegalArgumentException` when incorrect `code` is provided.

```kotlin
fun testMyCode(code: Int) {
  if (code < 0) {
    throw IllegalArgumentException("Code must be positive")
  }
}

fun main() {
  try {
    testMyCode("-100".toInt())
  } catch (e: IllegalArgumentException) {
    print(e.message) // Code must be positive
  }

  try {
    testMyCode("0".toInt(1))
  } catch (e: IllegalArgumentException) {
    print(e.message) // the result will be not our code: It will be something like
    // radix 1 was not in valid range 2..36
  }
}
```

What happens to our second block? why is the exception throwing an error which we do not recognize? It comes from `toInt()` [function][toint] where the library function could also throw the `IllegalArgumentException`. How could we avoid it? Well, we can define our own `Exception` such as `IncorrectInputException` and throws using own exception instead.

```kotlin
class IncorrectInputException(message: String): Exception(message)

fun testMyCode(code: Int) {
  if (code < 0) {
    throw IncorrectInputException("Code must be positive")
  }
}

fun main() {
  try {
    testMyCode("-100".toInt())
  } catch (e: IncorrectInputException) {
    print(e.message) // Code must be positive
  }

  try {
    testMyCode("0".toInt(1))
  } catch (e: IncorrectInputException) {
    print(e.message) // the result will be not our code: It will be something like
    // radix 1 was not in valid range 2..36
  }
}
```

[toint]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html
