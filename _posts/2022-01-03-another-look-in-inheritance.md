---
title: "Another look in Inheritance"
header:
  image: https://images.pexels.com/photos/761297/pexels-photo-761297.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Object Oriented Programming
---

We touched a bit on Inheritance concept. Inheritance is sometimes used to add functions to a class as a way of reuse for a new purpose.

But is this always a good choice?

Class delegation is midway between composition and inheritance. Like composition, we have to place the member inside our class. Like inheritance, it exposes the interface of the sub object.

```kotlin
open class Heater {
    fun heat(temp: Int) = "Heating to $temp"
}

class Aircon: Heater() {
    fun cool(temp: Int) = "Cooling to $temp"
}

fun warmingUp(heater: Heater) {
    heater.heat(70)
}

fun upAndDown(aircon: Aircon) {
    aircon.heat(70)
    aircon.cool(20)
}

val heater = Heater()
val aircon = Aircon()
warmingUp(heater)
warmingUp(aircon)
upAndDown(aircon)
```

The code above is seen logical. Since `Heater` cannot do all the functions we want, we need to create `Aircon` who inherits `Heater` and then add some extra cooling functions. However, you might recall in Upcasting that when you upcast, you lose some info.

> Liskov Substitution Principle says functions that accept a base class must be able to use the objects of derived classes without knowing it. It is all substitutability.

`warmingUp()` takes `heater` as argument and also accept `aircon` due to _Liskov Substitution Principle_. You might lose some useful info about `aircon` during upcasting. Although modern OO programming allows the addition of functions during inheritance, this can be a “code smell”. It might negatively impact a later maintainer of the code as _technical debt_.

### Alternative

What we really wanted in previous example is a `Heater` class with `cool()` function, so that `upAndDown` function works. Why not extension function? It does the same thing without inheritance.

```kotlin
fun Heater.cool(temp: Int) = "Cooling to $temp"

fun upAndDown(heater: Heater) {
    aircon.heat(70)
    aircon.cool(20)
}
```

### Interface by Convention

An extension function can be considered as creating an interface containing a single function.

```kotlin
class X
fun X.f() {}

class Y
fun Y.f() {}

callF(x:X) = x.f()
callF(y:Y) = y.f()
```

Although both `X` and `Y` has a member function `f()`, but we don’t get polymorphic behaviour. `callF()` have to make separately for `X` and `Y`. The “interface by convention” is extensively used in Kotlin libraries, especially when dealing with collections.

### Members vs Extension

There are cases where you are forced to use member functions rather than extensions. If a function must access a `private` member, you have no choice but to make it a member function:

```kotlin
class Z(var i: Int = 0) {
    private var j = 0
    fun inc() {
        i++
        j++
    }
}

fun Z.dec() {
    i--
    //j--
}
```

the variable `j` is not accessible since it is a private member of the class. The main drawback of the extension function is that they cannot be overridden.

### Summary

Languages like C++ and Java allow inheritance unless you specially disallow it. Kotlin assumes that you won’t be using inheritance – it actively prevents inheritance and polymorphism unless they are intentionally allowed using the `open` keyword.

> Often, functions are all you need. Sometimes objects are very useful. Objects are one tool among many, but they’re not for everything.

Consider whether you need inheritance at all, and apply the maxim _Prefer extension functions and composition to inheritance_.
