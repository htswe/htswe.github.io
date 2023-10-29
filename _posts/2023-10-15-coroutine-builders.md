---
title: "Coroutine Builders"
header:
  image: https://images.pexels.com/photos/10528234/pexels-photo-10528234.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Asynchronous
---

### Coroutine Builders

There are 3 coroutine builders:

1. `launch`
2. `async`
3. `runBlocking`

### Basic usage of `coroutine`

Let's take a look at a simple kotlin program with a coroutine builder.

```kotlin
fun main() {
    GlobalScope.launch {
        delay(500)
        println("printed from within Coroutine")
    }
    println("main end")
}
```

This will just print out the "main end" without waiting for the other print statement inside coroutine block. If we want the message to appear, one way is to add `Thread.sleep(>500)`.

```kotlin
fun main() {
    GlobalScope.launch {
        delay(500)
        println("printed from within Coroutine")
    }
    Thread.sleep(1000)
    println("main end")
}
```

```bash
printed from within Coroutine
main ends
```

### `runBlocking`

The `Thread.sleep(ms)` is ugly, to avoid that, Coroutine has a builder for it called `runBlocking`. This will force the process to wait before it could end.

```kotlin
fun main() {
    runBlocking {
        launch {
            delay(500)
            println("printed from within Coroutine")
        }        
    }
}
```

This could be expressed as

```kotlin
fun main() = runBlocking {
    launch {
        delay(500)
        println("printed from within Coroutine")      
    }
}
```

This works okay if we do not plan to access the result from the coroutine inside `launch`. If we are expecting the result from coroutine, we could use the `Job` as Coroutine returns.

```kotlin
fun main() = runBlocking {
    launch {
        networkRequest()
        print("result received")
    }
    println("end of runBlocking")
}

suspend fun networkRequest(): String {
    delay(500)
    return "Result"
}
```

```bash
end of runBlocking
result received
```

When the above code runs, we noticed that `launch` is another coroutine and doesn't block the print statement for "end of runBlocking". If we want the `launch` coroutine print statement to appear first, then we may need to use `Job`.

```kotlin
fun main() = runBlocking {
    val job = launch {
        networkRequest()
        print("result received")
    }
    job.join()
    println("end of runBlocking")
}

suspend fun networkRequest(): String {
    delay(500)
    return "Result"
}
```

```bash
result received
end of runBlocking
```

### `launch` with `LAZY`

Another way is to make the `launch` coroutine to `LAZY` type.

```kotlin
fun main() = runBlocking {
    val job = launch(start = CoroutineStart.LAZY) {
        networkRequest()
        print("result received")
    }
    // since it is LAZY, we could do other works
    delay(200)
    job.start()
    println("end of runBlocking")
}

suspend fun networkRequest(): String {
    delay(500)
    return "Result"
}
```

In this case, we could choose to `start` the `Job` anytime.

### Conclusion

In Kotlin, coroutine builders like `launch`, `async`, and `runBlocking` serve distinct purposes in managing asynchronous tasks. 

While `launch` creates non-blocking coroutines, it doesn't halt the calling code. `runBlocking` forces the program to wait for coroutine completion but might not be ideal for result-dependent tasks.

Handling coroutine results is achieved through the returned `Job` from `launch`. Utilizing `job.join()` ensures specific order of execution.

The `CoroutineStart.LAZY` option with `launch` enables controlled coroutine start, allowing the program to perform other tasks before explicitly initiating the coroutine with `job.start()`.

Understanding these builders provides flexibility in managing asynchronous operations in Kotlin, ensuring effective handling of concurrent tasks while maintaining code clarity.

Next topic, we will look at Coroutine that runs sequentially and concurrently as well as the difference between `launch` and `async`.
