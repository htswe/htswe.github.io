---
title: "Primary Constructor vs Secondary Constructor"
header:
  image: https://images.pexels.com/photos/8092/pexels-photo.jpg
categories:
  - Tech
tags:
  - Kotlin
  - Object Oriented Programming
---

A `constructor` is a special function that creates a new object. Using `var` or `val` in the parameter list makes them accessible from outside the object.

```kotlin
class Hero(val name: String)

val hero = Hero("superman")
print(hero.name)
```

In the case above, Kotlin wrote the constructor code fro us. For more customization, we can use the `init` section. `init` section is executed during the object creation:

```kotlin
class Hero(val name: String) {
  private val about: String
  init {
    about = "$name is a brave hero"
  }
  fun toString() = about
}

val superman = Hero("superman")
print(superman.toString())
```

### Secondary constructor

When you are creating an object, sometimes, you might require several ways to construct. You may use named and default arguments - they are easier approach, but sometimes, you must create multiple overloaded constructors.

In Kotlin, overloaded constructors are called _secondary constructors_. To create a secondary constructor, use the `constructor` keyword followed by a parameter list that’s distinct from all other primary and secondary lists.

```kotlin
class SampleSecondary(i: Int) {
  init {
    print("Primary $i")
  }
  constructor(s: String) : this(s.first()) {
    print("Secondary $s")
  }
}
```

### Summary

A constructor is the combination of its constructor parameter list – initialized before entering the class body and the `init` section executed during object creation. Kotlin allows multiple `init` sections, which are executed in definition order. But having multiple sections, may produce maintenance issues for programmers who are accustomed to a single `init` section.
