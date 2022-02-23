---
title: "Elegant Local Function"
header:
  image: https://images.pexels.com/photos/4569306/pexels-photo-4569306.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
---

What exactly is local function? It was new to me in Kotlin and thought it is interesting to dig deeper. In a normal class, we have many functions within a class - the functions have names so that we know which functions are linked to each other.

> Local functions are the functions with names that are defined within other functions.

So what is it for? Well, local functions reduce duplication by extracting the repetitive code. Moreover, they are only visible within the surrounding function, so they don’t mess up your code readability.

Let’s see an example :

```kotlin
fun doPrint() {
  val buffer = StringBuilder()

  fun printWarning(message: String) =
    buffer.appendLine("Warning: $message")

  printWarning("Your attention please")
  val num = 123
  printWarning("Do not use the line number: $num")

  val result = buffer.toString()
  // Warning: Your attention please
  // Warning: Do not use the line number: 123
}
```

Notice that `printWarning()` has access to `buffer` - because local functions are _closures_, so you don’t have to pass additional parameters.

### With Function Reference

You can refer to a local function using a function reference:

```kotlin
class Event(
  val title: String,
  val location: String
)
```

```kotlin
events = listOf(
  Event("Kotlin", "Room A"),
  Event("Swift", "Room B")
)

fun mustAttend(event: Event): Boolean {
  if (event.title.contains("Kotlin") {
    return true
  }
  return false
}

val result = events.any(::mustAttend)
// true
```

### With anonymous function

The function `mustAttend()` is only used once, so you might inclined to define as a `lambda`. An alternative is using _anonymous_ function.

> Anonymous functions are defined within other functions - but no name. They are similar to lambdas, but use the fun keyword.

```kotlin
events.any(
  fun(event: Event): Boolean {
    if (event.title.contains("Kotlin") {
      return true
    }
    return false
  }
)
```

## Summary

If a lambda becomes too complicated and hard to read, replace it with a local function or an anonymous function.

```kotlin
fun usingAnonymous: (Int) -> Int {
  val func = fun(i:Int) = i + 1
  val result = func(1) // 2
}
```

```kotlin
fun usingLambda(): (String) -> String {
  val func2 = { s: String -> "$s!" }
  return func2("abc")
}
```

```kotlin
fun usingRef(): () -> String {
  fun greet() = "Hi!"
  return ::greet
}
```

```kotlin
fun usingRefCompact() = fun() = "Hi!"
```

```kotlin
fun usingLambdaCompact() = { "Hi!" }
```
