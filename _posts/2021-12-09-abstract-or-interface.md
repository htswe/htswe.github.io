---
title: "Abstract or Interface"
header:
  image: https://images.pexels.com/photos/5186869/pexels-photo-5186869.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Object Oriented Programming
---

An _abstract class_ is like an ordinary class except one or more functions or properties is incomplete - ie. a function without implementation or a property without initialisation.

```kotlin
abstract class myAbstract {
    abstract val x: Int
    val y: Int

    abstract fun f(): Int
    abstract fun g(n: Int)
}
```

All functions and properties declared in an _interface_ are abstract by default, which makes an interface similar to an _abstract class_.

```kotlin
interface myInterface {
    val x: Int
    fun f(): Int
    fun g(n: Int)
}
```

### What is the difference between abstract class and interface?

1. The difference is that an _abstract class_ can contain **_state_**, while an interface cannot. State is the data stored inside properties.

```kotlin
interface myInterface {
    val x: Int
    // val x: Int = 10 won't work
}
```

2. Both interface and abstract class can contain functions with implementation.

```kotlin
interface Parent {
    val f(): Int
    fun g() = "hello ${f()}"
}

class Hello: Parent {
    override fun f() = 100
}

print(Hello().g()) // hello 100
```

3. In Kotlin, a class can only inherit from a single base class. Java works the same too. The original Java designers decided that C++ multiple inheritance was a bad idea. The main complexity and dissatisfaction at that time came from multiple _state_ inheritance. Java solves this by introducing interfaces, which cannot contain state. Java allows multiple interface inheritance, but forbids multiple state inheritance. Kotlin follows.

```kotlin
interface Animal
interface LandAnimal : Animal
interface WaterAnimal : Animal

class Turtle: Animal, WaterAnimal
```

### Summary

You might wonder why we need interfaces when abstract class can do more than what an interface could. The answer is multiple inheritance. Both are designed to solve different problem and knowing what to use will make the programmer life easier.
