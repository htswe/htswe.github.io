---
title: "Folding and Reducing List"
header:
  image: https://images.pexels.com/photos/690597/pexels-photo-690597.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
---

`fold()` combines all elements of a list, in order to generate a single result. Here is how we can use `fold()` to calculate the sum -

```kotlin
val list = listOf(1, 2, 3, 4)
list.fold(0) { sum, n ->
  sum + n
}
// 10
```

`foldRight()` processes elements starting from right to left, as opposed to `fold()` which processes the elements from left to right. This example demonstrates the difference:

```kotlin
val list = listOf('a', 'b', 'c', 'd')

list.fold("x") { acc, ele ->
  "$[acc] + $ele"
} // [[[[x] + a] + b] + c] + d

list.foldRight("x") { acc, ele ->
  "$[acc] + $ele"
} // [[[[x] + d] + c] + b] + a
```

### Reduce List

`fold()` and `foldRight()` take an explicit accumulator value as the first argument. Sometimes, the first element can act as an initial value. `reduce()` and `reduceRight()` behave like `fold()` and `foldRight()` but use the first and last element respectively as the initial value:

```kotlin
val chars = "a b c d".split(" ")

chars.fold("x") { acc, ele -> "$acc $ele" }
// x a b c d
chars.reduce { acc, ele -> "$acc $ele" }
// a b c d

chars.foldRight("x") { acc, ele -> "$acc $ele" }
// a b c d x
chars.reduceRight { acc, ele -> "$acc $ele" }
// a b c d
```

### Running List

`runningFold()` and `runningReduce()` produce a `List` containing all the intermediate steps of the process. The final value in the `List` is the result of the `fold()` or `reduce()`:

```kotlin
val list = listOf(1, 2, 3, 4)

list.runningFold(10) { sum, n ->
  sum + n
} // [10, 11, 12, 13, 14]

list.runningReduce { sum, n ->
  sum + n
} // [11, 12, 13, 14]
```
