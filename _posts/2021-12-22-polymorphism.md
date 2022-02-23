---
title: "Polymorphism"
header:
  image: https://images.pexels.com/photos/951531/pexels-photo-951531.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Object Oriented Programming
---

One of the **Object Oriented Programming** concept is the ability of _polymorphism_. The word, _polymorphism_ is an ancient Greek term. It means **_many forms_**. In programming context, _polymorphism_ means an object or its members have multiple implementations.

Let's consider an object `Pet`. The `Pet` class says that all pets can `speak()`. `Dog` and `Cat` override the `speak()` member function.

```kotlin
open class Pet {
  open fun speak() = "Pet"
}

class Dog : Pet() {
  override fun speak() = "Woff"
}

class Cat : Pet() {
  override fun speak() = "Meow"
}

fun talk(pet: Pet) = pet.speak()

talk(Dog())
talk(Cat())
```

`talk()` doesn’t know the exact type of `Pet` it receives. Despite that, when you call `speak()` through a reference to the base-class `Pet`, the correct subclass implementation is called, and you get the desired behaviour.

Polymorphism occurs when a parent class reference contains a child class instance. **_When you call a member on that parent class reference, polymorphism produces the correct overridden member from the child class._**

### Binding

Connecting a function call to a function body is called _binding_. Ordinarily, you don’t think much about binding because it happens **_statically, at compile time_**.

With polymorphism, the same operation must behave differently for different types—but the compiler cannot know in advance which function body to use. The function body must be determined **_dynamically, at runtime_**, using _dynamic binding_.

Dynamic binding is also called _late binding_ or _dynamic dispatch_. Only at runtime can Kotlin determine the exact `speak()` function to call. Thus we say that the binding for the polymorphic call `pet.speak()` occurs dynamically.

### Summary

Dynamic binding isn’t free. The additional logic that determines the runtime type slightly impacts performance compared to static binding. To force clarity, Kotlin defaults to closed classes and member functions. To inherit and override, you must be explicit (`open`).

A language feature such as the `when` statement can be learned in isolation. Polymorphism cannot—it only works in concert, as part of the **_larger picture_** of class relationships. To use object-oriented techniques effectively, you must expand your perspective to include not just members of an individual class, but also the commonality among classes and their relationships with each other.
