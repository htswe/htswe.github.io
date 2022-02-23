---
title: "Zipping and Flattening List"
header:
  image: https://images.pexels.com/photos/9965135/pexels-photo-9965135.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
---

### List Manipulation

We love `List`. In fact, many of our work involve using `List` to store many piece of information. We then apply different operations on `List` to make it what we need for our application.

Have you worked with two `Lists`? _Zipping_ and _flattening_ are two common operations that manipulate `Lists`.

### Zipping

`zip()` combines two `Lists` by mimicking the behavior of the zipper on your jacket, pairing adjacent `List` element.

```kotlin
val a = listOf("1", "2", "3")
val b = listOf("x", "y", "z")

a.zip(b)
// [("1","x"), ("2","y"), ("3","z")]
```

`zip()` can perform interesting operation on those `Pair` as well.

```kotlin
data class Person (val name: String, val age: Int)

val names = listOf("alice", "bob", "charlie")
val ages = listOf(20, 30, 40)

names.zip(ages) { name, age ->
  Person(name, age)
}
// array of person objects
```

**Q**: Do you need two lists to perform `zip()` operation?
You can use `zipWithNext()` on a single List to generate a list of `Pair`.

```kotlin
val alphabets = listOf("a","b","c")
alphabets.zipWithNext()
// [("a","b"), ("b","c")]
```

### Flattening

![flattening](https://images.pexels.com/photos/5964531/pexels-photo-5964531.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940){: .align-center}

`flatten()` takes a `List` containing elements that are themselves `Lists`.

```kotlin
val nestedList = listOf(
  listOf(1, 2),
  listOf(3, 4)
)

nestedList.flatten()
// [1, 2, 3, 4]
```

Kotlin provides a combined operation called `flatMap()`, which performs both `map()` and `flatten()` with a single call. You can find `flatMap()` in most of the functional programming languages.

```kotlin
data class Book(val title: String, val authors: List<String>)

val books = listOf(
  Book("Gone with the wind", listOf("Margaret Mitchell"),
  BooK("Harry Porter", listOf("JK Rowling")
)

books.map { it.authors }.flatten()
books.flatMap { it.authors }
// listOf("Margaret Mitchell", "JK Rowling")
```
