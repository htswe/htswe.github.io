---
title: "Destructuring"
header:
  image: https://1.bp.blogspot.com/-I0v8MD0cCLk/YXlqFqrh9qI/AAAAAAAADfw/-LvecSKeXSA-GN9VynzcN4td6CEs9aD7gCLcBGAsYHQ/s600/unicorn%2Bdestructuring.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

Many times, you may encounter use cases where you need to return more than one item from a function. One way that people usually do is to create a custom `object` or `class` that contains those items.

### Pair and Triple

Another choice is to use `Pair` class. For example,

```kotlin
fun square(input: Int): Pair<Int, String> =
  if (input < 0)
    Pair(input * input, "negative input")
  else
    Pair(input * input, "non-negative input")

val test = square(-5)
print(test.first) // 25
print(test.second) // negative input
```

Returning multiple values is great, but we’d like to a convenient way to unpack the results. As you can see, we can use `test.first` and `test.second` to access the component of a `Pair`. But we can also declare and initialize using a _destructuring declaration_.

```kotlin
val test = square(-5)

val (squareValue, inputType) = square(-5)
print(squareValue) // 25
print(inputType) // negative input
```

Similar to `Pair`, if you have 3 values, you can use `Triple`. But anything more than 3 values, you won’t find any other component.

### Data Class

> It is intentional that the maximum is `Triple`. You should consider using special classes such as `data class` if you have more than 3 values.

The `data class` also supports destructuring.

```kotlin
data class Result(
  val value: Int,
  val type: String
)

fun square(input: Int): Result =
  if (input < 0)
    Result(input * input, "negative input")
  else
    Result(input * input, "non-negative input")

val (value, type) = square(-5)
```

One important thing to take note for `data class` during destructuring is that we must assign values to the new identifiers in ==same order== that we define the properties in the class.

In case you do not need some of them, you can use underscore to skip it. For example,
`val (_, type) = square(-5)`
when we want to skip the first properties `value`.

### Bonus

There are some special extension function in Kotlin built-in library such as `List`. You can use `withIndex()` extension that returns a collection of `IndexedValues` which can be destructured.

```kotlin
val list = listOf('x','y','z')
for((index, value) in list.withIndex()) {
  print("$index:$value")
}
```

### Summary

The destructuring declarations is a useful feature to extract properties from objects and bind them to variables.

What impresses me is that I can extract multiple properties in one statement and it looks so neat and tidy.
