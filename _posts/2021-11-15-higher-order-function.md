---
title: "Higher-Order Function"
header:
  image: https://images.unsplash.com/photo-1570960288798-365950a204d4
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
---

What is it? If you are coming from JavaScript, this concept may sound familiar to you. Otherwise, here is what it means.

> If a function can accept another function as arguments and produces functions as return values, then that programming language supports higher-order function.

### Using Lambda

In Kotlin, you can store a lambda in a reference.

```kotlin
val isPositive: (Int) -> Boolean = { it > 0 }

listOf(1, 0, -1).any(isPositive)
// true
```

### Using References

We talked about property references in replacement of lambda.

In the example below, we will also look at how you can make use of generic function as argument in higher-order function.

```kotlin
fun <T> List<T>.any(
  predicate: (T) -> Boolean
): Boolean {
  for (element in this) {
    if (predicate(element))
      return true
  }
  return false
}

val ints = listOf(1, 0, -1)
ints.any( it > 0 ) //true

val texts = listOf("abc", "def", "ghi")
texts.any( it.isBlank() ) // false
texts.any( String::isBlank ) // false
```

## Summary

Higher-order functions are an essential part of functional programming languages. In Kotlin, we have used it in many places using the built-in higher-order functions such as `filter()`, `map()` and `any()`.
