---
title: "Making recursion more efficient with tailrec"
header:
  image: https://images.pexels.com/photos/804416/pexels-photo-804416.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
---

### What is recursion?

_Recursion_ is the programming technique of calling the function within the same function. A recursive function uses the result from the previous recursive call. The perfect example for recursion is `fibonacci(n)`.

If we have to describe in the code:

```kotlin
fun fibonacci(n: Long) : Long {
  return when (n) {
    0L -> 0
    1L -> 1
    else ->
      fibonacci(n - 1) + fibonacci(n - 2)
  }
}
```

### Tail Recursion

While it is easy to read the recursive function, it's expensive. When calling a function, the information about that function and its arguments are stored in `call stack`. When you call a recursive function, each recursive invocation adds a frame to the call stack. This can easily produce a `StackOverflowError` which means it runs out of memory.

To prevent call stacks overflows, functional languages (including Kotlin) use a technique call _tail recursion_. The goal is to reduce the size of the call stack. The way to do is by using the keyword `tailrec`. Under the right conditions, this will convert recursive calls into iteration, eliminating call-stack overhead. This is a **complier optimisation** , but it doesn't work for all recursive calls.

To use `tailrec` successfully, recursion must be the final operation, which means there can be no extra calculations on the result of the recursive call before it is returned.

Remember that `fibonacci` implementation - it is terribly inefficient because the previously-calculated results are not reused. Thus, the number of operations grows exponentially.

With tail recursion, the calculations become dramatically more efficient.

```kotlin
fun fibonacci(n: Int): Long {
  tailrec fun fibonacci(
    n: Int,
    current: Long,
    next: Long
  ): Long {
    if (n == 0) return current
    return fibonacci(
      n - 1,
      next,
      current + next
    )
  }

  return fibonacci(n, 0L, 1L)
}
```

We use the local function to conceal the `fibonacci` function so that the user cannot put other values in those defaults, which produce incorrect results. The only function that the user can see is `fibonacci(n)`.

## Summary

While it is easy to read, it's expensive. When calling a function, the information about that function and its arguments are stored in `call stack`. When you call a recursive function, each recursive invocation adds a frame to the call stack. This can easily produce a `StackOverflowError` which means it runs out of memory.

Use `tailrec` technique wherever applicable to make the function more efficient.
