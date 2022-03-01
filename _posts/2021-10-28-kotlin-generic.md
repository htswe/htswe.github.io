---
title: "Kotlin generic"
header:
  image: https://1.bp.blogspot.com/-EFWYV6wBRCI/YXmAJEv7o_I/AAAAAAAADf4/33ogUoAlVC0k1khRuwyLxs02Oo3-vrNLgCLcBGAsYHQ/s480/giphy.gif
categories:
  - Tech
tags:
  - Kotlin
toc: true
toc_sticky: true
---

### Generics Intro

The first time i was introduced to the term Generics was back in C++ STL (Standard Template Library) days. It was an idea to allow type (`Int`, `String`, `Class`, etc) to be a parameter to the class, function or interface. It is to allow programmer to write a general algorithm that will work with any data type by loosing type constraints.

A good example in Kotlin is the collection classes, such as `List`, `Set` and `Map`. These collections are able to hold any other objects regardless of their types.

### Kotlin universal type

Before we go into how the generic code looks like, one thing that we should aware is the universal type in Kotlin. The universal type is a type that is the parent of all other types. In Kotlin, it is called `Any`. As the name implies, `Any` allows any type of argument. If you have a function that returns a variety of types and they have nothing in common, `Any` could solve the problem.

### Generics Class

To define a generic type, we usually add angle bracket (`<>`) containing one or more generic placeholders and put this generic specification after the class name.

```kotlin
class GenericHolder<T> (
  private val value : T
) {
  fun getValue(): T = value
}

val usage1 = GenericHolder(1)
print(usage1.getValue()) // 1

val usage2 = GenericHolder("Hello")
print(usage2.getValue()) //"Hello"
```

You may now wonder why we are using the generic type `<T>`. Can’t we use the type `Any` instead? Well. Let’s see this example below.

```kotlin
class AnyHolder (
  private val value : Any
) {
  fun getValue(): Any = value
}

class Car {
  fun drive() = "Vrooom"
}

val usage = AnyHolder(Car())
val maybeCar = usage.getValue()

print(maybeCar.drive()) // won't compile
```

As you can see, `Any` does work for simple cases, but as soon as we want to use the underlying function of Car - it doesn’t work because the complier has lost track about a fact that it was a Car when it assigned to `Any`. Therefore, maybeCar is actually `Any` data type and not a Car anymore.

If we use the generic on the other hand, it retains the information that, in this example, we still know that it is a `Car`, which means we can perform the functions on the `Car` class.

### Generic Function

So far, we looked at Generic class. In function, there is not much different from the class. We specify a generic type parameter in an angle brackets before the function name:

`fun <T> something<arg: T>: T = arg`

On top of function, the generic can also be used in generic extension functions for collections. For example,

```kotlin
fun <T> List<T>.first(): T {
  if (isEmpty()) throw NoSuchElementException("Empty List")
  return this[0]
}
```

As you can see `first()` extension function for `List`, it can work with any kind of `List`. To return `T`, they must be generic function.

### Summary

One of the most compelling initial motivations for generics is to create collection classes, which you have seen in the `List` example. The `Any` works for simple cases, but lost some information during casting. Therefore, generic type are a better choice for programmer when writing classes or functions with maximum expressiveness by loosing type constraints.
