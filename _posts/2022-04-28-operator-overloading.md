---
title: "Operator Overloading"
header:
  image: https://images.pexels.com/photos/4383910/pexels-photo-4383910.jpeg
categories:
  - Tech
tags:
  - Kotlin
  - Advanced
---

Back in the school while I was learning C++, operator overloading was one of the topics in academic. But in practice, I rarely overload operators. However, in Kotlin, we do use the overload operators, without noticing.

```kotlin
val list: List = listOf('a', 'b', 'c', 'd', 'e', 'f')
print(list[0]) //a
print(list.get(2)) //c
print('d' in list) //true
print(list.contains('e')) //true
```

Accessing list elements using _square bracket_ calls the overloaded operators `get()` and `set()`, while `in` calls `contains()`.

### What is operator overloading

> In programming, _overloading_ means adding extra meaning to something that is already exists.

For example, operator overloading allows us to use `+` to do something meaningful for our custom data type. This concept was popular back in C++ days, but because C++ had no garbage collection, writing overloaded operators were difficult. Java deemed operator overloading as "bad" and didn't allow it in Java. Python language demonstrated the simplicity of operator overloading with the support of garbage collection. It constraints us to a **limited** set of operators, so as C++ did. Scala experimented with allowing to invent own operators, but the feature was abused by some programmers and created incomprehensible code. Kotlin simplified the process, but restricts the choice to a reasonable and familiar set of operators.

### How it looks

In order to overload operator, Kotlin uses the keyword `operator`.

```kotlin
data class Num(val n: Int)

operator fun Num.plus(rhs: Num) =
  Num(n + rhs.n)

Num(4) + Num(4) // Num(8)
Num(4).plus(Num(2)) // Num(6)
```

What if we want to make `n` as `private` in the data class `Num`? In this case, the extension function could not access to `n` for `rhs`. We could consider defining an operator as member function then it will be fine.

```kotlin
data class Car(private val wheels: Int) {
  operator fun plus(anotherCar: Car) =
    Car(wheels + anotherCar.wheel)
}

Car(4) + Car(6) // Car(10)
```

### Equality

Invoking `==` (equality) or `!=` (inequality) calls the `equals()` member function. `data class` automatically redefine `equals()` to compare the stored data, but if we don't redefine `equals()` for non-`data` classes, the default version compares **_reference_** rather than contents.

```kotlin
class A(val i: Int)
data class D(val i: Int)

fun main() {
  // normal class
  val a = A(1)
  val b = A(1)
  val c = a

  print(a == b) // false
  print(a == c) // true

  // data class
  val d = D(1)
  val e = D(1)

  print(d == e) // true
}

class E(var v: Int) {
  override fun equals(other: Any?) = when {
    this === other -> true // same object in memory will result true
    other !is E -> false // must be same type
    else -> v == other.v // stored data
  }

  override fun hashCode(): Int = v

  override fun toString() = "E($v)"
}

val a = E(1)
val b = E(2)
```

### Arithmetic operators

Let's try arithmetic operators (eg. `+`, `-`) as extension to `class E`.

```kotlin
// Unary operators
operator fun E.unaryPlus() = E(v) // +a
operator fun E.unaryMinus() = E(-v) // -a
operator fun E.not() = this // !a

// Increment/decrement
operator fun E.inc() = E(v + 1) // a++
operator fun E.dec() = E(v - 1) // a--

// Binary
operator fun E.plus(e: E) = E(v + e.v) // a + b
operator fun E.minus(e: E) = E(v - e.v) // a - b
operator fun E.times(e: E) = E(v * e.v) // a * b
operator fun E.div(e: E) = E(v / e.v) // a / b
operator fun E.rem(e: E) = E (v % e.v) // a % b

// Augmented assignment
operator fun E.plusAssign(e: E) { v += e.v } // a += b
operator fun E.minusAssign(e: E) { v -= e.v } // a -= b
operator fun E.timesAssign(e: E) { v *= e.v } // a *= b
operator fun E.divAssign(e: E) { v /= e.v } // a /= b
operator fun E.remAssign(e: E) { v %= e.v } // a %= b
```

### Invoke

Placing parentheses after an object generates a call to `invoke()`. The `invoke()` operator makes an object look like a function.

```kotlin
class Cost {
  operator fun invoke() = "invoke()"
  operator fun invoke(i: Int) = "invoke($i)"
  operator fun invoke(i: Int, j: String) = "invoke($i, $j)"
  operator fun invoke(i: Int, j: String, k: Double) = "invoke($i, $j, $k)"
}

val cost = Cost()
cost() //"invoke()"
cost(1) //"invoke(1)
cost(2, "hey") //invoke(2, hey)
cost(3, "you", 1.5) //invoke(3, you, 1.5)
```

### Conclusion

Operator overloading is not an essential feature, but is an excellent example of how a language is more than just a way to manipulate the underlying computer. With overloading, we have been able to express the abstractions, so other humans have an easier time to understand the code without getting bogged down in needless details.
