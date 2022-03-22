---
title: "Downcasting"
header:
  image: https://images.pexels.com/photos/8879654/pexels-photo-8879654.jpeg
categories:
  - Tech
tags:
  - Kotlin
---

_Downcasting_ is to discover the specific type of a previously upcast object. _Upcast_ is always safe because the base class cannot have a bigger interface than the derived class. Every base class member is guaranteed to exist and is therefore safe to call. Although object-oriented programming is primarily focused on upcasting, there are situations where downcasting can be a useful and expedient approach.

Downcasting happens at **runtime**, and is also called **_run-time identification (RTII)_**.

```kotlin
interface Base {
  fun f()
}

class Derived1: Base {
  override fun f() {}
  fun g() {}
}

class Derived2: Base {
  override fun f() {}
  fun h() {}
}

fun main() {
  val b1: Base = Derived1() // upcast
  b1.f()
  //b1.g() // error, g() cannot access in b1

  val b2: Base = Derived2() // upcast
  b2.f()
  //b2.h() // error, h() cannot access in b2
}
```

As we can see, we cannot access `b1.g()` and `b2.h()` since both `b1` and `b2` are upcast to base.

### Smart Cast

**_Smart Cast_** is automatic downcast. This is keyword checks whether an object is a particular type. Any code within the scope of that check assumes that it is that type:

```kotlin
fun main() {
  val b1: Base = Derived1()
  if (b1 is Derived1) // scope within the check
    b1.g()
}
```

### The `as` keyword

The `as` keyword forcefully casts a general type to a specific type. A failing `as` cast throws a `ClassCastException`. A plain `as` is called an `unsafe cast`.

When a safe cast `as?` fails, it doesn't throw an exception, but instead returns `null`.

```kotlin
interface Creature

class Dog : Creature {
  fun bark() = "woof!"
}

class Human : Creature {
  fun talk() = "hello"
}

fun dogBarkSafely(c: Creature) =
  (c as? Dog)?.bark() ?: "Not a dog"


dogBarkSafely(Dog()) // woof!
dogBarkSafely(Human()) // Not a dog
```

### Discovering Types in Lists

```kotlin
val group: List<Creature> = listOf(
  Dog(), Human(), Dog()
)

val dog = group.find { it is Dog } as Dog?
dog?.bark()
```

The code above can be written using `filterIsInstance()`, which produces all elements of a specific type.

```kotlin
val dogs : List<Human> = group.filterIsInstance<Human>()
```

`filterIsInstance` is more readable than using `filter()`. The difference between `filter()` and the `filterIsInstance()` is the return values. `filter` returns a `List` of `Creature` whereas `filterIsInstance` returns the target.
