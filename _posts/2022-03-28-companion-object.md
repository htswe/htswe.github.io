---
title: "Companion Object"
header:
  image: https://images.pexels.com/photos/1469880/pexels-photo-1469880.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

### Companion Object

If you don't need to tie member functions to the object, consider for `companion` object. Regular class elements can access the elements of the companion object, but the companion object elements cannot access the regular class elements.

```kotlin
class WithCompanion {
  companion object {
    val i = 3
    fun doubleIt() = i * 2
  }
  fun tripleIt() = i + doubleIt()
}

fun WithCompanion.Companion.quadrupleIt() = doubleIt() + doubleIt()

val wc = WithCompanion()
wc.tripleIt() // 9
WithCompanion.i // 3
WithCompanion.doubleIt() // 6
WithCompanion.quadrupleIt() // 12
```

As you can see, you can access to member of companion object using class name `WithCompanion.i` and `WithCompanion.doubleIt()`.

> One thing to note is that ONLY one companion object is allowed per class.

### Named and Default

```kotlin
class withNamed {
  companion object Named {
    fun s() = "from Named"
  }
}

class withDefault {
  companion object {
    fun s() = "from Default"
  }
}

withNamed.s() // from Named
withNamed.Name.s() // from Named

withDefault.s() // from Default
withDefault.Companion.s() // from Default [Default Name is "Companion"]
```

One thing to note is that Kotlin assigns the name `Companion` if you don't give the companion object a name. And of course, you can still access its elements without using the name.

### Single piece of storage

```kotlin
class Computer {
  companion object {
    private var n: Int = 0
  }

  fun increase() = ++n
}

val a = Computer()
val b = Computer()

a.increase() // 1
b.increase() // 2
```

Even if we have two separate objects of `Computer`, when we call the function `increase()` for both `a` and `b`, the value of `n` is sharing the same memory. `n` is a single piece of storage. Likewise, `increase()` function shows that you can access the `private` members of the `companion object` from the surrounding class.

### Factory Method Pattern

A common use for a companion object is controlling object creation -- this is the _Factory Method_ pattern. Suppose you like to only allow the creation of `Lists` of `Book` objects, and not individual `Book` objects.

```kotlin
class Book
private constructor (private val id: int) {
  override fun toString(): String = "Book#$id"
  companion object Factory {
    fun create(size: Int) =
      List(size) { Book(it) }
  }
}

Book.create(0) // []
Book.create(3) // [Book#0, Book#1, Book#2]
```

Firstly, the `Book` constructor is `private`, so the only way for you to create is via the `create()` factory function.
