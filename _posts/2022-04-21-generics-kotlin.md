---
title: "Generics in Kotlin"
header:
  image: https://images.pexels.com/photos/2166456/pexels-photo-2166456.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Advanced
---

I love template in C++ in the olden day. In many good languages that I had chance to come across, such as TypeScript, Java (it was added later) and Kotlin, they too also have the Generic code. Generic code works with types that are "_specified later_".

### Base object (OOP) approach

Ordinary classes and functions work with specific types (eg. `String`, `Int`, `MyCustomClass`). If I want the same code to work across more types, the rigidity (inflexibility) could be overwhelming. From Object Oriented Programming (OOP) concept, we might recall _Polymorphism_ to solve this. The idea is that we could write a function that will take **base** class object as a parameter. We could call the function with an object of any class that is derived from that **base** class. Now, our function is more general, and could be used in more places.

The downside of it that this might lead to very limiting because we must inherit from that single hierarchy.

### What about an interface instead of an object?

Let us consider what if our function takes an interface instead of **base** object? It could loosen the single hierarchy limitation. Anything that implement the interface is able to replace the function parameter. Using interface, we could cut across class hierarchy.

However, sometimes, even an interface is too restrictive because it forces us to work only with that interface. The good news is that we could make our code even more general if it works with any type that is yet to be specified. This unspecified type is a **_generic type_** parameter.

### Wait, how about `Any`?

Oh ya. We have `Any` data type. It is the root of the Kotlin class hierarchy and every Kotlin class has `Any` as a superclass (remember Base object approach). So we could make our function to take `Any` as argument type and it could work. If `Any` works for you and it is simpler solution, use it.

> Simplicity is what we aim for in software development.

### Generics

The question that most of us ask ourselves is "when should we use generic". Duplicated code is a good candidate for conversion into a generic function or type. The way to make generic is by using `<>` and a placeholder like `T` to represent unknown type.

```kotlin
fun <T> giveMeBack(arg: T): T {
  return arg
}

giveMeBack(1) // 1
giveMeBack("echo") // echo
```

### Preserve Type Info

Code within generic class and functions can't know the type of `T` - this is called **\*erasure**. Generics can be thought of a way to preserve type information for the return value. Let's take an example.

```kotlin
class Toy {
  override fun toString() = "Toy"
}

class ToyBox(private var toy: Toy) {
  fun put(aToy: Toy) { toy = aToy }
  fun get(): Toy = toy
}
```

In the above code, when we call `get()` of `ToyBox`, the result comes back as type `Toy`. And we think this box could be used not only for `Toy`, but also any other thing. Could we make `Box` more generic?

```kotlin
class Book {
  override fun toString() = "Book"
}

open class Box<T>(private var obj: T) {
  fun put(aObj: T) { obj = aObj }
  fun get(): T = obj
}

val toy: Toy = Box(Toy()).get()
val book: Book = Box(Book()).get()
```

`Box<T>` is to ensure that we could only `put()` a `T` type only and when we call `get()` on that `Box`, the result comes back as type `T`.

### Generic extension function

Let's do some advanced stuff. We could make `map()` for `Box` by defining a generic extension function.

```kotlin
fun <T,R> Box<T>.map(f:(T) -> R): List<R> {
  return listOf(f(get()))
}

val bookX = Box(Book()).map { it.toString() + "X" } //[bookX]
```

### Type Eraser

In Java, generics are not part of the original language - they were added [later](https://docs.oracle.com/javase/1.5.0/docs/guide/language/index.html). Forcing generics into Java without breaking the existing code required a crucial compromise: _the generic types are only available during compilation but are not preserved at runtime_. Hence the types are **_erased_**.

```kotlin
val strings = listOf("a", "b", "c")
val anyType: List<Any> = listOf("a", 3, 1.5)
useList(strings)
useList(anyType)

fun useList(list: List<Any>) {
  if (list is List<String>) { // <- uncomment this and you will see an error
    // do something
  }
}
```

Since the type information has been erased at runtime, If we uncomment the check, we will see an error - "Cannot check for instance of erased type: List<String>".
If the eraser didn't happen, the list might look like this:

| a | b | c | String |
| a | 3 | 1.5 | Any |

Because generic types are erased, type information is not stored in the `List`. Instead both `strings` and `anyType` are just `List`, with no additional type information.

| a | b | c |
| a | 3 | 1.5 |

### Why Kotlin chose to erase type

There could be possibly two reasons.

1. Java compatibility
2. Overhead - storing generic type info significantly increases the memory occupied by a generic `List` or `Map`. For example, a standard `Map` consists of many `Map.Entry` objects, and `Map.Entry` is a generic class. Thus, if generics were reified everywhere by default, each key and value of every `Map.Entry` would contain additional type info.

### What if we want to retain type information

To retain type information for function arguments, add the `reified` keyword.

```kotlin
fun <T: Any> a(kClass: KClass<T>) {
  // do something with kClass
}

fun <T: Any> b() = a(T::class)
```

When the function `b()` call the the function `a()`, it won't compile because the type information `T` is erased when this code runs and `T::class` is not recognized. In Java, we could solve it by passing type information into the function by hand (very inelegant):

```kotlin
fun <T: Any> c(kClass: KClass<T>) = a(kClass)

class K

val kc = c(K::class)
```

Even though `c()` could invoke the function `a()`, it seems redundant to pass explicit type information (`KClass<T>`). In elegant way, we expect the complier knows the type `T` and could silently pass it for us. Kotlin offers us with `reified`. The only catch is that the function must be `inline`.

```kotlin
inline fun <reified T: Any> d() = a(T:class)
```

The function `d()` produces the same result as `c()`, but `d()` doesn't require the class reference as an argument.

What else could `reified` do? It allows the use of `is` with a generic parameter type.

```kotlin
inline fun <reified T> check(t: Any) = t is T

check<String>("1") //true
check<Int>("1") //false
```

### Variance `in` or `out`

Combining generics and inheritance is possible and the result produces two dimensions of change. Let's say we have a `Box<T>` and want to assign it to `Box<U>` where `T` and `U` have an inheritance relationship. In this case, we must place the constraints `in` or `out` variance annotations, depending on the usage.

```kotlin
class Box<T>(private var obj: T) {
  fun put(aObj: T) { obj = aObj }
  fun get(): T = obj
}

class BoxIn<in T>(private var obj: T) {
  fun put(aObj: T) { obj = aObj }
}

class BoxOut<out T>(private var obj: T) {
  fun get(): T = obj
}
```

`BoxIn` uses `in` constraint to strictly indicate the intention and only allows the `T` as input into the class. Likewise, `out` constraint will only the `T` to go out, but not allowed to come in. Then what do we want that?

```kotlin
open class Fruit
class Apple : Fruit()
class Orange : Fruit()
```

Both `Apple` and `Orange` are subtypes of `Fruit`. But is there any relation between `Apple` and `Orange`? A `Box` of `Apple` should be able to assign to `Box` of `Fruit` or `Box` of `Any`(because `Any` is the supertype in Kotlin). But we do not want `Box` of `Orange` to be put into `Box` of `Apple`, violating the pureness of `Apple` in the `Box`. Worse if we allow `Box` of `Any` into `Box` of `Apple`, there is no type safety at all.

So we want to prevent the use of `put()` such that no one can put a `Orange` into an `BoxOut<Apple>`.

```kotlin
val boxAppleOut: BoxOut<Apple> = BoxOut(Apple())
val boxFruitOut: BoxOut<Fruit> = boxAppleOut
val boxAnyOut: BoxOut<Any> = boxFruitOut
```

With no `put()` allowed in `out` constraint, we could ensure that no one will intentionally or accidentally put wrong type. Therefore, it preserves the pureness of the type. In this example above,

- `Box<T>` is _invariant_.
- `BoxOut<out T>` is _covariant_.
- `BoxIn<in T>` is _contravariant_.

### Conclusion

The generic topic is usually a bit confusing to most people especially you are totally new to template language. But it can make code really elegant and easy to work with once you understand how it works. You could avoid a lot of duplications with the help from generic. To understand more, you could also read the [Kotlin Generic](https://kotlinlang.org/docs/generics.html).
