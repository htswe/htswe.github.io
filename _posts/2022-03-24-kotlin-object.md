---
title: "Object Object Object"
header:
  image: https://images.pexels.com/photos/346804/pexels-photo-346804.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

### What is object

The `object` keyword in Kotlin defines something like `class`. But you cannot create instance of an `object`, as there is only one. Remember [_Singleton_ pattern][singleton].

```kotlin
object One {
  val n = 1
}

print(One.n) // 1
```

### Interesting things about `object`

If you want to confine the `object` within the current file, you can make it as `private`. However, you cannot provide a parameter list for an `object`. Naming conventions is a little different for creating instance of `object`. What happens when you create an `object`? Kotlin defines the `class` and create a single instance of that class. Therefore, instead of starting a lower-case for first letter for instance of class, we use the upper-case for first letter, just like the class.

```kotlin
open class School(val noOfStudents: Int)

object University: School(1000)

interface SchoolOpening {
  fun open(): String
}

object OpenSchool: SchoolOpening {
  override fun open() = "Time to open"
}
```

### Nested Object

`Object` could not be placed inside functions, but it can be nested inside other `object` or class.

```kotlin
object Outer {
  object Nested {
    val a = "Outer.Nested.a"
  }
}
```

[singleton]: https://en.wikipedia.org/wiki/Singleton_pattern
