---
title: "Things that you might not know about Collections"
header:
  image: https://miro.medium.com/max/1400/1*6d5dw6dPhy4vBp2vRW6uzw.png
categories:
  - Tech
tags:
  - Kotlin
  - Functional Programming
---

Most functional programming has a great support for working with collections and so is Kotlin. If you are coding with Kotlin for sometimes, you might notice about `map()`, `filter()`, `any()` and `forEach()`.

In Kotlin programming, we use collections extensively - `List`, `MutableList` and etc.

### 1. Am i a constructor?

![constructor](https://www.justwatch.com/images/backdrop/174496094/s640/bob-the-builder){: .align-center}

Take a look at this piece of code

```kotlin
val list = List(5) { 'a' + it }
// output: [a, b, c, d, e]
```

This version of the `List` constructor has two parameters - the size of the `List` and a lambda that initializes each `List` element.

> Remember that if a lambda is the last argument, it can be separated from the argument list.

Next, let’s look at `MutableList`. It can be initialized the same way.

```kotlin
val mutableList = MutableList(5, { it })
// [0, 1, 2, 3, 4]
```

Here is the interesting piece - both `List()` and `MutableList()` are not constructors in the Collections. They are **_functions_**. Their names begin with upper case intentionally, to make them look like constructor.

### 2. Filter(), the best option?

![filter](https://sebastien-arbogast.com/wp-content/uploads/2009/01/entrepreneur.gif){: .align-center}

`filter()` returns a group of elements satisfying the given predicate. What if you want the remaining of the group? It is `filterNot()` - that will do the work. In life, sometimes, you want us both - then how?

```kotlin
val list = listOf(-3, -1, 0, 1, 3)
val isPositive = { i: Int -> i > 0 }

// Option 1
val posOpt1 = list.filter(isPositive)
val negOpt1 = list.filterNot(isPositive)

// Option 2
val (posOpt2,negOpt2) = list.partition { it > 0 }
```

`partition()` produces a `Pair` object containing `Lists`.

### 3. Collection function on non comparable elements

![collections](https://aatestlabs.com/assets/img/pages/michigan-product-testing.jpg){: .align-center}

In `List`, we have functions like `sum()` or `sorted()` for a list of comparable elements. But what happens when we have a list of non-comparable elements? we have counterparts - `sumBy()` and `sortedBy()`.

```kotlin
data class Product {
  val title: String,
  val price: Double
}

val products = listOf(
  Product("Pen", 2.5),
  Product("Ruler", 1.0)
)

products.sumByDouble { it.price } // 3.5
products.sortedByDescending { it.price }
```

We have two functions `sumBy()` and `sumByDouble()` to sum integer and double values respectively. `sorted()` and `sortedBy()` sort the collection in ascending order, while `sortedDescending()` and` sortedByDescending()` sort the collection in descending order.

## Summary

Even though we only talk about `List`, operations like the above are also available for other collections like `Set`.
