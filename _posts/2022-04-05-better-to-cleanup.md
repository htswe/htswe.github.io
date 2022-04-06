---
title: "Resource Cleanup"
header:
  image: https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

Using `try`, `catch` and `finally` blocks for resource cleanup is tedious and error-prone. In fact, Kotlin has a library functions that could help us to manage cleanup for us.

As we know, `finally` clause cleans up resources regardless of how `try` block exits. But what if an exception can happen while closing the `finally` clause. On top of that, if one exception is thrown inside a `try` and another while closing the resource, the latter shouldn't conceal the former. Ensuring proper cleanup becomes very messy.

To reduce this complexity, Kotlin's `use()` guarantees proper cleanup of closable resources, liberating you from handwritten cleanup code. `use()` rethrows all exceptions, so we must still deal with those exceptions.

We can find `use()` in Java documentation for `AutoClosable`. For example, to read lines from a `File` we apply `use()` to a `BufferedReader`.

```kotlin
fun main() {
  DataFile("test.txt")
    .bufferedReader()
    .use { it.readLines().first() }
}
```

`use()` ensures resource cleanup at the point the resource is created, rather than forcing us to write cleanup code when we are finished with the resource.
