---
title: "Nested class"
header:
  image: https://images.pexels.com/photos/3622479/pexels-photo-3622479.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

### Nested Class

A nested class enables us to group more logically, hence it makes it more readable and refined structure. A nested class is simply a class within the namespace of outer class.

```kotlin
class Outer(private val code: String) {
  class Inner {
    fun hello() = "hello"
  }
}
```

### Local Class

A local class is the class that is nested inside function. Within function, one thing to take note is that we couldn't have `interface`. The local classes are not visible outside the function, so we cannot return them.

```kotlin
fun thisIsLocal() {
  open class Animal
  class Dog : Animal()

  val aDog: Animal = Dog()
}
```

### Class inside Interface

Class can be nested inside `interface`.

```kotlin
interface Item {
  val type = Type
  data class Type(val type: String)
}

class Hammer(material: String) : Item {
  override val type = Item.Type(material)
}
```

### Nested Enum

`enum` are class, so they can be nested inside other class.

```kotlin
class FootballClub(
  val name: String,
  val size: Size = Small
) {
  enum class Size {
    Large,
    Medium,
    Small
  }

  fun grow() : FootballClub {
    val newSize = values()[
      (size.ordinal - 1).coerceAtLeast(Large.ordinal)
    ]

    return FootballClub(name, newSize)
  }
}
```
