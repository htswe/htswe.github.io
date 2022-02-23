---
title: "Ask for inheritance"
header:
  image: https://images.pexels.com/photos/8014628/pexels-photo-8014628.jpeg?auto=compress
categories:
  - Tech
tags:
  - Kotlin
  - Object Oriented Programming
---

Inheritance is a mechanism for creating a new class by reusing and modifying an existing class.

In order to do this, in Kotlin, the base class must be `open`. A non-`open` class doesn’t allow inheritance – it is `closed` by default. This differs from most other object-oriented languages.

For example, in Java, a class is inheritable automatically unless you explicitly forbid by declaring it as `final`.

```kotlin
open class Solider {
  val id: String = 1
  val age: Int = 25
}

class Corporal: Solider()
class Sergeant: Solider()
```

**Inheritance** gets interesting when you start _overriding_ functions, which means redefining a function from a base class to do something different a derived class.

```kotlin
open class Solider {
  protected var energy = 0
  open fun reportTo() = "General"
  fun energyLevel() = "Energy: $energy"
}

class Corporal: Solider() {
  override fun reportTo() = "Sergeant"
  fun serviceYear() = 10
}
```

### Summary

Kotlin imposes an additional constraint when overriding functions. Just like base class, you cannot `override` function from a base class unless it is defined as `open`. Inheritance and overriding cannot be accomplished in Kotlin without clear intentions.
